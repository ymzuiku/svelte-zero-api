/** SvelteKit Response */
interface DefaultResponse {
	status?: number
	body?: Record<any, any> | any
	headers?: Record<any, any>
	bodyUsed?: boolean
	ok?: boolean
	redirected?: boolean
	statusText?: string
	type?: string
	url?: string
}

export type SvelteResponse<T extends Record<any, any> = unknown> = {
	[K in keyof DefaultResponse]: K extends keyof T ? T[K] : DefaultResponse[K]
}

export interface SvelteErrorResponse extends SvelteResponse<{ body: { error: string } }> { }

interface DefaultResponse {
	body?: Record<any, any> | any,
	headers?: Record<any, any>
}

interface ErrorResponse extends DefaultResponse {
	/** An error message that will be sent with body */
	error?: string

	/** The target that triggered error. Usually set to indicate a frontend element */
	target?: any
}

export const createDefaultResponse = <C extends number, T extends DefaultResponse>(code: C, obj: T): { status: C } & SvelteResponse<T> => {
	!obj && (obj = {} as T)
	return ({ status: code, body: {}, headers: {}, ...obj }) as unknown as
		{ status: C } & SvelteResponse<T>
}

type InferErrorResponse<T> = T extends ErrorResponse & infer X ? X : never
type ErrorResponseHasTarget<T> = InferErrorResponse<T> extends { target: any } ? { body: { target: InferErrorResponse<T>['target'] } } : {}

/** Creates a response with correct ReturnType and sets body.error and body.target */
export const createErrorResponse =
	<C extends number, T extends ErrorResponse> (code: C, obj: T, defaultErrorMessage: string) => {
	!obj && (obj = {} as T)
	return {
		status: code,
		body: { error: obj.error || defaultErrorMessage, target: obj.target, ...obj.body },
		headers: obj.headers
	} as
		{ status: C } & SvelteResponse<InferErrorResponse<T> & { body: { error: string } } & ErrorResponseHasTarget<T>>
}

// 1××
export const Continue           = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(100, obj as T)
export const SwitchingProtocols = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(101, obj as T)
export const Processing         = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(102, obj as T)

// 2××
export const Ok                          = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(200, obj as T)
export const Created                     = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(201, obj as T)
export const Accepted                    = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(202, obj as T)
export const NonAuthoritativeInformation = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(203, obj as T)
export const NoContent                   = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(204, obj as T)
export const ResetContent                = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(205, obj as T)
export const PartialContent              = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(206, obj as T)
export const MultiStatus                 = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(207, obj as T)
export const AlreadyReported             = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(208, obj as T)
export const IMUsed                      = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(226, obj as T)

// 3××
export const MultipleChoices   = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(300, obj as T)
export const MovedPermanently  = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(301, obj as T)
export const Found             = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(302, obj as T)
export const CheckOther        = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(303, obj as T)
export const NotModified       = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(304, obj as T)
export const UseProxy          = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(305, obj as T)
export const SwitchProxy       = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(306, obj as T)
export const TemporaryRedirect = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(307, obj as T)
export const PermanentRedirect = <T extends DefaultResponse>(obj?: T) => createDefaultResponse(308, obj as T)

// 4××
export const BadRequest                  = <T extends ErrorResponse>(obj?: T) => createErrorResponse(400, obj as T, 'Bad Request')
export const InvalidAuthenticationToken  = <T extends ErrorResponse>(obj?: T) => createErrorResponse(401, obj as T, 'Invalid Authentication Token')
export const Unauthorized                = <T extends ErrorResponse>(obj?: T) => createErrorResponse(401, obj as T, 'Unauthorized')
export const PaymentRequired             = <T extends ErrorResponse>(obj?: T) => createErrorResponse(401, obj as T, 'PaymentRequired')
export const Forbidden                   = <T extends ErrorResponse>(obj?: T) => createErrorResponse(403, obj as T, 'Forbidden')
export const NotFound                    = <T extends ErrorResponse>(obj?: T) => createErrorResponse(404, obj as T, 'Method Not Allowed')
export const MethodNotAllowed            = <T extends ErrorResponse>(obj?: T) => createErrorResponse(405, obj as T, 'Not Acceptable')
export const NotAcceptable               = <T extends ErrorResponse>(obj?: T) => createErrorResponse(406, obj as T, 'Proxy Authentication Required')
export const ProxyAuthenticationRequired = <T extends ErrorResponse>(obj?: T) => createErrorResponse(407, obj as T, 'Request Timeout')
export const RequestTimeout              = <T extends ErrorResponse>(obj?: T) => createErrorResponse(408, obj as T, 'Conflict')
export const Conflict                    = <T extends ErrorResponse>(obj?: T) => createErrorResponse(409, obj as T, 'Gone')
export const Gone                        = <T extends ErrorResponse>(obj?: T) => createErrorResponse(410, obj as T, 'Gone')
export const LengthRequired              = <T extends ErrorResponse>(obj?: T) => createErrorResponse(411, obj as T, 'Length Required')
export const PreconditionFailed          = <T extends ErrorResponse>(obj?: T) => createErrorResponse(412, obj as T, 'Precondition Failed')
export const PayloadTooLarge             = <T extends ErrorResponse>(obj?: T) => createErrorResponse(413, obj as T, 'Payload Too Large')
export const URITooLong                  = <T extends ErrorResponse>(obj?: T) => createErrorResponse(414, obj as T, 'URI Too Long')
export const UnsupportedMediaType        = <T extends ErrorResponse>(obj?: T) => createErrorResponse(415, obj as T, 'Unsuported Media Type')
export const RangeNotSatisfiable         = <T extends ErrorResponse>(obj?: T) => createErrorResponse(416, obj as T, 'Range Not Satisfiable')
export const ExpectationFailed           = <T extends ErrorResponse>(obj?: T) => createErrorResponse(417, obj as T, 'Expectation Failed')
export const ImATeapot                   = <T extends ErrorResponse>(obj?: T) => createErrorResponse(418, obj as T, 'I\'m A Teapot')
export const MisdirectedRequest          = <T extends ErrorResponse>(obj?: T) => createErrorResponse(421, obj as T, 'Misdirected Request')
export const UnprocessableEntity         = <T extends ErrorResponse>(obj?: T) => createErrorResponse(422, obj as T, 'Unprocessable Entity')
export const Locked                      = <T extends ErrorResponse>(obj?: T) => createErrorResponse(423, obj as T, 'Locked')
export const FailedDependency            = <T extends ErrorResponse>(obj?: T) => createErrorResponse(424, obj as T, 'Failed Dependency')
export const UpgradeRequired             = <T extends ErrorResponse>(obj?: T) => createErrorResponse(426, obj as T, 'Upgrade Required')
export const PreconditionRequired        = <T extends ErrorResponse>(obj?: T) => createErrorResponse(428, obj as T, 'Precondition Required')
export const TooManyRequests             = <T extends ErrorResponse>(obj?: T) => createErrorResponse(429, obj as T, 'Too Many Requests')
export const RequestHeaderFieldsTooLarge = <T extends ErrorResponse>(obj?: T) => createErrorResponse(431, obj as T, 'Request Header Fields Too Large')
export const UnavailableForLegalReasons  = <T extends ErrorResponse>(obj?: T) => createErrorResponse(451, obj as T, 'Unavailable For Legal Reasons')

// 5××
export const InternalError                 = <T extends ErrorResponse>(obj?: T) => createErrorResponse(500, obj as T, 'Internal Error')
export const NotImplemented                = <T extends ErrorResponse>(obj?: T) => createErrorResponse(501, obj as T, 'Not Implemented')
export const BadGateaway                   = <T extends ErrorResponse>(obj?: T) => createErrorResponse(502, obj as T, 'Bad Gateaway')
export const ServiceUnavailable            = <T extends ErrorResponse>(obj?: T) => createErrorResponse(503, obj as T, 'Service Unavailable')
export const GatewayTimeout                = <T extends ErrorResponse>(obj?: T) => createErrorResponse(504, obj as T, 'Gateway Timeout')
export const HTTPVersionNotSupported       = <T extends ErrorResponse>(obj?: T) => createErrorResponse(505, obj as T, 'HTTP Version Not Supported')
export const VariantAlsoNegotiates         = <T extends ErrorResponse>(obj?: T) => createErrorResponse(506, obj as T, 'Variant Also Negotiates')
export const InsufficientStorage           = <T extends ErrorResponse>(obj?: T) => createErrorResponse(507, obj as T, 'Insufficient Storage')
export const LoopDetected                  = <T extends ErrorResponse>(obj?: T) => createErrorResponse(508, obj as T, 'Loop Detected')
export const NotExtended                   = <T extends ErrorResponse>(obj?: T) => createErrorResponse(510, obj as T, 'Not Extended')
export const NetworkAuthenticationRequired = <T extends ErrorResponse>(obj?: T) => createErrorResponse(511, obj as T, 'Network Authentication Required')





