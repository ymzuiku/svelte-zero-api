import * as StatusCode from '../httpcodes'
const cache = {} as any;

export type QueryGet<T extends { query: Record<string, unknown> }> = QueryGetter<T> & Omit<T, 'query'>

interface QueryGetter<T extends { query: Record<string, unknown> }> {
	url: {
		searchParams: {
			get?: <K extends keyof T["query"]>(key: K) => T[K];
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
	const callbacks = {
		// General
		informational 				  :  [],     // 1××
		success       				  :  [],     // 2××
		redirection   				  :  [],     // 3××
		error         				  :  [],     // 4×× & 5××
		clientError   				  :  [],     // 4××
		serverError   				  :  [],     // 5××

		// 1××
		continue           			  :  [],
		switchingProtocols 			  :  [],
		processing         			  :  [],

		// 2××
		ok                            :  [],
		created                       :  [],
		accepted                      :  [],
		nonAuthoritativeInformation   :  [],
		noContent                     :  [],
		resetContent                  :  [],
		partialContent                :  [],
		multiStatus                   :  [],
		alreadyReported               :  [],
		IMUsed                        :  [],

		// 3××
		multipleChoices    			  :  [],
		movedPermanently   			  :  [],
		found              			  :  [],
		checkOther         			  :  [],
		notModified        			  :  [],
		useProxy           			  :  [],
		switchProxy        			  :  [],
		temporaryRedirect  			  :  [],
		permanentRedirect  			  :  [],

		// 4××
		badRequest                    :  [],
		unauthorized                  :  [],
		paymentRequired               :  [],
		forbidden                     :  [],
		notFound                      :  [],
		methodNotAllowed              :  [],
		notAcceptable                 :  [],
		proxyAuthenticationRequired   :  [],
		requestTimeout                :  [],
		conflict                      :  [],
		gone                          :  [],
		lengthRequired                :  [],
		preconditionFailed            :  [],
		payloadTooLarge               :  [],
		URITooLong                    :  [],
		unsupportedMediaType          :  [],
		rangeNotSatisfiable           :  [],
		expectationFailed             :  [],
		imATeapot                     :  [],
		misdirectedRequest            :  [],
		unprocessableEntity           :  [],
		locked                        :  [],
		failedDependency              :  [],
		upgradeRequired               :  [],
		preconditionRequired          :  [],
		tooManyRequests               :  [],
		requestHeaderFieldsTooLarge   :  [],
		unavailableForLegalReasons    :  [],

		// 5××
		internalServerError           :  [],
		notImplemented                :  [],
		badGateaway                   :  [],
		serviceUnavailable            :  [],
		gatewayTimeout                :  [],
		HTTPVersionNotSupported       :  [],
		variantAlsoNegotiates         :  [],
		insufficientStorage           :  [],
		loopDetected                  :  [],
		notExtended                   :  [],
		networkAuthenticationRequired :  []
	}

	let fetchApi = {
		promise: null,
		then: null,
		catch: null,
		finally: null
	}
	
	const userSetCallbacks = {
		// general
		informational:                 function (cb) { callbacks.informational.push(cb);                  return fetchApi },
		success:                       function (cb) { callbacks.success.push(cb);                        return fetchApi },
		redirection:                   function (cb) { callbacks.redirection.push(cb);                    return fetchApi },
		error:                         function (cb) { callbacks.error.push(cb);                          return fetchApi },
		clientError:                   function (cb) { callbacks.clientError.push(cb);                    return fetchApi },
		serverError:                   function (cb) { callbacks.serverError.push(cb);                    return fetchApi },

		// 1××
		continue:                      function (cb) { callbacks.continue.push(cb);                       return fetchApi },
		switchingProtocols:            function (cb) { callbacks.switchingProtocols.push(cb);             return fetchApi },
		processing:                    function (cb) { callbacks.processing.push(cb);                     return fetchApi },

		// 2××
		ok:                            function (cb) { callbacks.ok.push(cb);                             return fetchApi },
		created:                       function (cb) { callbacks.created.push(cb);                        return fetchApi },
		accepted:                      function (cb) { callbacks.accepted.push(cb);                       return fetchApi },
		nonAuthoritativeInformation:   function (cb) { callbacks.nonAuthoritativeInformation.push(cb);    return fetchApi },
		noContent:                     function (cb) { callbacks.noContent.push(cb);                      return fetchApi },
		resetContent:                  function (cb) { callbacks.resetContent.push(cb);                   return fetchApi },
		partialContent:                function (cb) { callbacks.partialContent.push(cb);                 return fetchApi },
		multiStatus:                   function (cb) { callbacks.multiStatus.push(cb);                    return fetchApi },
		alreadyReported:               function (cb) { callbacks.alreadyReported.push(cb);                return fetchApi },
		IMUsed:                        function (cb) { callbacks.IMUsed.push(cb);                         return fetchApi },

		// 3××
		multipleChoices:               function (cb) { callbacks.multipleChoices.push(cb);                return fetchApi },
		movedPermanently:              function (cb) { callbacks.movedPermanently.push(cb);               return fetchApi },
		found:                         function (cb) { callbacks.found.push(cb);                          return fetchApi },
		checkOther:                    function (cb) { callbacks.checkOther.push(cb);                     return fetchApi },
		notModified:                   function (cb) { callbacks.notModified.push(cb);                    return fetchApi },
		useProxy:                      function (cb) { callbacks.useProxy.push(cb);                       return fetchApi },
		switchProxy:                   function (cb) { callbacks.switchProxy.push(cb);                    return fetchApi },
		temporaryRedirect:             function (cb) { callbacks.temporaryRedirect.push(cb);              return fetchApi },
		permanentRedirect:             function (cb) { callbacks.permanentRedirect.push(cb);              return fetchApi },

		// 4××
		badRequest:                    function (cb) { callbacks.badRequest.push(cb);                     return fetchApi },
		unauthorized:                  function (cb) { callbacks.unauthorized.push(cb);                   return fetchApi },
		paymentRequired:               function (cb) { callbacks.paymentRequired.push(cb);                return fetchApi },
		forbidden:                     function (cb) { callbacks.forbidden.push(cb);                      return fetchApi },
		notFound:                      function (cb) { callbacks.notFound.push(cb);                       return fetchApi },
		methodNotAllowed:              function (cb) { callbacks.methodNotAllowed.push(cb);               return fetchApi },
		notAcceptable:                 function (cb) { callbacks.notAcceptable.push(cb);                  return fetchApi },
		proxyAuthenticationRequired:   function (cb) { callbacks.proxyAuthenticationRequired.push(cb);    return fetchApi },
		requestTimeout:                function (cb) { callbacks.requestTimeout.push(cb);                 return fetchApi },
		conflict:                      function (cb) { callbacks.conflict.push(cb);                       return fetchApi },
		gone:                          function (cb) { callbacks.gone.push(cb);                           return fetchApi },
		lengthRequired:                function (cb) { callbacks.lengthRequired.push(cb);                 return fetchApi },
		preconditionFailed:            function (cb) { callbacks.preconditionFailed.push(cb);             return fetchApi },
		payloadTooLarge:               function (cb) { callbacks.payloadTooLarge.push(cb);                return fetchApi },
		URITooLong:                    function (cb) { callbacks.URITooLong.push(cb);                     return fetchApi },
		unsupportedMediaType:          function (cb) { callbacks.unsupportedMediaType.push(cb);           return fetchApi },
		rangeNotSatisfiable:           function (cb) { callbacks.rangeNotSatisfiable.push(cb);            return fetchApi },
		expectationFailed:             function (cb) { callbacks.expectationFailed.push(cb);              return fetchApi },
		imATeapot:                     function (cb) { callbacks.imATeapot.push(cb);                      return fetchApi },
		misdirectedRequest:            function (cb) { callbacks.misdirectedRequest.push(cb);             return fetchApi },
		unprocessableEntity:           function (cb) { callbacks.unprocessableEntity.push(cb);            return fetchApi },
		locked:                        function (cb) { callbacks.locked.push(cb);                         return fetchApi },
		failedDependency:              function (cb) { callbacks.failedDependency.push(cb);               return fetchApi },
		upgradeRequired:               function (cb) { callbacks.upgradeRequired.push(cb);                return fetchApi },
		preconditionRequired:          function (cb) { callbacks.preconditionRequired.push(cb);           return fetchApi },
		tooManyRequests:               function (cb) { callbacks.tooManyRequests.push(cb);                return fetchApi },
		requestHeaderFieldsTooLarge:   function (cb) { callbacks.requestHeaderFieldsTooLarge.push(cb);    return fetchApi },
		unavailableForLegalReasons:    function (cb) { callbacks.unavailableForLegalReasons.push(cb);     return fetchApi },

		// 5××
		internalServerError:           function (cb) { callbacks.internalServerError.push(cb);            return fetchApi },
		notImplemented:                function (cb) { callbacks.notImplemented.push(cb);                 return fetchApi },
		badGateaway:                   function (cb) { callbacks.badGateaway.push(cb);                    return fetchApi },
		serviceUnavailable:            function (cb) { callbacks.serviceUnavailable.push(cb);             return fetchApi },
		gatewayTimeout:                function (cb) { callbacks.gatewayTimeout.push(cb);                 return fetchApi },
		HTTPVersionNotSupported:       function (cb) { callbacks.HTTPVersionNotSupported.push(cb);        return fetchApi },
		variantAlsoNegotiates:         function (cb) { callbacks.variantAlsoNegotiates.push(cb);          return fetchApi },
		insufficientStorage:           function (cb) { callbacks.insufficientStorage.push(cb);            return fetchApi },
		loopDetected:                  function (cb) { callbacks.loopDetected.push(cb);                   return fetchApi },
		notExtended:                   function (cb) { callbacks.notExtended.push(cb);                    return fetchApi },
		networkAuthenticationRequired: function (cb) { callbacks.networkAuthenticationRequired.push(cb);  return fetchApi }
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
		const call = (cbArr, res, condition = true) => {
			if (condition)
				cbArr.forEach(x => x(res))
		}
		
		// General
		call(callbacks.informational, res, res.status in StatusCode.Informational)
		call(callbacks.success,       res, res.status in StatusCode.Success)
		call(callbacks.redirection,   res, res.status in StatusCode.Redirection)
		call(callbacks.clientError,   res, res.status in StatusCode.ClientError)
		call(callbacks.serverError,   res, res.status in StatusCode.ServerError)
		call(callbacks.error,         res, (res.status in StatusCode.ClientError || res.status in StatusCode.ServerError))

		// Switch statement didn't work for whatever reason
		const status = (s: number) => res.status === s

		// 1××
		call(callbacks.continue,                      res, status(100))
		call(callbacks.switchingProtocols,            res, status(101))
		call(callbacks.processing,                    res, status(102))         		  
		
		// 2××
		call(callbacks.ok,                            res, status(200))                         
		call(callbacks.created,                       res, status(201))                    
		call(callbacks.accepted,                      res, status(202))                   
		call(callbacks.nonAuthoritativeInformation,   res, status(203))
		call(callbacks.noContent,                     res, status(204))
		call(callbacks.resetContent,                  res, status(205))
		call(callbacks.partialContent,                res, status(206))
		call(callbacks.multiStatus,                   res, status(207))
		call(callbacks.alreadyReported,               res, status(208))
		call(callbacks.IMUsed,                        res, status(226))

		// 3××
		call(callbacks.multipleChoices,               res, status(300))     		  
		call(callbacks.movedPermanently,              res, status(301))
		call(callbacks.found,                         res, status(302))
		call(callbacks.checkOther,                    res, status(303))
		call(callbacks.notModified,                   res, status(304))
		call(callbacks.useProxy,                      res, status(305))
		call(callbacks.switchProxy,                   res, status(306))
		call(callbacks.temporaryRedirect,             res, status(307))
		call(callbacks.permanentRedirect,             res, status(308))

		// 4××
		call(callbacks.badRequest,                    res, status(400))
		call(callbacks.unauthorized,                  res, status(401))
		call(callbacks.paymentRequired,               res, status(402))
		call(callbacks.forbidden,                     res, status(403))
		call(callbacks.notFound,                      res, status(404))
		call(callbacks.methodNotAllowed,              res, status(405))
		call(callbacks.notAcceptable,                 res, status(406))
		call(callbacks.proxyAuthenticationRequired,   res, status(407))
		call(callbacks.requestTimeout,                res, status(408))
		call(callbacks.conflict,                      res, status(409))
		call(callbacks.gone,                          res, status(410))
		call(callbacks.lengthRequired,                res, status(411))
		call(callbacks.preconditionFailed,            res, status(412))
		call(callbacks.payloadTooLarge,               res, status(413))
		call(callbacks.URITooLong,                    res, status(414))
		call(callbacks.unsupportedMediaType,          res, status(415))
		call(callbacks.rangeNotSatisfiable,           res, status(416))
		call(callbacks.expectationFailed,             res, status(417))
		call(callbacks.imATeapot,                     res, status(418))
		call(callbacks.misdirectedRequest,            res, status(21))
		call(callbacks.unprocessableEntity,           res, status(422))
		call(callbacks.locked,                        res, status(423))
		call(callbacks.failedDependency,              res, status(424))
		call(callbacks.upgradeRequired,               res, status(426))
		call(callbacks.preconditionRequired,          res, status(428))
		call(callbacks.tooManyRequests,               res, status(429))
		call(callbacks.requestHeaderFieldsTooLarge,   res, status(431))
		call(callbacks.unavailableForLegalReasons,    res, status(451))

		// 5××
		call(callbacks.internalServerError,           res, status(500))
		call(callbacks.notImplemented,                res, status(501))
		call(callbacks.badGateaway,                   res, status(502))
		call(callbacks.serviceUnavailable,            res, status(503))
		call(callbacks.gatewayTimeout,                res, status(504))
		call(callbacks.HTTPVersionNotSupported,       res, status(505))
		call(callbacks.variantAlsoNegotiates,         res, status(506))
		call(callbacks.insufficientStorage,           res, status(507))
		call(callbacks.loopDetected,                  res, status(508))
		call(callbacks.notExtended,                   res, status(510))
		call(callbacks.networkAuthenticationRequired, res, status(511))

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
						target[name] = createProxy({
							___parent: target.___parent ? target.___parent + "/" + name : name,
						});
					} else {
						let method = name.toUpperCase();
						if (method === "DEL") {
							method = "DELETE";
						}
						const url = target.___parent;

						// * Actual function call
						target[name] = function apiFunction (prop: any = {}, loadFetch: any = undefined) {
							let { query, body } = prop
							const { options } = prop
							
							if (!query && !body && !options) {
								if (method === "GET") {
									query = prop;
								} else {
									body = prop;
								}
							}
							return makeMethod(method, url, query, body, opt, options, loadFetch);
						};
					}
				}
				
				return target[name];
			},
		});

		return obj;
	};

	return createProxy(opt.baseData || {});
};
