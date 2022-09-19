type Fn = (response: SvelteResponse) => any
type Callback = [number, Fn]

interface APIContent {
	headers: Record<string, string>
	body: any
	query: Record<any,any>
	method: string
	// [key: string]: any
}

interface IOptions {
	path: string
	config: ZeroAPIConfig
	fetch: typeof fetch
}

function stringifyQuery(api: APIContent) {
	// Each key in query, if it's an object, will be stringified
	for (const key of Object.keys(api.query)) {
		if (typeof api.query[key] === 'object')
			api.query[key] = JSON.stringify(api.query[key])
	}
}

type $ = {
	callback: Callback | undefined,
	promise: Promise<any> | undefined,
	resolve: ((value?: any) => void) | undefined,
}

export default function handler(options: IOptions, api: APIContent) {
	const { fetch } = options
	
	const stringifyQueryObjects = options.config.stringifyQueryObjects === undefined ? true : options.config.stringifyQueryObjects
	if (stringifyQueryObjects && 'query' in api) 
		stringifyQuery(api)

	const url = options.config.baseUrl || '' + options.path + ('query' in api ? '?' + new URLSearchParams(api.query).toString() : '')
	const baseData = options.config.baseData || {}

	const isForm = Object.prototype.toString.call(api.body) === '[object FormData]'
	if (!('content-type' in api.headers))
		api.headers['content-type'] = api.headers['content-type'] || isForm ? 'multipart/form-data' : 'application/json'

	api.body = 'body' in api ? typeof api.body === 'object' && JSON.stringify(api.body) : '{}'

	if (api.method === 'GET' && !('cache-control' in api.headers))
		api.headers['cache-control'] = 'public, max-age=604800, immutable'

	api.headers['x-requested-with'] = 'sveltekit-zero-api'

	const callbacks: Callback[] = []

	// * $. callback handlers
	const $: $ = {
		callback: undefined,
		promise: undefined,
		resolve: undefined,
	 }

	// Resolves the whole request
	let resolver: (value: any) => void
	let promiser = new Promise(resolve => resolver = resolve)

	let fetchAPI: Record<any, any> = {
		...callbackHandler((s, cb) => {
			callbacks.push([s, cb]); return proxy
		}),
		...promiser
	}
	
	fetchAPI['_'] = fetchAPI
	fetchAPI['$'] = callbackHandler((s, cb) => {
		$.callback = [s, cb]
		$.promise = new Promise(resolve => $.resolve = resolve)
		$.promise.then(d => resolver(d))
		return promiser
	})
	
	const response = fetch(url, { ...baseData, ...api, headers: { ...(baseData['headers'] || {}), ...(api['headers'] || {}) } })
	response.then(async (res) => {
		const response = {
			body: await res[options.config.format || 'json'](),
			bodyUsed: res.bodyUsed,
			headers: res.headers,
			ok: res.ok,
			redirected: res.redirected,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
			url: res.url
		} as Response
		respond(callbacks, response, options, $)
		if (!$.promise) resolver(response)
	})

	response.catch((err) => {
		if ('onError' in options.config)
			options.config.onError && options.config.onError(err)
		throw err
	})

	const proxy = new Proxy(fetchAPI, {
		get(target, prop: string) {
			if (prop === 'then')
				return promiser.then.bind(promiser)
			if (prop === 'catch')
				return promiser.catch.bind(promiser)
			if (prop === 'finally')
				return promiser.finally.bind(promiser)
			return target[prop]
		}
	})
	return proxy
}

function respond(callbacks: Callback[], res: Response, options: IOptions, $: $) {
	let statusRange = Math.floor(res.status / 100)
	let responseError = statusRange === 4 || statusRange === 5

	const validStatus
		= (code: number) => code === 0 || code === statusRange || code === res.status || (responseError && code === 45)

	const { prependCallbacks } = options.config
	if (prependCallbacks) {
		let cbs: Callback[] = []
		let prepender = callbackHandler((s, cb) => {
			cbs.push([s, cb])
			return prepender
		})
		prependCallbacks(prepender)
		callbacks = [...cbs, ...callbacks]
	}
	
	callbacks
		.filter(([code]) => validStatus(code))
		.forEach(([code, cb]) => { cb(res) })
	
	if ($.resolve && $.callback) {
		if (validStatus($.callback[0]))
			$.resolve($.callback[1](res))
		else
			$.resolve(undefined)
	}
	
	if ('onSuccess' in options.config)
		options.config.onSuccess && options.config.onSuccess(res)
}


function callbackHandler(handleCallback: (statusCode: number, callback: Fn) => any) {
	return {
		// "Any response"
		any:                           function (cb: Fn) { return handleCallback(0,   cb) },

		// general
		informational:                 function (cb: Fn) { return handleCallback(1,   cb) },
		success:                       function (cb: Fn) { return handleCallback(2,   cb) },
		redirection:                   function (cb: Fn) { return handleCallback(3,   cb) },
		error:                         function (cb: Fn) { return handleCallback(45,  cb) },
		clientError:                   function (cb: Fn) { return handleCallback(4,   cb) },
		serverError:                   function (cb: Fn) { return handleCallback(5,   cb) },

		// 1××
		Continue:                      function (cb: Fn) { return handleCallback(100, cb) },
		SwitchingProtocols:            function (cb: Fn) { return handleCallback(101, cb) },
		Processing:                    function (cb: Fn) { return handleCallback(102, cb) },
		EarlyHints:                    function (cb: Fn) { return handleCallback(103, cb) },

		// 2××
		Ok:                            function (cb: Fn) { return handleCallback(200, cb) },
		Created:                       function (cb: Fn) { return handleCallback(201, cb) },
		Accepted:                      function (cb: Fn) { return handleCallback(202, cb) },
		NonAuthoritativeInformation:   function (cb: Fn) { return handleCallback(203, cb) },
		NoContent:                     function (cb: Fn) { return handleCallback(204, cb) },
		ResetContent:                  function (cb: Fn) { return handleCallback(205, cb) },
		PartialContent:                function (cb: Fn) { return handleCallback(206, cb) },
		MultiStatus:                   function (cb: Fn) { return handleCallback(207, cb) },
		AlreadyReported:               function (cb: Fn) { return handleCallback(208, cb) },
		IMUsed:                        function (cb: Fn) { return handleCallback(226, cb) },

		// 3××
		MultipleChoices:               function (cb: Fn) { return handleCallback(300, cb) },
		MovedPermanently:              function (cb: Fn) { return handleCallback(301, cb) },
		Found:                         function (cb: Fn) { return handleCallback(302, cb) },
		SeeOther:                      function (cb: Fn) { return handleCallback(303, cb) },
		NotModified:                   function (cb: Fn) { return handleCallback(304, cb) },
		UseProxy:                      function (cb: Fn) { return handleCallback(305, cb) },
		SwitchProxy:                   function (cb: Fn) { return handleCallback(306, cb) },
		TemporaryRedirect:             function (cb: Fn) { return handleCallback(307, cb) },
		PermanentRedirect:             function (cb: Fn) { return handleCallback(308, cb) },

		// 4××
		BadRequest:                    function (cb: Fn) { return handleCallback(400, cb) },
		Unauthorized:                  function (cb: Fn) { return handleCallback(401, cb) },
		PaymentRequired:               function (cb: Fn) { return handleCallback(402, cb) },
		Forbidden:                     function (cb: Fn) { return handleCallback(403, cb) },
		NotFound:                      function (cb: Fn) { return handleCallback(404, cb) },
		MethodNotAllowed:              function (cb: Fn) { return handleCallback(405, cb) },
		NotAcceptable:                 function (cb: Fn) { return handleCallback(406, cb) },
		ProxyAuthenticationRequired:   function (cb: Fn) { return handleCallback(407, cb) },
		RequestTimeout:                function (cb: Fn) { return handleCallback(408, cb) },
		Conflict:                      function (cb: Fn) { return handleCallback(409, cb) },
		Gone:                          function (cb: Fn) { return handleCallback(410, cb) },
		LengthRequired:                function (cb: Fn) { return handleCallback(411, cb) },
		PreconditionFailed:            function (cb: Fn) { return handleCallback(412, cb) },
		PayloadTooLarge:               function (cb: Fn) { return handleCallback(413, cb) },
		URITooLong:                    function (cb: Fn) { return handleCallback(414, cb) },
		UnsupportedMediaType:          function (cb: Fn) { return handleCallback(415, cb) },
		RangeNotSatisfiable:           function (cb: Fn) { return handleCallback(416, cb) },
		ExpectationFailed:             function (cb: Fn) { return handleCallback(417, cb) },
		ImATeapot:                     function (cb: Fn) { return handleCallback(418, cb) },
		MisdirectedRequest:            function (cb: Fn) { return handleCallback(421, cb) },
		UnprocessableEntity:           function (cb: Fn) { return handleCallback(422, cb) },
		Locked:                        function (cb: Fn) { return handleCallback(423, cb) },
		FailedDependency:              function (cb: Fn) { return handleCallback(424, cb) },
		TooEarly:                      function (cb: Fn) { return handleCallback(425, cb) },
		UpgradeRequired:               function (cb: Fn) { return handleCallback(426, cb) },
		PreconditionRequired:          function (cb: Fn) { return handleCallback(428, cb) },
		TooManyRequests:               function (cb: Fn) { return handleCallback(429, cb) },
		RequestHeaderFieldsTooLarge:   function (cb: Fn) { return handleCallback(431, cb) },
		UnavailableForLegalReasons:    function (cb: Fn) { return handleCallback(451, cb) },

		// 5××
		InternalServerError:           function (cb: Fn) { return handleCallback(500, cb) },
		NotImplemented:                function (cb: Fn) { return handleCallback(501, cb) },
		BadGateway:                    function (cb: Fn) { return handleCallback(502, cb) },
		ServiceUnavailable:            function (cb: Fn) { return handleCallback(503, cb) },
		GatewayTimeout:                function (cb: Fn) { return handleCallback(504, cb) },
		HTTPVersionNotSupported:       function (cb: Fn) { return handleCallback(505, cb) },
		VariantAlsoNegotiates:         function (cb: Fn) { return handleCallback(506, cb) },
		InsufficientStorage:           function (cb: Fn) { return handleCallback(507, cb) },
		LoopDetected:                  function (cb: Fn) { return handleCallback(508, cb) },
		NotExtended:                   function (cb: Fn) { return handleCallback(510, cb) },
		NetworkAuthenticationRequired: function (cb: Fn) { return handleCallback(511, cb) }
	}
}