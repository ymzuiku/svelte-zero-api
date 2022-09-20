// Is it not possible to just reverse an interface instead of having 2?
interface StatusCode {
	// 1××
	100: 'Continue'
	101: 'SwitchingProtocols'
	102: 'Processing'
	103: 'EarlyHints'
	// 2××
	200: 'Ok'
	201: 'Created'
	202: 'Accepted'
	203: 'NonAuthoritativeInformation'
	204: 'NoContent'
	205: 'ResetContent'
	206: 'PartialContent'
	207: 'MultiStatus'
	208: 'AlreadyReported'
	226: 'IMUsed'
	// 3××
	300: 'MultipleChoices'
	301: 'MovedPermanently'
	302: 'Found'
	303: 'SeeOther'
	304: 'NotModified'
	305: 'UseProxy'
	306: 'SwitchProxy'
	307: 'TemporaryRedirect'
	308: 'PermanentRedirect'
	// 4××
	400: 'BadRequest'
	401: 'Unauthorized'
	402: 'PaymentRequired'
	403: 'Forbidden'
	404: 'NotFound'
	405: 'MethodNotAllowed'
	406: 'NotAcceptable'
	407: 'ProxyAuthenticationRequired'
	408: 'RequestTimeout'
	409: 'Conflict'
	410: 'Gone'
	411: 'LengthRequired'
	412: 'PreconditionFailed'
	413: 'PayloadTooLarge'
	414: 'URITooLong'
	415: 'UnsupportedMediaType'
	416: 'RangeNotSatisfiable'
	417: 'ExpectationFailed'
	418: 'ImATeapot'
	421: 'MisdirectedRequest'
	422: 'UnprocessableEntity'
	423: 'Locked'
	424: 'FailedDependency'
	425: 'TooEarly'
	426: 'UpgradeRequired'
	428: 'PreconditionRequired'
	429: 'TooManyRequests'
	431: 'RequestHeaderFieldsTooLarge'
	451: 'UnavailableForLegalReasons'
	// 5××
	500: 'InternalServerError'
	501: 'NotImplemented'
	502: 'BadGateway'
	503: 'ServiceUnavailable'
	504: 'GatewayTimeout'
	505: 'HTTPVersionNotSupported'
	506: 'VariantAlsoNegotiates'
	507: 'InsufficientStorage'
	508: 'LoopDetected'
	510: 'NotExtended'
	511: 'NetworkAuthenticationRequired'
}

interface StatusText {
	'Continue':                      100
	'SwitchingProtocols':            101
	'Processing':                    102
	'EarlyHints':                    103
	'Ok':                            200
	'Created':                       201
	'Accepted':                      202
	'NonAuthoritativeInformation':   203
	'NoContent':                     204
	'ResetContent':                  205
	'PartialContent':                206
	'MultiStatus':                   207
	'AlreadyReported':               208
	'IMUsed':                        226
	'MultipleChoices':               300
	'MovedPermanently':              301
	'Found':                         302
	'SeeOther':                      303
	'NotModified':                   304
	'UseProxy':                      305
	'SwitchProxy':                   306
	'TemporaryRedirect':             307
	'PermanentRedirect':             308
	'BadRequest':                    400
	'Unauthorized':                  401
	'PaymentRequired':               402
	'Forbidden':                     403
	'NotFound':                      404
	'MethodNotAllowed':              405
	'NotAcceptable':                 406
	'ProxyAuthenticationRequired':   407
	'RequestTimeout':                408
	'Conflict':                      409
	'Gone':                          410
	'LengthRequired':                411
	'PreconditionFailed':            412
	'PayloadTooLarge':               413
	'URITooLong':                    414
	'UnsupportedMediaType':          415
	'RangeNotSatisfiable':           416
	'ExpectationFailed':             417
	'ImATeapot':                     418
	'MisdirectedRequest':            421
	'UnprocessableEntity':           422
	'Locked':                        423
	'FailedDependency':              424
	'TooEarly':                      425
	'UpgradeRequired':               426
	'PreconditionRequired':          428
	'TooManyRequests':               429
	'RequestHeaderFieldsTooLarge':   431
	'UnavailableForLegalReasons':    451
	'InternalServerError':           500
	'NotImplemented':                501
	'BadGateway':                    502
	'ServiceUnavailable':            503
	'GatewayTimeout':                504
	'HTTPVersionNotSupported':       505
	'VariantAlsoNegotiates':         506
	'InsufficientStorage':           507
	'LoopDetected':                  508
	'NotExtended':                   510
	'NetworkAuthenticationRequired': 511
}

interface StatusCodeFn {
	Informational: StatusCode[100 | 101 | 102 | 103]
	Success:       StatusCode[200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226]
	Redirect:      StatusCode[300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308]
	ClientError:   StatusCode[
		400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 |
		410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 
		422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451
	]
	ServerError:   StatusCode[500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511]
	Error:         StatusCodeFn['ClientError'] | StatusCodeFn['ServerError']
}

type StatusClass = {
	[Property in StatusCodeFn['Informational']]: 'Informational' | 'Any'
} & {
	[Property in StatusCodeFn['Success']]: 'Success' | 'Any'
} & {
	[Property in StatusCodeFn['Redirect']]: 'Redirect' | 'Any'
} & {
	[Property in StatusCodeFn['ClientError']]: 'ClientError' | 'Error' | 'Any'
} & {
	[Property in StatusCodeFn['ServerError']]: 'ServerError' | 'Error' | 'Any'
}