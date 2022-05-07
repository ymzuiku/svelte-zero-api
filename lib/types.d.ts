import { ExportCallback, FetchApi } from '../fetchapi'
import type { ExtractAPI } from './types/fetch'
import type { MaybePromise } from './types/helpers'

// * Used for accessing Endpoint info such as paramters and return type
type Endpoint = (content: any) => MaybePromise<Record<any, any>>
type EndpointParams<T extends Endpoint> = Normalize<ExtractAPI<Parameters<T>[0]>>
type EndpointReturnType<T extends Endpoint> = FetchApi<ReturnType<T>>

export type Normalize<T> =
	T extends (...args: infer A) => infer R ? (...args: Normalize<A>) => Normalize<R>
	: [T] extends [any] ? { [K in keyof T]: Normalize<T[K]> } : never 

// * The FetchAPI on each endpoint method
/** @internal */
export type FetchAPICallback<T extends Endpoint> =
	EndpointParams<T> extends { body } | { query } ? 
		((request: EndpointParams<T>, fetch?: any) => EndpointReturnType<T>)
	:
		((request?: EndpointParams<T>, fetch?: any) => EndpointReturnType<T>)

// FIXME: @ts-ignore is a hack because of some bad type interaction. I'll fix it at some point🕺

// @ts-ignore
type Content<T extends FetchAPICallback<any>, S extends keyof T> = Awaited<ExportCallback<Parameters<ReturnType<T>[S]>[0]>>

type ExtractResponse<T extends Record<any, any>, K extends number> = T extends { status: K } ? T : never

// @ts-ignore
type GetStatusCode<T extends FetchAPICallback<any>> = number & Content<T, 'any'>['status']

// @ts-ignore
export type GetResponse<T extends FetchAPICallback<any>, Status extends GetStatusCode<T>> = ExtractResponse<Content<T, 'any'>, Status>

// @ts-ignore
export type ResponseBody<T extends FetchAPICallback<any>, S extends GetStatusCode<T>> = GetResponse<T, S>['body']

export type RequestParams<T extends FetchAPICallback<any>> = Parameters<T>[0]