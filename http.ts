/** SvelteKit Response */
export interface Response {
	status?: number,
	body?: Record<string, unknown>,
	headers?: Record<string, unknown>,
	bodyUsed?: boolean,
	ok?: boolean,
	redirected?: boolean,
	statusText?: string,
	type?: string,
	url?: string
}

export interface DefaultResponse {
	body?: Record<string, unknown>,
	headers?: Record<string, unknown>
}

interface ErrorResponse extends DefaultResponse {
	/** "Error Message Succesfully Failed" */
	error?: string
}

interface TargetResponse extends ErrorResponse {
	/** "address" */
	target?: string
}

export const createDefaultResponse = <C extends number, T extends DefaultResponse>(code: C, obj: T): T & { status: C } & Response => {
	!obj && (obj = {} as T)
	return ({ status: code, body: {}, headers: {}, ...obj })
}

/** Creates a response with correct ReturnType and sets body.error and body.target */
export const createTargetResponse = <C extends number, T extends TargetResponse>(code: C, obj: T, defaultErrorMessage: string): Omit<T, 'error' & 'target'> & { status: C, body: TargetResponse } & Response => {
	!obj && (obj = {} as T)
	!obj.error && (obj.error = defaultErrorMessage)
	!obj.target && (obj.target = undefined)
	return ({ status: code, body: { error: obj.error, target: obj.target, ...obj.body }, headers: obj.headers } as (T & { status: C, body: TargetResponse } & Response))
}

export const createErrorResponse = <C extends number, T extends ErrorResponse>(code: C, obj: T, defaultErrorMessage: string): Omit<T, 'error'> & { status: C, body: ErrorResponse } & Response => {
	!obj && (obj = {} as T)
	!obj.error && (obj.error = defaultErrorMessage)
	return ({ status: code, body: { error: obj.error, ...obj.body }, headers: obj.headers } as (T & { status: C, body: ErrorResponse } & Response))
}

// 1××
export const Continue           = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(100, obj)
export const SwitchingProtocols = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(101, obj)
export const Processing         = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(102, obj)

// 2××
export const Ok                          = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(200, obj)
export const Created                     = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(201, obj)
export const Accepted                    = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(202, obj)
export const NonAuthoritativeInformation = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(203, obj)
export const NoContent                   = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(204, obj)
export const ResetContent                = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(205, obj)
export const PartialContent              = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(206, obj)
export const MultiStatus                 = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(207, obj)
export const AlreadyReported             = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(208, obj)
export const IMUsed                      = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(226, obj)

// 3××
export const MultipleChoices   = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(300, obj)
export const MovedPermanently  = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(301, obj)
export const Found             = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(302, obj)
export const CheckOther        = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(303, obj)
export const NotModified       = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(304, obj)
export const UseProxy          = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(305, obj)
export const SwitchProxy       = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(306, obj)
export const TemporaryRedirect = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(307, obj)
export const PermanentRedirect = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(308, obj)

// 4××
export const BadRequest                  = <T>(obj?: T & TargetResponse) => createTargetResponse(400, obj, 'Bad Request')
export const InvalidAuthenticationToken  = <T>(obj?: T & TargetResponse) => createTargetResponse(401, obj, 'Invalid Authentication Token')
export const Unauthorized                = <T>(obj?: T & TargetResponse) => createTargetResponse(401, obj, 'Unauthorized')
export const PaymentRequired             = <T>(obj?: T & TargetResponse) => createTargetResponse(401, obj, 'PaymentRequired')
export const Forbidden                   = <T>(obj?: T & TargetResponse) => createTargetResponse(403, obj, 'Forbidden')
export const NotFound                    = <T>(obj?: T & TargetResponse) => createTargetResponse(404, obj, 'Method Not Allowed')
export const MethodNotAllowed            = <T>(obj?: T & TargetResponse) => createTargetResponse(405, obj, 'Not Acceptable')
export const NotAcceptable               = <T>(obj?: T & TargetResponse) => createTargetResponse(406, obj, 'Proxy Authentication Required')
export const ProxyAuthenticationRequired = <T>(obj?: T & TargetResponse) => createTargetResponse(407, obj, 'Request Timeout')
export const RequestTimeout              = <T>(obj?: T & TargetResponse) => createTargetResponse(408, obj, 'Conflict')
export const Conflict                    = <T>(obj?: T & TargetResponse) => createTargetResponse(409, obj, 'Gone')
export const Gone                        = <T>(obj?: T & TargetResponse) => createTargetResponse(410, obj, 'Gone')
export const LengthRequired              = <T>(obj?: T & TargetResponse) => createTargetResponse(411, obj, 'Length Required')
export const PreconditionFailed          = <T>(obj?: T & TargetResponse) => createTargetResponse(412, obj, 'Precondition Failed')
export const PayloadTooLarge             = <T>(obj?: T & TargetResponse) => createTargetResponse(413, obj, 'Payload Too Large')
export const URITooLong                  = <T>(obj?: T & TargetResponse) => createTargetResponse(414, obj, 'URI Too Long')
export const UnsupportedMediaType        = <T>(obj?: T & TargetResponse) => createTargetResponse(415, obj, 'Unsuported Media Type')
export const RangeNotSatisfiable         = <T>(obj?: T & TargetResponse) => createTargetResponse(416, obj, 'Range Not Satisfiable')
export const ExpectationFailed           = <T>(obj?: T & TargetResponse) => createTargetResponse(417, obj, 'Expectation Failed')
export const ImATeapot                   = <T>(obj?: T & TargetResponse) => createTargetResponse(418, obj, 'I\'m A Teapot')
export const MisdirectedRequest          = <T>(obj?: T & TargetResponse) => createTargetResponse(421, obj, 'Misdirected Request')
export const UnprocessableEntity         = <T>(obj?: T & TargetResponse) => createTargetResponse(422, obj, 'Unprocessable Entity')
export const Locked                      = <T>(obj?: T & TargetResponse) => createTargetResponse(423, obj, 'Locked')
export const FailedDependency            = <T>(obj?: T & TargetResponse) => createTargetResponse(424, obj, 'Failed Dependency')
export const UpgradeRequired             = <T>(obj?: T & TargetResponse) => createTargetResponse(426, obj, 'Upgrade Required')
export const PreconditionRequired        = <T>(obj?: T & TargetResponse) => createTargetResponse(428, obj, 'Precondition Required')
export const TooManyRequests             = <T>(obj?: T & TargetResponse) => createTargetResponse(429, obj, 'Too Many Requests')
export const RequestHeaderFieldsTooLarge = <T>(obj?: T & TargetResponse) => createTargetResponse(431, obj, 'Request Header Fields Too Large')
export const UnavailableForLegalReasons  = <T>(obj?: T & TargetResponse) => createTargetResponse(451, obj, 'Unavailable For Legal Reasons')

// 5××
export const InternalError                 = <T>(obj?: T & ErrorResponse) => createErrorResponse(500, obj, 'Internal Error')
export const NotImplemented                = <T>(obj?: T & ErrorResponse) => createErrorResponse(501, obj, 'Not Implemented')
export const BadGateaway                   = <T>(obj?: T & ErrorResponse) => createErrorResponse(502, obj, 'Bad Gateaway')
export const ServiceUnavailable            = <T>(obj?: T & ErrorResponse) => createErrorResponse(503, obj, 'Service Unavailable')
export const GatewayTimeout                = <T>(obj?: T & ErrorResponse) => createErrorResponse(504, obj, 'Gateway Timeout')
export const HTTPVersionNotSupported       = <T>(obj?: T & ErrorResponse) => createErrorResponse(505, obj, 'HTTP Version Not Supported')
export const VariantAlsoNegotiates         = <T>(obj?: T & ErrorResponse) => createErrorResponse(506, obj, 'Variant Also Negotiates')
export const InsufficientStorage           = <T>(obj?: T & ErrorResponse) => createErrorResponse(507, obj, 'Insufficient Storage')
export const LoopDetected                  = <T>(obj?: T & ErrorResponse) => createErrorResponse(508, obj, 'Loop Detected')
export const NotExtended                   = <T>(obj?: T & ErrorResponse) => createErrorResponse(510, obj, 'Not Extended')
export const NetworkAuthenticationRequired = <T>(obj?: T & ErrorResponse) => createErrorResponse(511, obj, 'Network Authentication Required')





