import * as StatusCode from '../httpcodes'
const cache = {} as any;

export interface QueryGet<T extends { query: Record<string, unknown> }> {
	query: {
		get?: <K extends keyof T["query"]>(key: K) => T[K];
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

export const baseApi = (url: string, obj?: any, opt: IOptions = {}) => {
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
		then: function (resolve) {
			fetchApi.promise.then(res => resolve(res))
			return this
		},
		catch: function (reject) {
			fetchApi.promise.catch(err => reject(err))
			return this
		},
		finally: async function (resolve) {
			await fetchApi.promise
			resolve()
			return this
		}
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

	fetchApi.promise = fetch(realUrl, {
		body,
		...opt,
		headers: opt.headers
	})

	awaitFetch(callbacks, fetchApi, opt, cacheKey)

	return fetchApi
};

const awaitFetch = async (callbacks, fetchApi: FetchProxy, opt, cacheKey) => {
	let res: Response
	try {
		res = await fetchApi.promise
		const obj = {
			body: await res.json(),
			bodyUsed: res.bodyUsed,
			headers: res.headers,
			ok: res.ok,
			redirected: res.redirected,
			status: res.status,
			statusText: res.statusText,
			type: res.type,
			url: res.url
		}

		const call = (cbArr, ob, condition = true) => {
			if (condition)
				cbArr.forEach(x => x(ob))
		}
		
		// General
		call(callbacks.informational, obj, res.status in StatusCode.Informational)
		call(callbacks.success,       obj, res.status in StatusCode.Success)
		call(callbacks.redirection,   obj, res.status in StatusCode.Redirection)
		call(callbacks.clientError,   obj, res.status in StatusCode.ClientError)
		call(callbacks.serverError,   obj, res.status in StatusCode.ServerError)
		call(callbacks.error,         obj, (res.status in StatusCode.ClientError || res.status in StatusCode.ServerError))

		// Switch statement didn't work for whatever reason
		const status = (s: number) => res.status === s

		// 1××
		call(callbacks.continue,                      obj, status(100))
		call(callbacks.switchingProtocols,            obj, status(101))
		call(callbacks.processing,                    obj, status(102))         		  
		
		// 2××
		call(callbacks.ok,                            obj, status(200))                         
		call(callbacks.created,                       obj, status(201))                    
		call(callbacks.accepted,                      obj, status(202))                   
		call(callbacks.nonAuthoritativeInformation,   obj, status(203))
		call(callbacks.noContent,                     obj, status(204))
		call(callbacks.resetContent,                  obj, status(205))
		call(callbacks.partialContent,                obj, status(206))
		call(callbacks.multiStatus,                   obj, status(207))
		call(callbacks.alreadyReported,               obj, status(208))
		call(callbacks.IMUsed,                        obj, status(226))

		// 3××
		call(callbacks.multipleChoices,               obj, status(300))     		  
		call(callbacks.movedPermanently,              obj, status(301))
		call(callbacks.found,                         obj, status(302))
		call(callbacks.checkOther,                    obj, status(303))
		call(callbacks.notModified,                   obj, status(304))
		call(callbacks.useProxy,                      obj, status(305))
		call(callbacks.switchProxy,                   obj, status(306))
		call(callbacks.temporaryRedirect,             obj, status(307))
		call(callbacks.permanentRedirect,             obj, status(308))

		// 4××
		call(callbacks.badRequest,                    obj, status(400))
		call(callbacks.unauthorized,                  obj, status(401))
		call(callbacks.paymentRequired,               obj, status(402))
		call(callbacks.forbidden,                     obj, status(403))
		call(callbacks.notFound,                      obj, status(404))
		call(callbacks.methodNotAllowed,              obj, status(405))
		call(callbacks.notAcceptable,                 obj, status(406))
		call(callbacks.proxyAuthenticationRequired,   obj, status(407))
		call(callbacks.requestTimeout,                obj, status(408))
		call(callbacks.conflict,                      obj, status(409))
		call(callbacks.gone,                          obj, status(410))
		call(callbacks.lengthRequired,                obj, status(411))
		call(callbacks.preconditionFailed,            obj, status(412))
		call(callbacks.payloadTooLarge,               obj, status(413))
		call(callbacks.URITooLong,                    obj, status(414))
		call(callbacks.unsupportedMediaType,          obj, status(415))
		call(callbacks.rangeNotSatisfiable,           obj, status(416))
		call(callbacks.expectationFailed,             obj, status(417))
		call(callbacks.imATeapot,                     obj, status(418))
		call(callbacks.misdirectedRequest,            obj, status(21))
		call(callbacks.unprocessableEntity,           obj, status(422))
		call(callbacks.locked,                        obj, status(423))
		call(callbacks.failedDependency,              obj, status(424))
		call(callbacks.upgradeRequired,               obj, status(426))
		call(callbacks.preconditionRequired,          obj, status(428))
		call(callbacks.tooManyRequests,               obj, status(429))
		call(callbacks.requestHeaderFieldsTooLarge,   obj, status(431))
		call(callbacks.unavailableForLegalReasons,    obj, status(451))

		// 5××
		call(callbacks.internalServerError,           obj, status(500))
		call(callbacks.notImplemented,                obj, status(501))
		call(callbacks.badGateaway,                   obj, status(502))
		call(callbacks.serviceUnavailable,            obj, status(503))
		call(callbacks.gatewayTimeout,                obj, status(504))
		call(callbacks.HTTPVersionNotSupported,       obj, status(505))
		call(callbacks.variantAlsoNegotiates,         obj, status(506))
		call(callbacks.insufficientStorage,           obj, status(507))
		call(callbacks.loopDetected,                  obj, status(508))
		call(callbacks.notExtended,                   obj, status(510))
		call(callbacks.networkAuthenticationRequired, obj, status(511))

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

const makeMethod = (
	method: string,
	name: any,
	query: any,
	body: any,
	baseOptions: IOptions,
	options: IOptions
) => {
	if (typeof window === "undefined") {
		return;
	}
	let url = "/" + name;
	if (query) {
		const searchParams = new URLSearchParams(query)
		url += "?" + searchParams;
	}

	return baseApi(url, body, { ...baseOptions, ...options, method });
};

const restFulKeys = {
	get: true,
	post: true,
	put: true,
	del: true,
	options: true,
} as any;


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

						target[name] = (prop: any = {}) => {

							let { query, body } = prop
							const { options } = prop
							
							if (!query && !body && !options) {
								if (method === "GET") {
									query = prop;
								} else {
									body = prop;
								}
							}
							
							return makeMethod(method, url, query, body, opt, options);
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
