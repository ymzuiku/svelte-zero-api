/// <reference path="./utility.d.ts" />
/// <reference path="./sveltekit.d.ts" />
/// <reference path="./response.d.ts" />
/// <reference path="./backend.d.ts" />
/// <reference path="./statuscodes.d.ts" />
/// <reference path="./options.d.ts" />

import type { RequestEvent } from '@sveltejs/kit'

export interface APIInputs {
	body?: any,
	query?: any
}

type JSON<Input> = { (): Promise<Input['body']> }
type SearchParams<Input, R> = {
	get: <T extends keyof Input['query']>(s: T) => string,
	getAll: <T extends keyof Input['query']>(s: T) => Array<string>,
	has: <T extends keyof Input['query']>(s: T) => boolean
} & Omit<R['url']['searchParams'], 'get' | 'getAll' | 'has'>

export type API<Input extends APIInputs = {}, R = RequestEvent>
	= Omit<R, 'request' | 'url'> & {
		request: {
			json: JSON<Input>
		} & Omit<R['request'], 'json'>
		url: {
			searchParams: SearchParams<Input, R>
		} & Omit<R['url'], 'searchParams'>
	}

export type RequestParams<Endpoint> = Pick<Parameters<Endpoint>[0], 'body' | 'query'>
export type GetResponse<Endpoint, K extends keyof ReturnType<Endpoint>> = ReturnType<Endpoint>[K]
export type ResponseBody<Endpoint, K extends Extract<keyof ReturnType<Endpoint>, keyof StatusCodeFn | keyof StatusText>> = Parameters<Parameters<GetResponse<Endpoint, K>>[0]>[0]['body']
	
type GetInputs<A> = A extends { url: { searchParams: SearchParams<infer Input, any> } } ? Input : {}

// Removes anything that doesn't use the API<any>
type PickMethods<RestAPI> = {
	[Function in keyof RestAPI]:
		Function extends 'GET' | 'POST' | 'DELETE' | 'PUT' | 'OPTIONS' | 'PATCH' ?
			RestAPI[Function] : never
}

type DefCallback = (response: DefaultResponse) => void
type Callback<Return> = Return extends (...args: any[]) => any ?
	(response: SvelteResponse<ReturnType<Return>>) => void
	:
	DefCallback

type $<M, Keys> = {
	[Return in Keys]: <K extends Callback<M[Return]>>(cb: K) => Promise<ReturnType<K> | undefined>
}
type _Keys<M> = Exclude<StatusCodeFn[keyof StatusCodeFn] | keyof StatusCodeFn, keyof M>

// Makes the API return type recursive
type RecursiveMethodReturn<M extends MethodReturnTypes<any>> = {
	[Return in keyof M]: (cb: Callback<M[Return]>) => RecursiveMethodReturn<M> & Promise<SvelteResponse>
} & {
	$: $<M, keyof M>
	_: {
		// TODO: Hacky ('prependCallbacks') but I'm tired
		[Fn in _Keys<M>]: (cb: keyof M extends 'prependCallbacks' ? DefCallback : Callback<M[Return]>) => RecursiveMethodReturn<M>['_'] & Promise<SvelteResponse>
	} & (keyof M extends 'prependCallbacks' ? {} : {
		$: $<M, _Keys<M>>
	})
}

type GetKeys<U> = U extends Record<infer K, any> ? K extends string ? K : never : never
type Inference<T, K extends string> = T extends { [P in K]: () => infer B } ? B : never
type CombineFunctions<T> = { [K in GetKeys<T>]: () => Inference<T, K> }

// Returns an intersection of all return types of the RestAPI method
// { ok: () => T } & { badRequest: () => T }
type MethodReturnTypes<M extends (...args: any[]) => (...args: any[]) => any> =
	CombineFunctions<Awaited<ReturnType<M>>>


type Returned<E, M> = RecursiveMethodReturn<MethodReturnTypes<E[M]>> & Promise<SvelteResponse>
type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>

// Converts the Rest API methods inside a .ts file into the zero api type used in the frontend
// E = { post(event: API<...>): APIResponse & APIResponse, get(event: API<...>)... }
// M = 'post' | 'get' ...
type MakeAPI<E extends Endpoint> = {
	[M in keyof E]: GetEndpointRequest<GetInputs<Parameters<E[M]>[0]>, Simplify<Returned<E, M>>>
}

type Requestinit = Omit<RequestInit, 'body'>
type GetEndpointRequest<T, R> =
	T extends { body } | { query }
	?
	(request: Simplify<T> & Requestinit, fetch?: Fetch) => R
	:
	(request?: Simplify<T> & Requestinit, fetch?: Fetch) => R

/** ZeroAPI */
export type Z<RestAPI> = MakeAPI<PickMethods<RestAPI>>