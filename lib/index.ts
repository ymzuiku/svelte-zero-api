import * as StatusCode from '../httpcodes'
const cache = {} as any;

export type QueryGet<T extends { query?: Record<string, unknown> }> = QueryGetter<T> & Omit<T, 'query'>
export type ExtractGenericQueryGet<Type> = Type extends QueryGet<infer X> ? Pick<X, 'query'> : {}

interface QueryGetter<T extends { query?: Record<string, unknown> }> {
	url: {
		searchParams: {
			get?: <K extends keyof T["query"]>(key: K) => string;
		}
	};
}

interface IOptions extends RequestInit {
	baseData?: any;
	format?: "text" | "json";
	cacheTime?: number;
	baseUrl?: string;
	// reduce?: (res: any) => Promise<any>;
	onSuccess?: (res: any) => Promise<any>;
	onError?: (res: any) => Promise<any>;
}

interface FetchProxy extends Partial<Promise<Response>> {
	promise: Promise<Response>
	[s: string]: any
}

export function baseApi(url: string, obj?: any, opt: IOptions = {}, loadFetch: any = undefined) {
	let body: any = void 0;

	body = obj && JSON.stringify(obj);
	const realUrl = (opt.baseUrl || "") + url;
	const cacheKey = realUrl + body;

	if (opt.cacheTime) {
		const old = cache[cacheKey];
		if (old && Date.now() - old.time < opt.cacheTime) {
			return old;
		}
	}

  	const isForm = Object.prototype.toString.call(obj) === "[object FormData]";

	if (!opt.headers) {
		opt.headers = {};
	}

	if (!opt.headers["Content-Type"]) {
		if (isForm) {
			opt.headers["Content-Type"] = "application/x-www-form-urlencoded";
		} else {
			opt.headers["Content-Type"] = "application/json";
		}
	}

	if (opt.method === "GET" && !opt.headers["Cache-Control"]) {
		opt.headers["Cache-Control"] = "public, max-age=604800, immutable";
	}

	opt.headers['X-Requested-With'] = 'sveltekit-zero-api'

	// Make FetchAPI to be proxified
	

	let fetchApi = {
		promise: null,
		then: null,
		catch: null,
		finally: null
	}

	const callbacks = []
	const userSetCallbacks = {
		// "Any response"
		any:						   function (cb) { callbacks.push([0, cb]);  return fetchApi },
		// general
		informational:                 function (cb) { callbacks.push([1, cb]);  return fetchApi },
		success:                       function (cb) { callbacks.push([2, cb]);	 return fetchApi },
		redirection:                   function (cb) { callbacks.push([3, cb]);  return fetchApi },
		error:                         function (cb) { callbacks.push([45, cb]); return fetchApi },
		clientError:                   function (cb) { callbacks.push([4, cb]);  return fetchApi },
		serverError:                   function (cb) { callbacks.push([5, cb]);  return fetchApi },

		// 1××
		continue:                      function (cb) { callbacks.push([100, cb]);return fetchApi },
		switchingProtocols:            function (cb) { callbacks.push([101, cb]);return fetchApi },
		processing:                    function (cb) { callbacks.push([102, cb]);return fetchApi },

		// 2××
		ok:                            function (cb) { callbacks.push([200, cb]);return fetchApi },
		created:                       function (cb) { callbacks.push([201, cb]);return fetchApi },
		accepted:                      function (cb) { callbacks.push([202, cb]);return fetchApi },
		nonAuthoritativeInformation:   function (cb) { callbacks.push([203, cb]);return fetchApi },
		noContent:                     function (cb) { callbacks.push([204, cb]);return fetchApi },
		resetContent:                  function (cb) { callbacks.push([205, cb]);return fetchApi },
		partialContent:                function (cb) { callbacks.push([206, cb]);return fetchApi },
		multiStatus:                   function (cb) { callbacks.push([207, cb]);return fetchApi },
		alreadyReported:               function (cb) { callbacks.push([208, cb]);return fetchApi },
		IMUsed:                        function (cb) { callbacks.push([226, cb]);return fetchApi },

		// 3××
		multipleChoices:               function (cb) { callbacks.push([300, cb]);return fetchApi },
		movedPermanently:              function (cb) { callbacks.push([301, cb]);return fetchApi },
		found:                         function (cb) { callbacks.push([302, cb]);return fetchApi },
		checkOther:                    function (cb) { callbacks.push([303, cb]);return fetchApi },
		notModified:                   function (cb) { callbacks.push([304, cb]);return fetchApi },
		useProxy:                      function (cb) { callbacks.push([305, cb]);return fetchApi },
		switchProxy:                   function (cb) { callbacks.push([306, cb]);return fetchApi },
		temporaryRedirect:             function (cb) { callbacks.push([307, cb]);return fetchApi },
		permanentRedirect:             function (cb) { callbacks.push([308, cb]);return fetchApi },

		// 4××
		badRequest:                    function (cb) { callbacks.push([400, cb]);return fetchApi },
		unauthorized:                  function (cb) { callbacks.push([401, cb]);return fetchApi },
		paymentRequired:               function (cb) { callbacks.push([402, cb]);return fetchApi },
		forbidden:                     function (cb) { callbacks.push([403, cb]);return fetchApi },
		notFound:                      function (cb) { callbacks.push([404, cb]);return fetchApi },
		methodNotAllowed:              function (cb) { callbacks.push([405, cb]);return fetchApi },
		notAcceptable:                 function (cb) { callbacks.push([406, cb]);return fetchApi },
		proxyAuthenticationRequired:   function (cb) { callbacks.push([407, cb]);return fetchApi },
		requestTimeout:                function (cb) { callbacks.push([408, cb]);return fetchApi },
		conflict:                      function (cb) { callbacks.push([409, cb]);return fetchApi },
		gone:                          function (cb) { callbacks.push([410, cb]);return fetchApi },
		lengthRequired:                function (cb) { callbacks.push([411, cb]);return fetchApi },
		preconditionFailed:            function (cb) { callbacks.push([412, cb]);return fetchApi },
		payloadTooLarge:               function (cb) { callbacks.push([413, cb]);return fetchApi },
		URITooLong:                    function (cb) { callbacks.push([414, cb]);return fetchApi },
		unsupportedMediaType:          function (cb) { callbacks.push([415, cb]);return fetchApi },
		rangeNotSatisfiable:           function (cb) { callbacks.push([416, cb]);return fetchApi },
		expectationFailed:             function (cb) { callbacks.push([417, cb]);return fetchApi },
		imATeapot:                     function (cb) { callbacks.push([418, cb]);return fetchApi },
		misdirectedRequest:            function (cb) { callbacks.push([421, cb]);return fetchApi },
		unprocessableEntity:           function (cb) { callbacks.push([422, cb]);return fetchApi },
		locked:                        function (cb) { callbacks.push([423, cb]);return fetchApi },
		failedDependency:              function (cb) { callbacks.push([424, cb]);return fetchApi },
		upgradeRequired:               function (cb) { callbacks.push([426, cb]);return fetchApi },
		preconditionRequired:          function (cb) { callbacks.push([428, cb]);return fetchApi },
		tooManyRequests:               function (cb) { callbacks.push([429, cb]);return fetchApi },
		requestHeaderFieldsTooLarge:   function (cb) { callbacks.push([431, cb]);return fetchApi },
		unavailableForLegalReasons:    function (cb) { callbacks.push([451, cb]);return fetchApi },

		// 5××
		internalServerError:           function (cb) { callbacks.push([500, cb]);return fetchApi },
		notImplemented:                function (cb) { callbacks.push([501, cb]);return fetchApi },
		badGateaway:                   function (cb) { callbacks.push([502, cb]);return fetchApi },
		serviceUnavailable:            function (cb) { callbacks.push([503, cb]);return fetchApi },
		gatewayTimeout:                function (cb) { callbacks.push([504, cb]);return fetchApi },
		HTTPVersionNotSupported:       function (cb) { callbacks.push([505, cb]);return fetchApi },
		variantAlsoNegotiates:         function (cb) { callbacks.push([506, cb]);return fetchApi },
		insufficientStorage:           function (cb) { callbacks.push([507, cb]);return fetchApi },
		loopDetected:                  function (cb) { callbacks.push([508, cb]);return fetchApi },
		notExtended:                   function (cb) { callbacks.push([510, cb]);return fetchApi },
		networkAuthenticationRequired: function (cb) { callbacks.push([511, cb]);return fetchApi }
	}
	
	fetchApi = {...fetchApi, ...userSetCallbacks}
	fetchApi['_'] = userSetCallbacks
	
	var fetchOptions = {
		body,
		...opt,
		headers: opt.headers
	}

	// fetch  used in   load({fetch}) => api.something.post({ body...}, fetch)
	if (loadFetch != undefined) {
		fetchApi.promise = loadFetch(url, fetchOptions)
	}
	else { // traditional node fetch
		fetchApi.promise = fetch(realUrl, fetchOptions)
	}

	const promise = new Promise(resolve => {
		fetchApi.promise.then(async (res) => {
			const response = {
				body: await res[opt.format || "json"](),
				bodyUsed: res.bodyUsed,
				headers: res.headers,
				ok: res.ok,
				redirected: res.redirected,
				status: res.status,
				statusText: res.statusText,
				type: res.type,
				url: res.url
			}

			awaitFetch(callbacks, response, opt, cacheKey)
			resolve(response)
		})
	})	
	
	const proxy = new Proxy(fetchApi, {
		get(target, prop: string) {
			if (prop === 'then')
				return promise.then.bind(promise);
			if (prop === 'catch')
				return promise.catch.bind(promise);
			if (prop === 'finally')
				return promise.finally.bind(promise);
			return target[prop]
		}
	})

	return proxy
};

const awaitFetch = async (callbacks, res, opt, cacheKey) => {
	try {

		if (res.status >= 100 && res.status < 200) // 1××
			for (let i = 0; i < callbacks.length; i++) {
				const st = callbacks[i][0]
				if(st === 0 || st === 1 || (st >= 100 && st < 200))
					callbacks[i][1](res)
			}
		else if (res.status >= 200 && res.status < 300) // 2××
			for (let i = 0; i < callbacks.length; i++) {
				const st = callbacks[i][0]
				if(st === 0 || st === 2 || (st >= 200 && st < 300))
					callbacks[i][1](res)
			}
		else if (res.status >= 300 && res.status < 400) // 3××
			for (let i = 0; i < callbacks.length; i++) {
				const st = callbacks[i][0]
				if(st === 0 || st === 3 || (st >= 300 && st < 400))
					callbacks[i][1](res)
			}
		else if (res.status >= 400 && res.status < 500) // 4××
			for (let i = 0; i < callbacks.length; i++) {
				const st = callbacks[i][0]
				if(st === 0 || st === 4 || st === 45 || (st >= 400 && st < 500))
					callbacks[i][1](res)
			}
		else if (res.status >= 500 && res.status < 600) // 5××
			for (let i = 0; i < callbacks.length; i++) {
				const st = callbacks[i][0]
				if(st === 0 || st === 5 || st === 45 || (st >= 500 && st < 600))
					callbacks[i][1](res)
			}
		
	} catch (error) {
		if (opt.onError) {
			await Promise.resolve(opt.onError(error));
		}
	} finally {
		if (opt.cacheTime) {
			cache[cacheKey] = {
				data: res,
				time: Date.now(),
			};
		}
		if (opt.reduce) {
			res = await Promise.resolve(opt.reduce(res));
		}
		if (opt.onSuccess) {
			await Promise.resolve(opt.onSuccess(res));
		}
	}
}

function makeMethod (
	method: string,
	name: any,
	query: any,
	body: any,
	baseOptions: IOptions,
	options: IOptions,
	loadFetch: any // loadFetch is SvelteKits module   load({fetch}), and is passed when calling from load
) {
	let url = "/" + name;
	if (query) {
		const searchParams = new URLSearchParams(query)
		url += "?" + searchParams;
	}

	return baseApi(url, body, { ...baseOptions, ...options, method }, loadFetch);
};

const restFulKeys = {
	get: true,
	post: true,
	put: true,
	del: true,
	options: true,
} as any;


/* 
	* How does it work?
	createZeroApi creates a proxy based on the __temp routes
	A proxy is an object which modifies the result. i.e.   proxy.addNumbers(1, 1) → proxy adds 1 -> = 3
	
	At // * Actual function call
	is where the   api.user.register.post({})   takes place. Where prop is the parameters
*/
export const createZeroApi = <T>(opt: IOptions = {}): T => {
	const createProxy = (target: any) => {

		const obj = new Proxy(target, {
			get(target, name: string) {
				if (!target[name]) {				
					if (!restFulKeys[name]) {
						// Then it's a slug, i.e.   id$('someidinherewhere').get()
						if (name.match(/\$$/g)) {
							// Make it into a function that returns proxy children
							target[name] = function slugFunction(slug) {
								return createProxy({
									___parent: target.___parent ? target.___parent + "/" + name : name,
									_____slug: target._____slug ? target._____slug + "/" + slug : slug
								});
							}
							return target[name]
						}
						
						target[name] = createProxy({
							___parent: target.___parent ? target.___parent + "/" + name : name,
							_____slug: target._____slug ? target._____slug + "/" + name : name
						})
					}
					else {
						let method = name.toUpperCase()
						if (method === "DEL") {
							method = "DELETE"
						}
						const url = target._____slug;

						// * Actual function call
						target[name] = function apiFunction (prop: any = {}, loadFetch: any = undefined) {
							let { query, body } = prop
							const { options } = prop
							
							if (!query && !body && !options) {
								if (method === "GET") {
									query = prop
								} else {
									body = prop
								}
							}
							return makeMethod(method, url, query, body, opt, options, loadFetch);
						}
					}
				}
				
				return target[name];
			},
		});

		return obj;
	};

	return createProxy(opt.baseData || {});
};
