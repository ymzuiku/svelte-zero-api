// *    100 - level(Informational)  – server acknowledges a request
// *    200 - level(Success) 		– server completed the request as expected
// *    300 - level(Redirection) 	– client needs to perform further actions to complete the request
// *    400 - level(Client error) 	– client sent an invalid request
// *    500 - level(Server error) 	– server failed to fulfill a valid request due to an error with server

export enum Informational {
	Continue                                   = 100,
	SwitchingProtocols                         = 101,
	Processing                                 = 102
}

export type InformationalCode =
	Informational.Continue                     | 100 |
	Informational.SwitchingProtocols           | 101 |
	Informational.Processing                   | 102 

export enum Success {
	Ok                                         = 200,
	Created                                    = 201,
	Accepted                                   = 202,
	NonAuthoritativeInformation                = 203,
	NoContent                                  = 204,
	ResetContent                               = 205,
	PartialContent                             = 206,
	MultiStatus                                = 207,
	AlreadyReported                            = 208,
	IMUsed                                     = 226
}

export type SuccessCode =
	Success.Ok                                 | 200 |
	Success.Created                            | 201 |
	Success.Accepted                           | 202 |
	Success.NonAuthoritativeInformation        | 203 |
	Success.NoContent                          | 204 |
	Success.ResetContent                       | 205 |
	Success.PartialContent                     | 206 |
	Success.MultiStatus                        | 207 |
	Success.AlreadyReported                    | 208 |
	Success.IMUsed                             | 226

export enum Redirection {
	MultipleChoices                            = 300,
	MovedPermanently                           = 301,
	Found                                      = 302,
	CheckOther                                 = 303,
	NotModified                                = 304,
	UseProxy                                   = 305,
	SwitchProxy                                = 306,
	TemporaryRedirect                          = 307,
	PermanentRedirect                          = 308
}

export type RedirectionCode =
	Redirection.MultipleChoices                | 300 |
	Redirection.MovedPermanently               | 301 |
	Redirection.Found                          | 302 |
	Redirection.CheckOther                     | 303 |
	Redirection.NotModified                    | 304 |
	Redirection.UseProxy                       | 305 |
	Redirection.SwitchProxy                    | 306 |
	Redirection.TemporaryRedirect              | 307 |
	Redirection.PermanentRedirect              | 308 

export enum ClientError {
	BadRequest                                 = 400,
	Unauthorized                               = 401,
	PaymentRequired                            = 402,
	Forbidden                                  = 403,
	NotFound                                   = 404,
	MethodNotAllowed                           = 405,
	NotAcceptable                              = 406,
	ProxyAuthenticationRequired                = 407,
	RequestTimeout                             = 408,
	Conflict                                   = 409,
	Gone                                       = 410,
	LengthRequired                             = 411,
	PreconditionFailed                         = 412,
	PayloadTooLarge                            = 413,
	URITooLong                                 = 414,
	UnsupportedMediaType                       = 415,
	RangeNotSatisfiable                        = 416,
	ExpectationFailed                          = 417,
	ImATeapot                                  = 418,
	MisdirectedRequest                         = 421,
	UnprocessableEntity                        = 422,
	Locked                                     = 423,
	FailedDependency                           = 424,
	UpgradeRequired                            = 426,
	PreconditionRequired                       = 428,
	TooManyRequests                            = 429,
	RequestHeaderFieldsTooLarge                = 431,
	UnavailableForLegalReasons                 = 451
}

export type ClientErrorCode = 
	ClientError.BadRequest                     | 400 |
	ClientError.Unauthorized                   | 401 |
	ClientError.PaymentRequired 			   | 402 |
	ClientError.Forbidden                      | 403 |
	ClientError.NotFound                       | 404 |
	ClientError.MethodNotAllowed               | 405 |
	ClientError.NotAcceptable                  | 406 |
	ClientError.ProxyAuthenticationRequired    | 407 |
	ClientError.RequestTimeout                 | 408 |
	ClientError.Conflict                       | 409 |
	ClientError.Gone                           | 410 |
	ClientError.LengthRequired                 | 411 |
	ClientError.PreconditionFailed             | 412 |
	ClientError.PayloadTooLarge                | 413 |
	ClientError.URITooLong                     | 414 |
	ClientError.UnsupportedMediaType           | 415 |
	ClientError.RangeNotSatisfiable            | 416 |
	ClientError.ExpectationFailed              | 417 |
	ClientError.ImATeapot                      | 418 |
	ClientError.MisdirectedRequest             | 421 |
	ClientError.UnprocessableEntity            | 422 |
	ClientError.Locked                         | 423 |
	ClientError.FailedDependency               | 424 |
	ClientError.UpgradeRequired                | 426 |
	ClientError.PreconditionRequired           | 428 |
	ClientError.TooManyRequests                | 429 |
	ClientError.RequestHeaderFieldsTooLarge    | 431 |
	ClientError.UnavailableForLegalReasons     | 451

export enum ServerError {
	InternalServerError                        = 500,
	NotImplemented                             = 501,
	BadGateaway                                = 502,
	ServiceUnavailable                         = 503,
	GatewayTimeout                             = 504,
	HTTPVersionNotSupported                    = 505,
	VariantAlsoNegotiates                      = 506,
	InsufficientStorage                        = 507,
	LoopDetected                               = 508,
	NotExtended                                = 510,
	NetworkAuthenticationRequired              = 511
}

export type ServerErrorCode =
	ServerError.InternalServerError            | 500 | 
	ServerError.NotImplemented                 | 501 | 
	ServerError.BadGateaway                    | 502 | 
	ServerError.ServiceUnavailable             | 503 | 
	ServerError.GatewayTimeout                 | 504 | 
	ServerError.HTTPVersionNotSupported        | 505 | 
	ServerError.VariantAlsoNegotiates          | 506 | 
	ServerError.InsufficientStorage            | 507 | 
	ServerError.LoopDetected                   | 508 | 
	ServerError.NotExtended                    | 510 | 
	ServerError.NetworkAuthenticationRequired  | 511

export type ErrorCode = ServerErrorCode | ClientErrorCode
export type StatusCode = InformationalCode | SuccessCode | RedirectionCode | ClientErrorCode | ServerErrorCode