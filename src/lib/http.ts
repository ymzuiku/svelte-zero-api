interface Options {
	body?: any,
	headers?: Record<any, any>,
	/** `content-type`, default value: If body is an object "application/json", otherwise "text/plain;charset=UTF-8" */
	contentType?: string
}

function CreateResponse(obj: Options | undefined, status: number): any {
	const { headers = {}, body, contentType } = obj || {}
	// If content-type is undefined, and body is an object, defaults to 'application/json' — if body is not an object, it defaults to "text/plain;charset=UTF-8"
	const isJSON = headers['content-type'] == undefined || headers['content-type'].includes('application/json')	
	return new Response(
		body && isJSON && typeof body === 'object' && JSON.stringify(body) || body, {
			status, headers: {
				'content-type': contentType || typeof body === 'object' && 'application/json' || 'text/plain;charset=UTF-8',
				...headers
			}
		}
	)
}

function y<K extends Readonly<string>, Status extends Readonly<number>>(status: Status, str: K) {
	return <T extends Options>(obj?: T) => CreateResponse(obj, status) as unknown as APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: true }> }>
}

function n<K extends Readonly<string>, Status extends Readonly<number>>(status: Status, str: K) {
	return <T extends Options>(obj?: T) => CreateResponse(obj, status) as unknown as APIResponse<{ [Key in K]: () => Simplify<T & { status: Status, ok: false }> }>
}

export const
	Continue                      = n(100, 'continue'),
	SwitchingProtocols            = n(101, 'switchingProtocols'),
	Processing                    = n(102, 'processing'),
	EarlyHints                    = n(103, 'earlyHints'),

	Ok                            = y(200, 'ok'),
	Created                       = y(201, 'created'),
	Accepted                      = y(202, 'accepted'),
	NonAuthoritativeInformation   = y(203, 'nonAuthoritativeInformation'),
	NoContent                     = y(204, 'noContent'),
	ResetContent                  = y(205, 'resetContent'),
	PartialContent                = y(206, 'partialContent'),
	MultiStatus                   = y(207, 'multiStatus'),
	AlreadyReported               = y(208, 'alreadyReported'),
	IMUsed                        = y(226, 'imUsed'),

	MultipleChoices               = n(300, 'multipleChoices'),
	MovedPermanently              = n(301, 'movedPermanently'),
	Found                         = n(302, 'found'),
	SeeOther                      = n(303, 'seeOther'),
	NotModified                   = n(304, 'notModified'),
	UseProxy                      = n(305, 'useProxy'),
	TemporaryRedirect             = n(307, 'temporaryRedirect'),
	PermanentRedirect             = n(308, 'permanentRedirect'),

	BadRequest                    = n(400, 'badRequest'),
	Unauthorized                  = n(401, 'unauthorized'),
	PaymentRequired               = n(402, 'paymentRequired'),
	Forbidden                     = n(403, 'forbidden'),
	NotFound                      = n(404, 'notFound'),
	MethodNotAllowed              = n(405, 'methodNotAllowed'),
	NotAcceptable                 = n(406, 'notAcceptable'),
	ProxyAuthenticationRequired   = n(407, 'proxyAuthenticationRequired'),
	RequestTimeout                = n(408, 'requestTimeout'),
	Conflict                      = n(409, 'conflict'),
	Gone                          = n(410, 'gone'),
	LengthRequired                = n(411, 'lengthRequired'),
	PreconditionFailed            = n(412, 'preconditionFailed'),
	PayloadTooLarge               = n(413, 'payloadTooLarge'),
	URITooLong                    = n(414, 'uriTooLong'),
	UnsupportedMediaType          = n(415, 'unsupportedMediaType'),
	RangeNotSatisfiable           = n(416, 'rangeNotSatisfiable'),
	ExpectationFailed             = n(417, 'expectationFailed'),
	IamATeapot                    = n(418, 'iamATeapot'),
	MisdirectedRequest            = n(421, 'misdirectedRequest'),
	UnprocessableEntity           = n(422, 'unprocessableEntity'),
	Locked                        = n(423, 'locked'),
	FailedDependency              = n(424, 'failedDependency'),
	TooEarly                      = n(425, 'tooEarly'),
	UpgradeRequired               = n(426, 'upgradeRequired'),
	PreconditionRequired          = n(428, 'preconditionRequired'),
	TooManyRequests               = n(429, 'tooManyRequests'),
	RequestHeaderFieldsTooLarge   = n(431, 'requestHeaderFieldsTooLarge'),
	UnavailableForLegalReasons    = n(451, 'unavailableForLegalReasons'),

	InternalServerError           = n(500, 'internalServerError'),
	NotImplemented                = n(501, 'notImplemented'),
	BadGateway                    = n(502, 'badGateway'),
	ServiceUnavailable            = n(503, 'serviceUnavailable'),
	GatewayTimeout                = n(504, 'gatewayTimeout'),
	HTTPVersionNotSupported       = n(505, 'httpVersionNotSupported'),
	VariantAlsoNegotiates         = n(506, 'variantAlsoNegotiates'),
	InsufficientStorage           = n(507, 'insufficientStorage'),
	LoopDetected                  = n(508, 'loopDetected'),
	NotExtended                   = n(510, 'notExtended'),
	NetworkAuthenticationRequired = n(511, 'networkAuthenticationRequired')