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
	Continue                      = n(100, 'Continue'),
	SwitchingProtocols            = n(101, 'SwitchingProtocols'),
	Processing                    = n(102, 'Processing'),
	EarlyHints                    = n(103, 'EarlyHints'),

	Ok                            = y(200, 'Ok'),
	Created                       = y(201, 'Created'),
	Accepted                      = y(202, 'Accepted'),
	NonAuthoritativeInformation   = y(203, 'NonAuthoritativeInformation'),
	NoContent                     = y(204, 'NoContent'),
	ResetContent                  = y(205, 'ResetContent'),
	PartialContent                = y(206, 'PartialContent'),
	MultiStatus                   = y(207, 'MultiStatus'),
	AlreadyReported               = y(208, 'AlreadyReported'),
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