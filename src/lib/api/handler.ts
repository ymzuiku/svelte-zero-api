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

	api.body = ('body' in api) && JSON.stringify(api.body) || void 0
	const isForm = Object.prototype.toString.call(api.body) === '[object FormData]'

	if (!('content-type' in api.headers))
		api.headers['content-type'] = isForm ? 'multipart/form-data' : 'application/json'

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
	
	const response = fetch(url, { ...baseData, ...api })
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
		continue:                      function (cb: Fn) { return handleCallback(100, cb) },
		switchingProtocols:            function (cb: Fn) { return handleCallback(101, cb) },
		processing:                    function (cb: Fn) { return handleCallback(102, cb) },

		// 2××
		ok:                            function (cb: Fn) { return handleCallback(200, cb) },
		created:                       function (cb: Fn) { return handleCallback(201, cb) },
		accepted:                      function (cb: Fn) { return handleCallback(202, cb) },
		nonAuthoritativeInformation:   function (cb: Fn) { return handleCallback(203, cb) },
		noContent:                     function (cb: Fn) { return handleCallback(204, cb) },
		resetContent:                  function (cb: Fn) { return handleCallback(205, cb) },
		partialContent:                function (cb: Fn) { return handleCallback(206, cb) },
		multiStatus:                   function (cb: Fn) { return handleCallback(207, cb) },
		alreadyReported:               function (cb: Fn) { return handleCallback(208, cb) },
		IMUsed:                        function (cb: Fn) { return handleCallback(226, cb) },

		// 3××
		multipleChoices:               function (cb: Fn) { return handleCallback(300, cb) },
		movedPermanently:              function (cb: Fn) { return handleCallback(301, cb) },
		found:                         function (cb: Fn) { return handleCallback(302, cb) },
		checkOther:                    function (cb: Fn) { return handleCallback(303, cb) },
		notModified:                   function (cb: Fn) { return handleCallback(304, cb) },
		useProxy:                      function (cb: Fn) { return handleCallback(305, cb) },
		switchProxy:                   function (cb: Fn) { return handleCallback(306, cb) },
		temporaryRedirect:             function (cb: Fn) { return handleCallback(307, cb) },
		permanentRedirect:             function (cb: Fn) { return handleCallback(308, cb) },

		// 4××
		badRequest:                    function (cb: Fn) { return handleCallback(400, cb) },
		unauthorized:                  function (cb: Fn) { return handleCallback(401, cb) },
		paymentRequired:               function (cb: Fn) { return handleCallback(402, cb) },
		forbidden:                     function (cb: Fn) { return handleCallback(403, cb) },
		notFound:                      function (cb: Fn) { return handleCallback(404, cb) },
		methodNotAllowed:              function (cb: Fn) { return handleCallback(405, cb) },
		notAcceptable:                 function (cb: Fn) { return handleCallback(406, cb) },
		proxyAuthenticationRequired:   function (cb: Fn) { return handleCallback(407, cb) },
		requestTimeout:                function (cb: Fn) { return handleCallback(408, cb) },
		conflict:                      function (cb: Fn) { return handleCallback(409, cb) },
		gone:                          function (cb: Fn) { return handleCallback(410, cb) },
		lengthRequired:                function (cb: Fn) { return handleCallback(411, cb) },
		preconditionFailed:            function (cb: Fn) { return handleCallback(412, cb) },
		payloadTooLarge:               function (cb: Fn) { return handleCallback(413, cb) },
		URITooLong:                    function (cb: Fn) { return handleCallback(414, cb) },
		unsupportedMediaType:          function (cb: Fn) { return handleCallback(415, cb) },
		rangeNotSatisfiable:           function (cb: Fn) { return handleCallback(416, cb) },
		expectationFailed:             function (cb: Fn) { return handleCallback(417, cb) },
		imATeapot:                     function (cb: Fn) { return handleCallback(418, cb) },
		misdirectedRequest:            function (cb: Fn) { return handleCallback(421, cb) },
		unprocessableEntity:           function (cb: Fn) { return handleCallback(422, cb) },
		locked:                        function (cb: Fn) { return handleCallback(423, cb) },
		failedDependency:              function (cb: Fn) { return handleCallback(424, cb) },
		upgradeRequired:               function (cb: Fn) { return handleCallback(426, cb) },
		preconditionRequired:          function (cb: Fn) { return handleCallback(428, cb) },
		tooManyRequests:               function (cb: Fn) { return handleCallback(429, cb) },
		requestHeaderFieldsTooLarge:   function (cb: Fn) { return handleCallback(431, cb) },
		unavailableForLegalReasons:    function (cb: Fn) { return handleCallback(451, cb) },

		// 5××
		internalServerError:           function (cb: Fn) { return handleCallback(500, cb) },
		notImplemented:                function (cb: Fn) { return handleCallback(501, cb) },
		badGateaway:                   function (cb: Fn) { return handleCallback(502, cb) },
		serviceUnavailable:            function (cb: Fn) { return handleCallback(503, cb) },
		gatewayTimeout:                function (cb: Fn) { return handleCallback(504, cb) },
		HTTPVersionNotSupported:       function (cb: Fn) { return handleCallback(505, cb) },
		variantAlsoNegotiates:         function (cb: Fn) { return handleCallback(506, cb) },
		insufficientStorage:           function (cb: Fn) { return handleCallback(507, cb) },
		loopDetected:                  function (cb: Fn) { return handleCallback(508, cb) },
		notExtended:                   function (cb: Fn) { return handleCallback(510, cb) },
		networkAuthenticationRequired: function (cb: Fn) { return handleCallback(511, cb) }
	}
}