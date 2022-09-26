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
	return <T extends Options = {}>(obj?: T) =>
		createResponse(obj, status) as unknown as APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: true }> }> | GeneralResponse<K, Status, true, T>
}

function n<K extends Readonly<keyof StatusText>, Status extends Readonly<number>>(status: Status, str: K) {
	return <T extends Options = {}>(obj?: T) =>
		createResponse(obj, status) as unknown as APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: false }> }> | GeneralResponse<K, Status, false, T>
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

	MultipleChoices               = n(300, 'MultipleChoices'),
	MovedPermanently              = n(301, 'MovedPermanently'),
	Found                         = n(302, 'Found'),
	SeeOther                      = n(303, 'SeeOther'),
	NotModified                   = n(304, 'NotModified'),
	UseProxy                      = n(305, 'UseProxy'),
	SwitchProxy                   = n(305, 'SwitchProxy'),
	TemporaryRedirect             = n(307, 'TemporaryRedirect'),
	PermanentRedirect             = n(308, 'PermanentRedirect'),

	BadRequest                    = n(400, 'BadRequest'),
	Unauthorized                  = n(401, 'Unauthorized'),
	PaymentRequired               = n(402, 'PaymentRequired'),
	Forbidden                     = n(403, 'Forbidden'),
	NotFound                      = n(404, 'NotFound'),
	MethodNotAllowed              = n(405, 'MethodNotAllowed'),
	/** [406 Not Acceptable](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406) — indicates that the server cannot produce a response matching the list of acceptable values defined in the request's proactive [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) headers, and that the server is unwilling to supply a default representation. */
	NotAcceptable                 = n(406, 'NotAcceptable'),
	ProxyAuthenticationRequired   = n(407, 'ProxyAuthenticationRequired'),
	RequestTimeout                = n(408, 'RequestTimeout'),
	Conflict                      = n(409, 'Conflict'),
	Gone                          = n(410, 'Gone'),
	LengthRequired                = n(411, 'LengthRequired'),
	PreconditionFailed            = n(412, 'PreconditionFailed'),
	PayloadTooLarge               = n(413, 'PayloadTooLarge'),
	URITooLong                    = n(414, 'URITooLong'),
	UnsupportedMediaType          = n(415, 'UnsupportedMediaType'),
	RangeNotSatisfiable           = n(416, 'RangeNotSatisfiable'),
	ExpectationFailed             = n(417, 'ExpectationFailed'),
	ImATeapot                     = n(418, 'ImATeapot'),
	MisdirectedRequest            = n(421, 'MisdirectedRequest'),
	UnprocessableEntity           = n(422, 'UnprocessableEntity'),
	Locked                        = n(423, 'Locked'),
	FailedDependency              = n(424, 'FailedDependency'),
	TooEarly                      = n(425, 'TooEarly'),
	UpgradeRequired               = n(426, 'UpgradeRequired'),
	PreconditionRequired          = n(428, 'PreconditionRequired'),
	TooManyRequests               = n(429, 'TooManyRequests'),
	RequestHeaderFieldsTooLarge   = n(431, 'RequestHeaderFieldsTooLarge'),
	UnavailableForLegalReasons    = n(451, 'UnavailableForLegalReasons'),

	InternalServerError           = n(500, 'InternalServerError'),
	NotImplemented                = n(501, 'NotImplemented'),
	BadGateway                    = n(502, 'BadGateway'),
	ServiceUnavailable            = n(503, 'ServiceUnavailable'),
	GatewayTimeout                = n(504, 'GatewayTimeout'),
	HTTPVersionNotSupported       = n(505, 'HTTPVersionNotSupported'),
	VariantAlsoNegotiates         = n(506, 'VariantAlsoNegotiates'),
	InsufficientStorage           = n(507, 'InsufficientStorage'),
	LoopDetected                  = n(508, 'LoopDetected'),
	NotExtended                   = n(510, 'NotExtended'),
	NetworkAuthenticationRequired = n(511, 'NetworkAuthenticationRequired')