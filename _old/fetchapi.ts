import type * as StatusCode from './httpcodes'
import type { SvelteResponse } from './http'
import type { MaybePromise } from './lib/types/helpers'

type FixedAwaited<T> = T extends PromiseLike<infer U> ? U : T

type Callback<T, S> = (response: Extract<FixedAwaited<T>, S>) => void

export type ExportCallback<T extends Callback<any, any>> = T extends Callback<infer X, any> ? X : never

/*
	Instead of having every type, how about the returning functions, extends like { status 200, name: 'ok' },
	and the types will just use the name-key for a function?

	_: could just be an object that lists the callbacks, rather than it being ONE GIANT intersection type
*/

export interface ResponseType<T extends MaybePromise<Record<string, unknown>>> extends Partial<Promise<SvelteResponse<T>>> {
	any: (callback: Callback<MaybePromise<T>, {}>) => this

	/** Returns the value, which is returned in the callback */
	$: {}

	/** You don't return a ClientError, but still want to check for it (ex. 404)? Underscore at the rescue! */
	_:
		// General
		InformationalType                 <MaybePromise<SvelteResponse<T>>, {}> & 
		SuccessType                       <MaybePromise<SvelteResponse<T>>, {}> & 
		RedirectionType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		ClientErrorType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		ServerErrorType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		ErrorType                         <MaybePromise<SvelteResponse<T>>, {}> & 

		// 1××
		ContinueType                      <MaybePromise<SvelteResponse<T>>, {}> & 
		SwitchingProtocolsType            <MaybePromise<SvelteResponse<T>>, {}> & 
		ProcessingType                    <MaybePromise<SvelteResponse<T>>, {}> & 

		// 2××
		okType                            <MaybePromise<SvelteResponse<T>>, {}> & 
		CreatedType                       <MaybePromise<SvelteResponse<T>>, {}> & 
		AcceptedType                      <MaybePromise<SvelteResponse<T>>, {}> & 
		NonAuthoritativeInformationType   <MaybePromise<SvelteResponse<T>>, {}> & 
		NoContentType                     <MaybePromise<SvelteResponse<T>>, {}> & 
		ResetContentType                  <MaybePromise<SvelteResponse<T>>, {}> & 
		PartialContentType                <MaybePromise<SvelteResponse<T>>, {}> & 
		MultiStatusType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		AlreadyReportedType               <MaybePromise<SvelteResponse<T>>, {}> & 
		IMUsedType                        <MaybePromise<SvelteResponse<T>>, {}> & 

		// 3××
		MultipleChoicesType               <MaybePromise<SvelteResponse<T>>, {}> & 
		MovedPermanentlyType              <MaybePromise<SvelteResponse<T>>, {}> & 
		FoundType                         <MaybePromise<SvelteResponse<T>>, {}> & 
		CheckOtherType                    <MaybePromise<SvelteResponse<T>>, {}> & 
		NotModifiedType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		UseProxyType                      <MaybePromise<SvelteResponse<T>>, {}> & 
		SwitchProxyType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		TemporaryRedirectType             <MaybePromise<SvelteResponse<T>>, {}> & 
		PermanentRedirectType             <MaybePromise<SvelteResponse<T>>, {}> & 

		// 4××
		BadRequestType                    <MaybePromise<SvelteResponse<T>>, {}> & 
		UnauthorizedType                  <MaybePromise<SvelteResponse<T>>, {}> & 
		PaymentRequiredType               <MaybePromise<SvelteResponse<T>>, {}> & 
		ForbiddenType                     <MaybePromise<SvelteResponse<T>>, {}> & 
		NotFoundType                      <MaybePromise<SvelteResponse<T>>, {}> & 
		MethodNotAllowedType              <MaybePromise<SvelteResponse<T>>, {}> & 
		NotAcceptableType                 <MaybePromise<SvelteResponse<T>>, {}> & 
		ProxyAuthenticationRequiredType   <MaybePromise<SvelteResponse<T>>, {}> & 
		RequestTimeoutType                <MaybePromise<SvelteResponse<T>>, {}> & 
		ConflictType                      <MaybePromise<SvelteResponse<T>>, {}> & 
		GoneType                          <MaybePromise<SvelteResponse<T>>, {}> & 
		LengthRequiredType                <MaybePromise<SvelteResponse<T>>, {}> & 
		PreconditionFailedType            <MaybePromise<SvelteResponse<T>>, {}> & 
		PayloadTooLargeType               <MaybePromise<SvelteResponse<T>>, {}> & 
		URITooLongType                    <MaybePromise<SvelteResponse<T>>, {}> & 
		UnsupportedMediaTypeType          <MaybePromise<SvelteResponse<T>>, {}> & 
		RangeNotSatisfiableType           <MaybePromise<SvelteResponse<T>>, {}> & 
		ExpectationFailedType             <MaybePromise<SvelteResponse<T>>, {}> & 
		ImATeapotType                     <MaybePromise<SvelteResponse<T>>, {}> & 
		MisdirectedRequestType            <MaybePromise<SvelteResponse<T>>, {}> & 
		UnprocessableEntityType           <MaybePromise<SvelteResponse<T>>, {}> & 
		LockedType                        <MaybePromise<SvelteResponse<T>>, {}> & 
		FailedDependencyType              <MaybePromise<SvelteResponse<T>>, {}> & 
		UpgradeRequiredType               <MaybePromise<SvelteResponse<T>>, {}> & 
		PreconditionRequiredType          <MaybePromise<SvelteResponse<T>>, {}> & 
		TooManyRequestsType               <MaybePromise<SvelteResponse<T>>, {}> & 
		RequestHeaderFieldsTooLargeType   <MaybePromise<SvelteResponse<T>>, {}> & 
		UnavailableForLegalReasonsType    <MaybePromise<SvelteResponse<T>>, {}> & 

		// 5××
		InternalServerErrorType           <MaybePromise<SvelteResponse<T>>, {}> & 
		NotImplementedType                <MaybePromise<SvelteResponse<T>>, {}> & 
		BadGateawayType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		ServiceUnavailableType            <MaybePromise<SvelteResponse<T>>, {}> & 
		GatewayTimeoutType                <MaybePromise<SvelteResponse<T>>, {}> & 
		HTTPVersionNotSupportedType       <MaybePromise<SvelteResponse<T>>, {}> & 
		VariantAlsoNegotiatesType         <MaybePromise<SvelteResponse<T>>, {}> & 
		InsufficientStorageType           <MaybePromise<SvelteResponse<T>>, {}> & 
		LoopDetectedType                  <MaybePromise<SvelteResponse<T>>, {}> & 
		NotExtendedType                   <MaybePromise<SvelteResponse<T>>, {}> & 
		NetworkAuthenticationRequiredType <MaybePromise<SvelteResponse<T>>, {}>
}

type ReturnedCallback<T extends MaybePromise<object>, S extends object>
	= <K>(callback: K & Callback<T, S>) => K extends (...any:any[]) => any ? Promise<ReturnType<K>> : unknown


// * General
export interface InformationalType<T extends MaybePromise<object>, S extends object, This extends boolean = true> {
	/** Callback for 1××-responses */
	informational: (callback: Callback<T, S>) => this
	$: { informational: ReturnedCallback<T, S> }
}
export interface SuccessType<T extends MaybePromise<object>, S extends object> {
	/** Callback for 2××-responses */
	success: (callback: Callback<T, S>) => this
	$: { success: ReturnedCallback<T, S> }
}
export interface RedirectionType<T extends MaybePromise<object>, S extends object > {
	/** Callback for 3××-responses */
	redirection: (callback: Callback<T, S>) => this
	$: { redirection: ReturnedCallback<T, S> }
}
export interface ClientErrorType<T extends MaybePromise<object>, S extends object > {
	/** Callback for 4××-responses */
	clientError: (callback: Callback<T, S>) => this
	$: { clientError: ReturnedCallback<T, S> }
}
export interface ServerErrorType<T extends MaybePromise<object>, S extends object > {
	/** Callback for 5××-responses */
	serverError: (callback: Callback<T, S>) => this
	$: { serverError: ReturnedCallback<T, S> }
}
export interface ErrorType<T extends MaybePromise<object>, S extends object > {
	/** Callback for 4××- & 5××-responses */
	error: (callback: Callback<T, S>) => this
	$: { error: ReturnedCallback<T, S> }
}

// 1××
export interface ContinueType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 100-responses */
	continue: (callback: Callback<T, S>) => this
	$: { continue: ReturnedCallback<T, S> }
}
export interface SwitchingProtocolsType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 101-responses */
	switchingProtocols: (callback: Callback<T, S>) => this
	$: { switchingProtocols: ReturnedCallback<T, S> }
}
export interface ProcessingType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 102-responses */
	processing: (callback: Callback<T, S>) => this
	$: { processing: ReturnedCallback<T, S> }
}

// 2××
export interface okType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 200-responses */
	ok: (callback: Callback<T, S>) => this
	$: { ok: ReturnedCallback<T, S> }
}
export interface CreatedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 201-responses */
	created: (callback: Callback<T, S>) => this
	$: { created: ReturnedCallback<T, S> }
}
export interface AcceptedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 202-responses */
	accepted: (callback: Callback<T, S>) => this
	$: { accepted: ReturnedCallback<T, S> }
}
export interface NonAuthoritativeInformationType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 203-responses */
	nonAuthoritativeInformation: (callback: Callback<T, S>) => this
	$: { nonAuthoritativeInformation: ReturnedCallback<T, S> }
}
export interface NoContentType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 204-responses */
	noContent: (callback: Callback<T, S>) => this
	$: { noContent: ReturnedCallback<T, S> }
}
export interface ResetContentType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 205-responses */
	resetContent: (callback: Callback<T, S>) => this
	$: { resetContent: ReturnedCallback<T, S> }
}
export interface PartialContentType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 206-responses */
	partialContent: (callback: Callback<T, S>) => this
	$: { partialContent: ReturnedCallback<T, S> }
}
export interface MultiStatusType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 207-responses */
	multiStatus: (callback: Callback<T, S>) => this
	$: { multiStatus: ReturnedCallback<T, S> }
}
export interface AlreadyReportedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 208-responses */
	alreadyReported: (callback: Callback<T, S>) => this
	$: { alreadyReported: ReturnedCallback<T, S> }
}
export interface IMUsedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 226-responses */
	IMUsed: (callback: Callback<T, S>) => this
	$: { IMUsed: ReturnedCallback<T, S> }
}

// 3××
export interface MultipleChoicesType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 300-responses */
	multipleChoices: (callback: Callback<T, S>) => this
	$: { multipleChoices: ReturnedCallback<T, S> }
}
export interface MovedPermanentlyType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 301-responses */
	movedPermanently: (callback: Callback<T, S>) => this
	$: { movedPermanently: ReturnedCallback<T, S> }
}
export interface FoundType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 302-responses */
	found: (callback: Callback<T, S>) => this
	$: { found: ReturnedCallback<T, S> }
}
export interface CheckOtherType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 303-responses */
	checkOther: (callback: Callback<T, S>) => this
	$: { checkOther: ReturnedCallback<T, S> }
}
export interface NotModifiedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 304-responses */
	notModified: (callback: Callback<T, S>) => this
	$: { notModified: ReturnedCallback<T, S> }
}
export interface UseProxyType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 305-responses */
	useProxy: (callback: Callback<T, S>) => this
	$: { useProxy: ReturnedCallback<T, S> }
}
export interface SwitchProxyType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 306-responses */
	switchProxy: (callback: Callback<T, S>) => this
	$: { switchProxy: ReturnedCallback<T, S> }
}
export interface TemporaryRedirectType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 307-responses */
	temporaryRedirect: (callback: Callback<T, S>) => this
	$: { temporaryRedirect: ReturnedCallback<T, S> }
}
export interface PermanentRedirectType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 308-responses */
	permanentRedirect: (callback: Callback<T, S>) => this
	$: { permanentRedirect: ReturnedCallback<T, S> }
}


// 4××
export interface BadRequestType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 400-responses */
	badRequest: (callback: Callback<T, S>) => this
	$: { badRequest: ReturnedCallback<T, S> }
}
export interface UnauthorizedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 401-responses */
	unauthorized: (callback: Callback<T, S>) => this
	$: { unauthorized: ReturnedCallback<T, S> }
}
export interface PaymentRequiredType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 402-responses */
	paymentRequired: (callback: Callback<T, S>) => this
	$: { paymentRequired: ReturnedCallback<T, S> }
}
export interface ForbiddenType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 403-responses */
	forbidden: (callback: Callback<T, S>) => this
	$: { forbidden: ReturnedCallback<T, S> }
}
export interface NotFoundType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 404-responses */
	notFound: (callback: Callback<T, S>) => this
	$: { notFound: ReturnedCallback<T, S> }
}
export interface MethodNotAllowedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 405-responses */
	methodNotAllowed: (callback: Callback<T, S>) => this
	$: { methodNotAllowed: ReturnedCallback<T, S> }
}
export interface NotAcceptableType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 406-responses */
	notAcceptable: (callback: Callback<T, S>) => this
	$: { notAcceptable: ReturnedCallback<T, S> }
}
export interface ProxyAuthenticationRequiredType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 407-responses */
	proxyAuthenticationRequired: (callback: Callback<T, S>) => this
	$: { proxyAuthenticationRequired: ReturnedCallback<T, S> }
}
export interface RequestTimeoutType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 408-responses */
	requestTimeout: (callback: Callback<T, S>) => this
	$: { requestTimeout: ReturnedCallback<T, S> }
}
export interface ConflictType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 409-responses */
	conflict: (callback: Callback<T, S>) => this
	$: { conflict: ReturnedCallback<T, S> }
}
export interface GoneType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 410-responses */
	gone: (callback: Callback<T, S>) => this
	$: { gone: ReturnedCallback<T, S> }
}
export interface LengthRequiredType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 411-responses */
	lengthRequired: (callback: Callback<T, S>) => this
	$: { lengthRequired: ReturnedCallback<T, S> }
}
export interface PreconditionFailedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 412-responses */
	preconditionFailed: (callback: Callback<T, S>) => this
	$: { preconditionFailed: ReturnedCallback<T, S> }
}
export interface PayloadTooLargeType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 413-responses */
	payloadTooLarge: (callback: Callback<T, S>) => this
	$: { payloadTooLarge: ReturnedCallback<T, S> }
}
export interface URITooLongType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 414-responses */
	URITooLong: (callback: Callback<T, S>) => this
	$: { URITooLong: ReturnedCallback<T, S> }
}
export interface UnsupportedMediaTypeType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 415-responses */
	unsupportedMediaType: (callback: Callback<T, S>) => this
	$: { unsupportedMediaType: ReturnedCallback<T, S> }
}
export interface RangeNotSatisfiableType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 416-responses */
	rangeNotSatisfiable: (callback: Callback<T, S>) => this
	$: { rangeNotSatisfiable: ReturnedCallback<T, S> }
}
export interface ExpectationFailedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 417-responses */
	expectationFailed: (callback: Callback<T, S>) => this
	$: { expectationFailed: ReturnedCallback<T, S> }
}
export interface ImATeapotType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 418-responses */
	imATeapot: (callback: Callback<T, S>) => this
	$: { imATeapot: ReturnedCallback<T, S> }
}
export interface MisdirectedRequestType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 421-responses */
	misdirectedRequest: (callback: Callback<T, S>) => this
	$: { misdirectedRequest: ReturnedCallback<T, S> }
}
export interface UnprocessableEntityType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 422-responses */
	unprocessableEntity: (callback: Callback<T, S>) => this
	$: { unprocessableEntity: ReturnedCallback<T, S> }
}
export interface LockedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 423-responses */
	locked: (callback: Callback<T, S>) => this
	$: { locked: ReturnedCallback<T, S> }
}
export interface FailedDependencyType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 424-responses */
	failedDependency: (callback: Callback<T, S>) => this
	$: { failedDependency: ReturnedCallback<T, S> }
}
export interface UpgradeRequiredType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 426-responses */
	upgradeRequired: (callback: Callback<T, S>) => this
	$: { upgradeRequired: ReturnedCallback<T, S> }
}
export interface PreconditionRequiredType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 428-responses */
	preconditionRequired: (callback: Callback<T, S>) => this
	$: { preconditionRequired: ReturnedCallback<T, S> }
}
export interface TooManyRequestsType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 429-responses */
	tooManyRequests: (callback: Callback<T, S>) => this
	$: { tooManyRequests: ReturnedCallback<T, S> }
}
export interface RequestHeaderFieldsTooLargeType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 431-responses */
	requestHeaderFieldsTooLarge: (callback: Callback<T, S>) => this
	$: { requestHeaderFieldsTooLarge: ReturnedCallback<T, S> }
}
export interface UnavailableForLegalReasonsType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 451-responses */
	unavailableForLegalReasons: (callback: Callback<T, S>) => this
	$: { unavailableForLegalReasons: ReturnedCallback<T, S> }
}


// 5××
export interface InternalServerErrorType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 500-responses */
	internalServerError: (callback: Callback<T, S>) => this
	$: { internalServerError: ReturnedCallback<T, S> }
}
export interface NotImplementedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 501-responses */
	notImplemented: (callback: Callback<T, S>) => this
	$: { notImplemented: ReturnedCallback<T, S> }
}
export interface BadGateawayType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 502-responses */
	badGateaway: (callback: Callback<T, S>) => this
	$: { badGateaway: ReturnedCallback<T, S> }
}
export interface ServiceUnavailableType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 503-responses */
	serviceUnavailable: (callback: Callback<T, S>) => this
	$: { serviceUnavailable: ReturnedCallback<T, S> }
}
export interface GatewayTimeoutType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 504-responses */
	gatewayTimeout: (callback: Callback<T, S>) => this
	$: { gatewayTimeout: ReturnedCallback<T, S> }
}
export interface HTTPVersionNotSupportedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 505-responses */
	HTTPVersionNotSupported: (callback: Callback<T, S>) => this
	$: { HTTPVersionNotSupported: ReturnedCallback<T, S> }
}
export interface VariantAlsoNegotiatesType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 506-responses */
	variantAlsoNegotiates: (callback: Callback<T, S>) => this
	$: { variantAlsoNegotiates: ReturnedCallback<T, S> }
}
export interface InsufficientStorageType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 507-responses */
	insufficientStorage: (callback: Callback<T, S>) => this
	$: { insufficientStorage: ReturnedCallback<T, S> }
}
export interface LoopDetectedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 508-responses */
	loopDetected: (callback: Callback<T, S>) => this
	$: { loopDetected: ReturnedCallback<T, S> }
}
export interface NotExtendedType<T extends MaybePromise<object>, S extends object > {
	/** Callback for status 510-responses */
	notExtended: (callback: Callback<T, S>) => this
	$: { notExtended: ReturnedCallback<T, S> }
}
export interface NetworkAuthenticationRequiredType<T extends MaybePromise<object>, S extends object> {
	/** Callback for status 511-responses */
	networkAuthenticationRequired: (callback: Callback<T, S>) => this
	$: { networkAuthenticationRequired: ReturnedCallback<T, S> }
}

export type FetchApi<T extends MaybePromise<Record<string, unknown>>> =
	ResponseType<T> &	

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

