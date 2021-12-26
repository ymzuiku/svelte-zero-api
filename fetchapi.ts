type FixedAwaited<T> = T extends PromiseLike<infer U> ? U : T
type Callback<T, U> = (response: Extract<FixedAwaited<T>, U>) => void
import type * as StatusCode from './httpcodes'
import type { Response } from './http'


export interface ResponseType<T extends Promise<Record<string, unknown>>> extends Partial<Promise<T>> {}

export interface ResponseTypeExtended<T extends Promise<Record<string, unknown>>> extends Partial<Promise<T>> {
	/** You don't return a ClientError, but still want to check for it (ex. 404)? Underscore at the rescue! */
	_:
		// General
		InformationalType<Promise<Response>, {}> & 
		SuccessType<Promise<Response>, {}> & 
		RedirectionType<Promise<Response>, {}> & 
		ClientErrorType<Promise<Response>, {}> & 
		ServerErrorType<Promise<Response>, {}> & 
		ErrorType<Promise<Response>, {}> & 

		// 1××
		ContinueType<Promise<Response>, {}> & 
		SwitchingProtocolsType<Promise<Response>, {}> & 
		ProcessingType<Promise<Response>, {}> & 

		// 2××
		okType<Promise<Response>, {}> & 
		CreatedType<Promise<Response>, {}> & 
		AcceptedType<Promise<Response>, {}> & 
		NonAuthoritativeInformationType<Promise<Response>, {}> & 
		NoContentType<Promise<Response>, {}> & 
		ResetContentType<Promise<Response>, {}> & 
		PartialContentType<Promise<Response>, {}> & 
		MultiStatusType<Promise<Response>, {}> & 
		AlreadyReportedType<Promise<Response>, {}> & 
		IMUsedType<Promise<Response>, {}> & 

		// 3××
		MultipleChoicesType<Promise<Response>, {}> & 
		MovedPermanentlyType<Promise<Response>, {}> & 
		FoundType<Promise<Response>, {}> & 
		CheckOtherType<Promise<Response>, {}> & 
		NotModifiedType<Promise<Response>, {}> & 
		UseProxyType<Promise<Response>, {}> & 
		SwitchProxyType<Promise<Response>, {}> & 
		TemporaryRedirectType<Promise<Response>, {}> & 
		PermanentRedirectType<Promise<Response>, {}> & 

		// 4××
		BadRequestType<Promise<Response>, {}> & 
		UnauthorizedType<Promise<Response>, {}> & 
		PaymentRequiredType<Promise<Response>, {}> & 
		ForbiddenType<Promise<Response>, {}> & 
		NotFoundType<Promise<Response>, {}> & 
		MethodNotAllowedType<Promise<Response>, {}> & 
		NotAcceptableType<Promise<Response>, {}> & 
		ProxyAuthenticationRequiredType<Promise<Response>, {}> & 
		RequestTimeoutType<Promise<Response>, {}> & 
		ConflictType<Promise<Response>, {}> & 
		GoneType<Promise<Response>, {}> & 
		LengthRequiredType<Promise<Response>, {}> & 
		PreconditionFailedType<Promise<Response>, {}> & 
		PayloadTooLargeType<Promise<Response>, {}> & 
		URITooLongType<Promise<Response>, {}> & 
		UnsupportedMediaTypeType<Promise<Response>, {}> & 
		RangeNotSatisfiableType<Promise<Response>, {}> & 
		ExpectationFailedType<Promise<Response>, {}> & 
		ImATeapotType<Promise<Response>, {}> & 
		MisdirectedRequestType<Promise<Response>, {}> & 
		UnprocessableEntityType<Promise<Response>, {}> & 
		LockedType<Promise<Response>, {}> & 
		FailedDependencyType<Promise<Response>, {}> & 
		UpgradeRequiredType<Promise<Response>, {}> & 
		PreconditionRequiredType<Promise<Response>, {}> & 
		TooManyRequestsType<Promise<Response>, {}> & 
		RequestHeaderFieldsTooLargeType<Promise<Response>, {}> & 
		UnavailableForLegalReasonsType<Promise<Response>, {}> & 

		// 5××
		InternalServerErrorType<Promise<Response>, {}> & 
		NotImplementedType<Promise<Response>, {}> & 
		BadGateawayType<Promise<Response>, {}> & 
		ServiceUnavailableType<Promise<Response>, {}> & 
		GatewayTimeoutType<Promise<Response>, {}> & 
		HTTPVersionNotSupportedType<Promise<Response>, {}> & 
		VariantAlsoNegotiatesType<Promise<Response>, {}> & 
		InsufficientStorageType<Promise<Response>, {}> & 
		LoopDetectedType<Promise<Response>, {}> & 
		NotExtendedType<Promise<Response>, {}> & 
		NetworkAuthenticationRequiredType<Promise<Response>, {}>
}

// * General
export interface InformationalType<T extends Promise<object>, S extends object > {
	/** Callback for 1××-responses */
	informational: (callback: Callback<T, S>) => this
}
export interface SuccessType<T extends Promise<object>, S extends object> {
	/** Callback for 2××-responses */
	success: (callback: Callback<T, S>) => this
}
export interface RedirectionType<T extends Promise<object>, S extends object > {
	/** Callback for 3××-responses */
	redirection: (callback: Callback<T, S>) => this
}
export interface ClientErrorType<T extends Promise<object>, S extends object > {
	/** Callback for 4××-responses */
	clientError: (callback: Callback<T, S>) => this
}
export interface ServerErrorType<T extends Promise<object>, S extends object > {
	/** Callback for 5××-responses */
	serverError: (callback: Callback<T, S>) => this
}
export interface ErrorType<T extends Promise<object>, S extends object > {
	/** Callback for 4××- & 5××-responses */
	error: (callback: Callback<T, S>) => this
}

// 1××
export interface ContinueType<T extends Promise<object>, S extends object > {
	/** Callback for status 100-responses */
	continue: (callback: Callback<T, S>) => this
}
export interface SwitchingProtocolsType<T extends Promise<object>, S extends object > {
	/** Callback for status 101-responses */
	switchingProtocols: (callback: Callback<T, S>) => this
}
export interface ProcessingType<T extends Promise<object>, S extends object > {
	/** Callback for status 102-responses */
	processing: (callback: Callback<T, S>) => this
}

// 2××
export interface okType<T extends Promise<object>, S extends object > {
	/** Callback for status 200-responses */
	ok: (callback: Callback<T, S>) => this
}
export interface CreatedType<T extends Promise<object>, S extends object > {
	/** Callback for status 201-responses */
	created: (callback: Callback<T, S>) => this
}
export interface AcceptedType<T extends Promise<object>, S extends object > {
	/** Callback for status 202-responses */
	accepted: (callback: Callback<T, S>) => this
}
export interface NonAuthoritativeInformationType<T extends Promise<object>, S extends object > {
	/** Callback for status 203-responses */
	nonAuthoritativeInformation: (callback: Callback<T, S>) => this
}
export interface NoContentType<T extends Promise<object>, S extends object > {
	/** Callback for status 204-responses */
	noContent: (callback: Callback<T, S>) => this
}
export interface ResetContentType<T extends Promise<object>, S extends object > {
	/** Callback for status 205-responses */
	resetContent: (callback: Callback<T, S>) => this
}
export interface PartialContentType<T extends Promise<object>, S extends object > {
	/** Callback for status 206-responses */
	partialContent: (callback: Callback<T, S>) => this
}
export interface MultiStatusType<T extends Promise<object>, S extends object > {
	/** Callback for status 207-responses */
	multiStatus: (callback: Callback<T, S>) => this
}
export interface AlreadyReportedType<T extends Promise<object>, S extends object > {
	/** Callback for status 208-responses */
	alreadyReported: (callback: Callback<T, S>) => this
}
export interface IMUsedType<T extends Promise<object>, S extends object > {
	/** Callback for status 226-responses */
	IMUsed: (callback: Callback<T, S>) => this
}

// 3××
export interface MultipleChoicesType<T extends Promise<object>, S extends object > {
	/** Callback for status 300-responses */
	multipleChoices: (callback: Callback<T, S>) => this
}
export interface MovedPermanentlyType<T extends Promise<object>, S extends object > {
	/** Callback for status 301-responses */
	movedPermanently: (callback: Callback<T, S>) => this
}
export interface FoundType<T extends Promise<object>, S extends object > {
	/** Callback for status 302-responses */
	found: (callback: Callback<T, S>) => this
}
export interface CheckOtherType<T extends Promise<object>, S extends object > {
	/** Callback for status 303-responses */
	checkOther: (callback: Callback<T, S>) => this
}
export interface NotModifiedType<T extends Promise<object>, S extends object > {
	/** Callback for status 304-responses */
	notModified: (callback: Callback<T, S>) => this
}
export interface UseProxyType<T extends Promise<object>, S extends object > {
	/** Callback for status 305-responses */
	useProxy: (callback: Callback<T, S>) => this
}
export interface SwitchProxyType<T extends Promise<object>, S extends object > {
	/** Callback for status 306-responses */
	switchProxy: (callback: Callback<T, S>) => this
}
export interface TemporaryRedirectType<T extends Promise<object>, S extends object > {
	/** Callback for status 307-responses */
	temporaryRedirect: (callback: Callback<T, S>) => this
}
export interface PermanentRedirectType<T extends Promise<object>, S extends object > {
	/** Callback for status 308-responses */
	permanentRedirect: (callback: Callback<T, S>) => this
}


// 4××
export interface BadRequestType<T extends Promise<object>, S extends object > {
	/** Callback for status 400-responses */
	badRequest: (callback: Callback<T, S>) => this
}
export interface UnauthorizedType<T extends Promise<object>, S extends object > {
	/** Callback for status 401-responses */
	unauthorized: (callback: Callback<T, S>) => this
}
export interface PaymentRequiredType<T extends Promise<object>, S extends object > {
	/** Callback for status 402-responses */
	paymentRequired: (callback: Callback<T, S>) => this
}
export interface ForbiddenType<T extends Promise<object>, S extends object > {
	/** Callback for status 403-responses */
	forbidden: (callback: Callback<T, S>) => this
}
export interface NotFoundType<T extends Promise<object>, S extends object > {
	/** Callback for status 404-responses */
	notFound: (callback: Callback<T, S>) => this
}
export interface MethodNotAllowedType<T extends Promise<object>, S extends object > {
	/** Callback for status 405-responses */
	methodNotAllowed: (callback: Callback<T, S>) => this
}
export interface NotAcceptableType<T extends Promise<object>, S extends object > {
	/** Callback for status 406-responses */
	notAcceptable: (callback: Callback<T, S>) => this
}
export interface ProxyAuthenticationRequiredType<T extends Promise<object>, S extends object > {
	/** Callback for status 407-responses */
	proxyAuthenticationRequired: (callback: Callback<T, S>) => this
}
export interface RequestTimeoutType<T extends Promise<object>, S extends object > {
	/** Callback for status 408-responses */
	requestTimeout: (callback: Callback<T, S>) => this
}
export interface ConflictType<T extends Promise<object>, S extends object > {
	/** Callback for status 409-responses */
	conflict: (callback: Callback<T, S>) => this
}
export interface GoneType<T extends Promise<object>, S extends object > {
	/** Callback for status 410-responses */
	gone: (callback: Callback<T, S>) => this
}
export interface LengthRequiredType<T extends Promise<object>, S extends object > {
	/** Callback for status 411-responses */
	lengthRequired: (callback: Callback<T, S>) => this
}
export interface PreconditionFailedType<T extends Promise<object>, S extends object > {
	/** Callback for status 412-responses */
	preconditionFailed: (callback: Callback<T, S>) => this
}
export interface PayloadTooLargeType<T extends Promise<object>, S extends object > {
	/** Callback for status 413-responses */
	payloadTooLarge: (callback: Callback<T, S>) => this
}
export interface URITooLongType<T extends Promise<object>, S extends object > {
	/** Callback for status 414-responses */
	URITooLong: (callback: Callback<T, S>) => this
}
export interface UnsupportedMediaTypeType<T extends Promise<object>, S extends object > {
	/** Callback for status 415-responses */
	unsupportedMediaType: (callback: Callback<T, S>) => this
}
export interface RangeNotSatisfiableType<T extends Promise<object>, S extends object > {
	/** Callback for status 416-responses */
	rangeNotSatisfiable: (callback: Callback<T, S>) => this
}
export interface ExpectationFailedType<T extends Promise<object>, S extends object > {
	/** Callback for status 417-responses */
	expectationFailed: (callback: Callback<T, S>) => this
}
export interface ImATeapotType<T extends Promise<object>, S extends object > {
	/** Callback for status 418-responses */
	imATeapot: (callback: Callback<T, S>) => this
}
export interface MisdirectedRequestType<T extends Promise<object>, S extends object > {
	/** Callback for status 421-responses */
	misdirectedRequest: (callback: Callback<T, S>) => this
}
export interface UnprocessableEntityType<T extends Promise<object>, S extends object > {
	/** Callback for status 422-responses */
	unprocessableEntity: (callback: Callback<T, S>) => this
}
export interface LockedType<T extends Promise<object>, S extends object > {
	/** Callback for status 423-responses */
	locked: (callback: Callback<T, S>) => this
}
export interface FailedDependencyType<T extends Promise<object>, S extends object > {
	/** Callback for status 424-responses */
	failedDependency: (callback: Callback<T, S>) => this
}
export interface UpgradeRequiredType<T extends Promise<object>, S extends object > {
	/** Callback for status 426-responses */
	upgradeRequired: (callback: Callback<T, S>) => this
}
export interface PreconditionRequiredType<T extends Promise<object>, S extends object > {
	/** Callback for status 428-responses */
	preconditionRequired: (callback: Callback<T, S>) => this
}
export interface TooManyRequestsType<T extends Promise<object>, S extends object > {
	/** Callback for status 429-responses */
	tooManyRequests: (callback: Callback<T, S>) => this
}
export interface RequestHeaderFieldsTooLargeType<T extends Promise<object>, S extends object > {
	/** Callback for status 431-responses */
	requestHeaderFieldsTooLarge: (callback: Callback<T, S>) => this
}
export interface UnavailableForLegalReasonsType<T extends Promise<object>, S extends object > {
	/** Callback for status 451-responses */
	unavailableForLegalReasons: (callback: Callback<T, S>) => this
}


// 5××
export interface InternalServerErrorType<T extends Promise<object>, S extends object > {
	/** Callback for status 500-responses */
	internalServerError: (callback: Callback<T, S>) => this
}
export interface NotImplementedType<T extends Promise<object>, S extends object > {
	/** Callback for status 501-responses */
	notImplemented: (callback: Callback<T, S>) => this
}
export interface BadGateawayType<T extends Promise<object>, S extends object > {
	/** Callback for status 502-responses */
	badGateaway: (callback: Callback<T, S>) => this
}
export interface ServiceUnavailableType<T extends Promise<object>, S extends object > {
	/** Callback for status 503-responses */
	serviceUnavailable: (callback: Callback<T, S>) => this
}
export interface GatewayTimeoutType<T extends Promise<object>, S extends object > {
	/** Callback for status 504-responses */
	gatewayTimeout: (callback: Callback<T, S>) => this
}
export interface HTTPVersionNotSupportedType<T extends Promise<object>, S extends object > {
	/** Callback for status 505-responses */
	HTTPVersionNotSupported: (callback: Callback<T, S>) => this
}
export interface VariantAlsoNegotiatesType<T extends Promise<object>, S extends object > {
	/** Callback for status 506-responses */
	variantAlsoNegotiates: (callback: Callback<T, S>) => this
}
export interface InsufficientStorageType<T extends Promise<object>, S extends object > {
	/** Callback for status 507-responses */
	insufficientStorage: (callback: Callback<T, S>) => this
}
export interface LoopDetectedType<T extends Promise<object>, S extends object > {
	/** Callback for status 508-responses */
	loopDetected: (callback: Callback<T, S>) => this
}
export interface NotExtendedType<T extends Promise<object>, S extends object > {
	/** Callback for status 510-responses */
	notExtended: (callback: Callback<T, S>) => this
}
export interface NetworkAuthenticationRequiredType<T extends Promise<object>, S extends object> {
	/** Callback for status 511-responses */
	networkAuthenticationRequired: (callback: Callback<T, S>) => this
}

export type FetchApiPromise<T extends Promise<Record<string, unknown>>> = ResponseType<T>

export type FetchApi<T extends Promise<Record<string, unknown>>> =
	ResponseTypeExtended<T> &	

	// General
	// Callback extracts paramter callback type, that has status: number — if it doesn't have number, return {} : return Type associated with number
	(Callback<T, { status: StatusCode.InformationalCode }> extends ([never]) => void ? {} : InformationalType<T, { status: StatusCode.InformationalCode }>) &
	(Callback<T, { status: StatusCode.SuccessCode }> extends ([never]) => void ? {} : SuccessType<T, { status: StatusCode.SuccessCode }>) &
	(Callback<T, { status: StatusCode.ClientErrorCode }> extends ([never]) => void ? {} : ClientErrorType<T, { status: StatusCode.ClientErrorCode }>) &
	(Callback<T, { status: StatusCode.ServerErrorCode }> extends ([never]) => void ? {} : ServerErrorType<T, { status: StatusCode.ServerErrorCode }>) &
	(Callback<T, { status: StatusCode.ErrorCode }> extends ([never]) => void ? {} : ErrorType<T, { status: StatusCode.ErrorCode }>) &
	
	// 1××
	(Callback<T, { status: 100 }> extends ([never]) => void ? {} : ContinueType                      <T, { status: 100 }>) &
	(Callback<T, { status: 101 }> extends ([never]) => void ? {} : SwitchingProtocolsType            <T, { status: 101 }>) &
	(Callback<T, { status: 102 }> extends ([never]) => void ? {} : ProcessingType                    <T, { status: 102 }>) &

	// 2××
	(Callback<T, { status: 200 }> extends ([never]) => void ? {} : okType                            <T, { status: 200 }>) &
	(Callback<T, { status: 201 }> extends ([never]) => void ? {} : CreatedType                       <T, { status: 201 }>) &
	(Callback<T, { status: 202 }> extends ([never]) => void ? {} : AcceptedType                      <T, { status: 202 }>) &
	(Callback<T, { status: 203 }> extends ([never]) => void ? {} : NonAuthoritativeInformationType   <T, { status: 203 }>) &
	(Callback<T, { status: 204 }> extends ([never]) => void ? {} : NoContentType                     <T, { status: 204 }>) &
	(Callback<T, { status: 205 }> extends ([never]) => void ? {} : ResetContentType                  <T, { status: 205 }>) &
	(Callback<T, { status: 206 }> extends ([never]) => void ? {} : PartialContentType                <T, { status: 206 }>) &
	(Callback<T, { status: 207 }> extends ([never]) => void ? {} : MultiStatusType                   <T, { status: 207 }>) &
	(Callback<T, { status: 208 }> extends ([never]) => void ? {} : AlreadyReportedType               <T, { status: 208 }>) &
	(Callback<T, { status: 226 }> extends ([never]) => void ? {} : IMUsedType                        <T, { status: 226 }>) &
	
	// 3××
	(Callback<T, { status: 300 }> extends ([never]) => void ? {} : MultipleChoicesType               <T, { status: 300 }>) &
	(Callback<T, { status: 301 }> extends ([never]) => void ? {} : MovedPermanentlyType              <T, { status: 301 }>) &
	(Callback<T, { status: 302 }> extends ([never]) => void ? {} : FoundType                         <T, { status: 302 }>) &
	(Callback<T, { status: 303 }> extends ([never]) => void ? {} : CheckOtherType                    <T, { status: 303 }>) &
	(Callback<T, { status: 304 }> extends ([never]) => void ? {} : NotModifiedType                   <T, { status: 304 }>) &
	(Callback<T, { status: 305 }> extends ([never]) => void ? {} : UseProxyType                      <T, { status: 305 }>) &
	(Callback<T, { status: 306 }> extends ([never]) => void ? {} : SwitchProxyType                   <T, { status: 306 }>) &
	(Callback<T, { status: 307 }> extends ([never]) => void ? {} : TemporaryRedirectType             <T, { status: 307 }>) &
	(Callback<T, { status: 308 }> extends ([never]) => void ? {} : PermanentRedirectType             <T, { status: 308 }>) &
	
	// 4××
	(Callback<T, { status: 400 }> extends ([never]) => void ? {} : BadRequestType                    <T, { status: 400 }>) &
	(Callback<T, { status: 401 }> extends ([never]) => void ? {} : UnauthorizedType                  <T, { status: 401 }>) &
	(Callback<T, { status: 402 }> extends ([never]) => void ? {} : PaymentRequiredType               <T, { status: 402 }>) &
	(Callback<T, { status: 403 }> extends ([never]) => void ? {} : ForbiddenType                     <T, { status: 403 }>) &
	(Callback<T, { status: 404 }> extends ([never]) => void ? {} : NotFoundType                      <T, { status: 404 }>) &
	(Callback<T, { status: 405 }> extends ([never]) => void ? {} : MethodNotAllowedType              <T, { status: 405 }>) &
	(Callback<T, { status: 406 }> extends ([never]) => void ? {} : NotAcceptableType                 <T, { status: 406 }>) &
	(Callback<T, { status: 407 }> extends ([never]) => void ? {} : ProxyAuthenticationRequiredType   <T, { status: 407 }>) &
	(Callback<T, { status: 408 }> extends ([never]) => void ? {} : RequestTimeoutType                <T, { status: 408 }>) &
	(Callback<T, { status: 409 }> extends ([never]) => void ? {} : ConflictType                      <T, { status: 409 }>) &
	(Callback<T, { status: 410 }> extends ([never]) => void ? {} : GoneType                          <T, { status: 410 }>) &
	(Callback<T, { status: 411 }> extends ([never]) => void ? {} : LengthRequiredType                <T, { status: 411 }>) &
	(Callback<T, { status: 412 }> extends ([never]) => void ? {} : PreconditionFailedType            <T, { status: 412 }>) &
	(Callback<T, { status: 413 }> extends ([never]) => void ? {} : PayloadTooLargeType               <T, { status: 413 }>) &
	(Callback<T, { status: 414 }> extends ([never]) => void ? {} : URITooLongType                    <T, { status: 414 }>) &
	(Callback<T, { status: 415 }> extends ([never]) => void ? {} : UnsupportedMediaTypeType          <T, { status: 415 }>) &
	(Callback<T, { status: 416 }> extends ([never]) => void ? {} : RangeNotSatisfiableType           <T, { status: 416 }>) &
	(Callback<T, { status: 417 }> extends ([never]) => void ? {} : ExpectationFailedType             <T, { status: 417 }>) &
	(Callback<T, { status: 418 }> extends ([never]) => void ? {} : ImATeapotType                     <T, { status: 418 }>) &
	(Callback<T, { status: 421 }> extends ([never]) => void ? {} : MisdirectedRequestType            <T, { status: 421 }>) &
	(Callback<T, { status: 422 }> extends ([never]) => void ? {} : UnprocessableEntityType           <T, { status: 422 }>) &
	(Callback<T, { status: 423 }> extends ([never]) => void ? {} : LockedType                        <T, { status: 423 }>) &
	(Callback<T, { status: 424 }> extends ([never]) => void ? {} : FailedDependencyType              <T, { status: 424 }>) &
	(Callback<T, { status: 426 }> extends ([never]) => void ? {} : UpgradeRequiredType               <T, { status: 426 }>) &
	(Callback<T, { status: 428 }> extends ([never]) => void ? {} : PreconditionRequiredType          <T, { status: 428 }>) &
	(Callback<T, { status: 429 }> extends ([never]) => void ? {} : TooManyRequestsType               <T, { status: 429 }>) &
	(Callback<T, { status: 431 }> extends ([never]) => void ? {} : RequestHeaderFieldsTooLargeType   <T, { status: 431 }>) &
	(Callback<T, { status: 451 }> extends ([never]) => void ? {} : UnavailableForLegalReasonsType    <T, { status: 451 }>) &
	
	// 5××
	(Callback<T, { status: 500 }> extends ([never]) => void ? {} : InternalServerErrorType           <T, { status: 500 }>) &
	(Callback<T, { status: 501 }> extends ([never]) => void ? {} : NotImplementedType                <T, { status: 501 }>) &
	(Callback<T, { status: 502 }> extends ([never]) => void ? {} : BadGateawayType                   <T, { status: 502 }>) &
	(Callback<T, { status: 503 }> extends ([never]) => void ? {} : ServiceUnavailableType            <T, { status: 503 }>) &
	(Callback<T, { status: 504 }> extends ([never]) => void ? {} : GatewayTimeoutType                <T, { status: 504 }>) &
	(Callback<T, { status: 505 }> extends ([never]) => void ? {} : HTTPVersionNotSupportedType       <T, { status: 505 }>) &
	(Callback<T, { status: 506 }> extends ([never]) => void ? {} : VariantAlsoNegotiatesType         <T, { status: 506 }>) &
	(Callback<T, { status: 507 }> extends ([never]) => void ? {} : InsufficientStorageType           <T, { status: 507 }>) &
	(Callback<T, { status: 508 }> extends ([never]) => void ? {} : LoopDetectedType                  <T, { status: 508 }>) &
	(Callback<T, { status: 510 }> extends ([never]) => void ? {} : NotExtendedType                   <T, { status: 510 }>) &
	(Callback<T, { status: 511 }> extends ([never]) => void ? {} : NetworkAuthenticationRequiredType <T, { status: 511 }>)

