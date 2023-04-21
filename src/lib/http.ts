interface Options {
	body?: any,
	headers?: Record<any, any>,
	/** `content-type`, default value: If body is an object "application/json", otherwise "text/plain;charset=UTF-8" */
	contentType?: string
}

function createResponse(obj: Options | undefined, status: number): any {
	const { headers = {}, body, contentType } = obj || {}
	// If content-type is undefined, and body is an object, defaults to 'application/json' — if body is not an object, it defaults to "text/plain;charset=UTF-8"
	const isJSON = headers['content-type'] == undefined || headers['content-type'].includes('application/json')	
	return new Response(
		body && isJSON && typeof body === 'object' && JSON.stringify(body) || body, {
			status, headers: {
				'content-type': contentType || typeof body === 'object' ? 'application/json' : 'text/plain;charset=UTF-8',
				...headers
			}
		}
	)
}

function y<K extends Readonly<keyof StatusText>, Status extends Readonly<number>>(status: Status, str: K) {
	const fn = <T extends Options = {}>(obj?: T) =>
		createResponse(obj, status) as unknown as APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: true }> }> | GeneralResponse<K, Status, true, T>
	fn.kitResponse = true
	return fn
}

function n<K extends Readonly<keyof StatusText>, Status extends Readonly<number>>(status: Status, str: K) {
	const fn = <T extends Options = {}>(obj?: T) =>
		createResponse(obj, status) as unknown as APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: false }> }> | GeneralResponse<K, Status, false, T>
	fn.kitResponse = true
	return fn
}



export type CreateResponse<K extends Readonly<keyof StatusText>, Status extends number, OK extends boolean, T extends Record<any, any>> =
	APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: OK }> }> | GeneralResponse<K, Status, OK, T>

type GeneralResponse<
	K extends Readonly<keyof StatusText>,
	Status extends Readonly<number>,
	OK extends Readonly<boolean>,
	T extends Record<any, any>
	> = APIResponse<{ [Property in StatusClass[K]]: () => Simplify<T & { status: Status, ok: OK }> }>

export const
	/** [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100) — indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished. */
	Continue                      = n(100, 'Continue'),
	/** [101 Switching Protocols](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/101) — indicates a protocol to which the server switches. The protocol is specified in the [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) request header received from a client. */
	SwitchingProtocols            = n(101, 'SwitchingProtocols'),
	/** [102 Processing](https://www.webfx.com/web-development/glossary/http-status-codes/what-is-a-102-status-code/) — An interim response used to inform the client that the server has accepted the complete request but has not yet completed it. */
	Processing                    = n(102, 'Processing'),
	/** [103 Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103) — is primarily intended to be used with the [Link](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) header to allow the user agent to start preloading resources while the server is still preparing a response. */
	EarlyHints                    = n(103, 'EarlyHints'),

	/** [200 OK](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) — indicates that the request has succeeded. A 200 response is cacheable by default. */
	Ok                            = y(200, 'Ok'),
	/** [201 Created](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201) — indicates that the request has succeeded and has led to the creation of a resource. The new resource is effectively created before this response is sent back and the new resource is returned in the body of the message, its location being either the URL of the request, or the content of the [Location](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header. */
	Created                       = y(201, 'Created'),
	/** [202 Accepted](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/202) — indicates that the request has been accepted for processing, but the processing has not been completed; in fact, processing may not have started yet. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place. */
	Accepted                      = y(202, 'Accepted'),
	/** [203 Non-Authoritative Information](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/203) — indicates that the request was successful but the enclosed payload has been modified by a transforming [proxy](https://developer.mozilla.org/en-US/docs/Glossary/Proxy_server) from that of the origin server's [200](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200) (OK) response. */
	NonAuthoritativeInformation   = y(203, 'NonAuthoritativeInformation'),
	/** [204 No Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204) — indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page. */
	NoContent                     = y(204, 'NoContent'),
	/** [205 Reset Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/205) — tells the client to reset the document view, so for example to clear the content of a form, reset a canvas state, or to refresh the UI. */
	ResetContent                  = y(205, 'ResetContent'),
	/** [206 Partial Content](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206) — indicates that the request has succeeded and the body contains the requested ranges of data, as described in the Range header of the request. */
	PartialContent                = y(206, 'PartialContent'),
	/** [207 Mutli-Status](https://www.webfx.com/web-development/glossary/http-status-codes/what-is-a-207-status-code/) — conveys information about multiple resources in situations where multiple status codes might be appropriate. */
	MultiStatus                   = y(207, 'MultiStatus'),
	/** [208 Already Reported](https://www.webfx.com/web-development/glossary/http-status-codes/what-is-a-208-status-code/) — Used inside a DAV: propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly. */
	AlreadyReported               = y(208, 'AlreadyReported'),
	/** [226 IM Used](https://www.webfx.com/web-development/glossary/http-status-codes/what-is-a-226-status-code/) — The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance. */
	IMUsed                        = y(226, 'IMUsed'),

	/** [300 Multiple Choices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/300) — indicates that the request has more than one possible responses. The user-agent or user should choose one of them. As there is no standardized way of choosing one of the responses, this response code is very rarely used. */
	MultipleChoices               = n(300, 'MultipleChoices'),
	/** [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301) — indicates that the resource has been moved permanently to a new location, and that future references should use a new URI with their requests. */
	MovedPermanently              = n(301, 'MovedPermanently'),
	/** [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) — indicates that the resource has been moved temporarily to a different location, but that future references should still use the original URI to access the resource. */
	Found                         = n(302, 'Found'),
	/** [303 See Other](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/303) — indicates that the response to the request can be found under a different URI. */
	SeeOther                      = n(303, 'SeeOther'),
	/** [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) — indicates that the request has not been modified since the last request. */
	NotModified                   = n(304, 'NotModified'),
	/** [307 Temporary Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/307) — indicates that the resource is located temporarily under a different URI. Since the redirection might be altered on occasion, the client should continue to use the original effective request URI for future requests. */
	TemporaryRedirect             = n(307, 'TemporaryRedirect'),
	/** [308 Permanent Redirect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) — indicates that the resource has been moved permanently to a new location, and that future references should use a new URI with their requests. */
	PermanentRedirect             = n(308, 'PermanentRedirect'),

	/** [400 Bad Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) — indicates that the server cannot or will not process the request due to an apparent client error. */
	BadRequest                    = n(400, 'BadRequest'),
	/** [401 Unauthorized](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401) — indicates that the request has not been applied because it lacks valid authentication credentials for the target resource. */
	Unauthorized                  = n(401, 'Unauthorized'),
	/** [402 Payment Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/402) — is reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme, but that has not happened, and this code is not usually used. */
	PaymentRequired               = n(402, 'PaymentRequired'),
	/** [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403) — indicates that the server understood the request but refuses to authorize it. */
	Forbidden                     = n(403, 'Forbidden'),
	/** [404 Not Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404) — indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists. */
	NotFound                      = n(404, 'NotFound'),
	/** [405 Method Not Allowed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405) — indicates that the method received in the request-line is known by the origin server but not supported by the target resource. */
	MethodNotAllowed              = n(405, 'MethodNotAllowed'),
	/** [406 Not Acceptable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) — indicates that the server cannot produce a response matching the list of acceptable values defined in the request's proactive [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) headers, and that the server is unwilling to supply a default representation. */
	NotAcceptable                 = n(406, 'NotAcceptable'),
	/** [407 Proxy Authentication Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/407) — indicates that the client needs to authenticate itself in order to use a [proxy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers). */
	ProxyAuthenticationRequired   = n(407, 'ProxyAuthenticationRequired'),
	/** [408 Request Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) — indicates that the server did not receive a complete request message within the time that it was prepared to wait. */
	RequestTimeout                = n(408, 'RequestTimeout'),
	/** [409 Conflict](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409) — indicates that the request could not be completed due to a conflict with the current state of the target resource. */
	Conflict                      = n(409, 'Conflict'),
	/** [410 Gone](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/410) — indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent. */
	Gone                          = n(410, 'Gone'),
	/** [411 Length Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/411) — indicates that the server refuses to accept the request without a defined [Content-Length](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length). */
	LengthRequired                = n(411, 'LengthRequired'),
	/** [412 Precondition Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/412) — indicates that one or more conditions given in the request header fields evaluated to false when tested on the server. */
	PreconditionFailed            = n(412, 'PreconditionFailed'),
	/** [413 Payload Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/413) — indicates that the server is refusing to process a request because the request payload is larger than the server is willing or able to process. */
	PayloadTooLarge               = n(413, 'PayloadTooLarge'),
	/** [414 URI Too Long](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/414) — indicates that the server is refusing to service the request because the request-target is longer than the server is willing to interpret. */
	URITooLong                    = n(414, 'URITooLong'),
	/** [415 Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) — indicates that the origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource. */
	UnsupportedMediaType          = n(415, 'UnsupportedMediaType'),
	/** [416 Range Not Satisfiable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/416) — indicates that none of the ranges in the request's [Range](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header field (Section 14.35 of [RFC7233](https://tools.ietf.org/html/rfc7233)) overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges. */
	RangeNotSatisfiable           = n(416, 'RangeNotSatisfiable'),
	/** [417 Expectation Failed](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/417) — indicates that the expectation given in the request's [Expect](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect) header field (Section 5.1.1 of [RFC7231](https://tools.ietf.org/html/rfc7231)) could not be met by at least one of the inbound servers. */
	ExpectationFailed             = n(417, 'ExpectationFailed'),
	/** [418 I'm a teapot](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418) — indicates that the server refuses to brew coffee because it is, permanently, a teapot. A combined coffee/tea pot that is temporarily out of coffee should instead return 503. This error is a reference to Hyper Text Coffee Pot Control Protocol defined in April Fools' jokes in 1998 and 2014. */
	ImATeapot                     = n(418, 'ImATeapot'),
	/** [421 Misdirected Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/421) — indicates that the request was directed at a server that is not able to produce a response. */
	MisdirectedRequest            = n(421, 'MisdirectedRequest'),
	/** [422 Unprocessable Entity](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422) — indicates that the server understands the content type of the request entity (hence a [415](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) [Unsupported Media Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/415) status code is inappropriate), and the syntax of the request entity is correct (thus a [400](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) [Bad Request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400) status code is inappropriate) but was unable to process the contained instructions. */
	UnprocessableEntity           = n(422, 'UnprocessableEntity'),
	/** [423 Locked](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/423) — indicates that the access to the target resource is denied. */
	Locked                        = n(423, 'Locked'),
	/** [424 Failed Dependency](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/424) — indicates that the method could not be performed on the resource because the requested action depended on another action and that action failed. */
	FailedDependency              = n(424, 'FailedDependency'),
	/** [425 Too Early](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/425) — indicates that the server is unwilling to risk processing a request that might be replayed. */
	TooEarly                      = n(425, 'TooEarly'),
	/** [426 Upgrade Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/426) — indicates that the server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an [Upgrade](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Upgrade) header field in a 426 response to indicate the required protocol(s). */
	UpgradeRequired               = n(426, 'UpgradeRequired'),
	/** [428 Precondition Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/428) — indicates that the origin server requires the request to be conditional. */
	PreconditionRequired          = n(428, 'PreconditionRequired'),
	/** [429 Too Many Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) — indicates that the user has sent too many requests in a given amount of time ("rate limiting"). */
	TooManyRequests               = n(429, 'TooManyRequests'),
	/** [431 Request Header Fields Too Large](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/431) — indicates that the server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields. */
	RequestHeaderFieldsTooLarge   = n(431, 'RequestHeaderFieldsTooLarge'),
	/** [451 Unavailable For Legal Reasons](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/451) — indicates that the user requested a resource that is not available for legal reasons, such as a web page censored by a government. */
	UnavailableForLegalReasons    = n(451, 'UnavailableForLegalReasons'),

	/** [500 Internal Server Error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) — indicates that the server encountered an unexpected condition that prevented it from fulfilling the request. */
	InternalServerError           = n(500, 'InternalServerError'),
	/** [501 Not Implemented](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501) — indicates that the server does not support the functionality required to fulfill the request. */
	NotImplemented                = n(501, 'NotImplemented'),
	/** [502 Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/502) — indicates that the server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request. */
	BadGateway                    = n(502, 'BadGateway'),
	/** [503 Service Unavailable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503) — indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay. */
	ServiceUnavailable            = n(503, 'ServiceUnavailable'),
	/** [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) — indicates that the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI (e.g. [HTTP](https://developer.mozilla.org/en-US/docs/Glossary/HTTP) or [FTP](https://developer.mozilla.org/en-US/docs/Glossary/FTP)) or some other auxiliary server (e.g. DNS) it needed to access in attempting to complete the request. */
	GatewayTimeout                = n(504, 'GatewayTimeout'),
	/** [505 HTTP Version Not Supported](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/505) — indicates that the server does not support, or refuses to support, the [HTTP protocol](https://developer.mozilla.org/en-US/docs/Glossary/HTTP) version that was used in the request message. */
	HTTPVersionNotSupported       = n(505, 'HTTPVersionNotSupported'),
	/** [506 Variant Also Negotiates](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/506) — indicates that the server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process. */
	VariantAlsoNegotiates         = n(506, 'VariantAlsoNegotiates'),
	/** [507 Insufficient Storage](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/507) — indicates that the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. */
	InsufficientStorage           = n(507, 'InsufficientStorage'),
	/** [508 Loop Detected](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508) — indicates that the server terminated an operation because it encountered an infinite loop while processing a request with "Depth: infinity". This status indicates that the entire operation failed. */
	LoopDetected                  = n(508, 'LoopDetected'),
	/** [510 Not Extended](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510) — indicates that further extensions to the request are required for the server to fulfill it. */
	NotExtended                   = n(510, 'NotExtended'),
	/** [511 Network Authentication Required](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511) — indicates that the client needs to authenticate to gain network access. */
	NetworkAuthenticationRequired = n(511, 'NetworkAuthenticationRequired')

export type KitResponseFnInformational =
	| typeof Continue
	| typeof SwitchingProtocols
	| typeof Processing
	| typeof EarlyHints

export type KitResponseFnSuccess =
	| typeof Ok
	| typeof Created
	| typeof Accepted
	| typeof NonAuthoritativeInformation
	| typeof NoContent
	| typeof ResetContent
	| typeof PartialContent
	| typeof MultiStatus
	| typeof AlreadyReported
	| typeof IMUsed

export type KitResponseFnRedirection =
	| typeof MultipleChoices
	| typeof MovedPermanently
	| typeof Found
	| typeof SeeOther
	| typeof NotModified
	| typeof TemporaryRedirect
	| typeof PermanentRedirect

export type KitResponseFnClientError =
	| typeof BadRequest
	| typeof Unauthorized
	| typeof PaymentRequired
	| typeof Forbidden
	| typeof NotFound
	| typeof MethodNotAllowed
	| typeof NotAcceptable
	| typeof ProxyAuthenticationRequired
	| typeof RequestTimeout
	| typeof Conflict
	| typeof Gone
	| typeof LengthRequired
	| typeof PreconditionFailed
	| typeof PayloadTooLarge
	| typeof URITooLong
	| typeof UnsupportedMediaType
	| typeof RangeNotSatisfiable
	| typeof ExpectationFailed
	| typeof ImATeapot
	| typeof MisdirectedRequest
	| typeof UnprocessableEntity
	| typeof Locked
	| typeof FailedDependency
	| typeof TooEarly
	| typeof UpgradeRequired
	| typeof PreconditionRequired
	| typeof TooManyRequests
	| typeof RequestHeaderFieldsTooLarge
	| typeof UnavailableForLegalReasons

export type KitResponseFnServerError =
	| typeof InternalServerError
	| typeof NotImplemented
	| typeof BadGateway
	| typeof ServiceUnavailable
	| typeof GatewayTimeout
	| typeof HTTPVersionNotSupported
	| typeof VariantAlsoNegotiates
	| typeof InsufficientStorage
	| typeof LoopDetected
	| typeof NotExtended
	| typeof NetworkAuthenticationRequired

export type KitResponseFn =
	| KitResponseFnInformational
	| KitResponseFnSuccess
	| KitResponseFnRedirection
	| KitResponseFnClientError
	| KitResponseFnServerError