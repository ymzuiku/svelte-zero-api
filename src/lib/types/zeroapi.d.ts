/// <reference path="./utility.d.ts" />
/// <reference path="./sveltekit.d.ts" />
/// <reference path="./response.d.ts" />
/// <reference path="./backend.d.ts" />
/// <reference path="./statuscodes.d.ts" />
/// <reference path="./options.d.ts" />

export interface APIInputs {
	body?: any,
	query?: any
}

type JSON<Body> = { (): Promise<Body> }
type SearchParams<Query, R> = {
	get: <T extends keyof Query>(s: T) => string,
	getAll: <T extends keyof Query>(s: T) => Array<string>,
	has: <T extends keyof Query>(s: T) => boolean
} & Omit<R['url']['searchParams'], 'get' | 'getAll' | 'has'>

/*
	The complication: 
	The generated $types creates a custom API with the generated RequestEvent.
	Inferring it (as far as I know) is not possible — so the types
	JSON and SearchParams are made to be inferred inside `Inputs<A>`
*/
export type API<Input extends APIInputs = {}, R = RequestEvent<Record<string, string>, true>>
	= Omit<R, 'request' | 'url'> & {
		request: {
			json: JSON<Input['body']>
		} & Omit<R['request'], 'json'>
		url: {
			searchParams: SearchParams<Input['query'], R>
		} & Omit<R['url'], 'searchParams'>
	}


// * Testing
// type SomeAPI<T> = API<T>
// interface Post {
// 	body: {
// 		test: string
// 	}
// 	query: {
// 		a: number
// 	}
// }
// type post = SomeAPI<Post>
// type Test = Inputs<post>


type GetQuery<A> = A extends { url: { searchParams: SearchParams<infer Query, any> } } ? Query extends Record<any, any> ? { query: Query } : {} : {}
type GetBody<A> = A extends { request: { json: JSON<infer Body> } } ? Body extends Record<any, any> | string | number | boolean | Array<any> ? { body: Body } : {} : {}
type GetInputs<A> = Simplify<GetBody<A> & GetQuery<A>>

// Gets the query/body requirements specified inside API<>
type Inputs<A> = GetInputs<A> extends { query: any } | { body: any } ? GetInputs<A> : undefined



// Removes anything that doesn't use the API<any>
type PickMethods<RestAPI> = {
	[Function in keyof RestAPI]:
		Function extends 'GET' | 'POST' | 'DELETE' | 'PUT' | 'OPTIONS' | 'PATCH' ?
			RestAPI[Function] : never
}

type Callback<Return extends any> = Return extends (...args: any[]) => any ? (response: SvelteResponse<ReturnType<Return>>) => void : never


// Makes the API return type recursive
type RecursiveMethodReturn<M extends MethodReturnTypes<any>> = {
	[Return in keyof M]: (cb: Callback<M[Return]>) => Exclude<RecursiveMethodReturn<M> & Promise<SvelteResponse>, 'Symbol'>
} & {
	$: {
		[Return in keyof M]: <K extends Callback<M[Return]>>(cb: K) => Promise<ReturnType<K>>
	} & {
		_: {
			[Fn in Exclude<StatusCodeFn[keyof StatusCodeFn], keyof M>]: <K extends Callback<M[Return]>>(cb: K) => Promise<ReturnType<K>>
		}
	},
	_: {
		[Fn in Exclude<StatusCodeFn[keyof StatusCodeFn], keyof M>]: RecursiveMethodReturn<M> & Promise<SvelteResponse>
	}
}

// Returns an intersection of all return types of the RestAPI method
// { ok: () => T } & { badRequest: () => T }
type MethodReturnTypes<M extends (...args: any[]) => (...args: any[]) => any> = UnionToIntersection<Awaited<ReturnType<M>>>


type Returned<E, M> = RecursiveMethodReturn<MethodReturnTypes<E[M]>> & Promise<SvelteResponse>
type EndpointRequestParams<E, M> = Inputs<Parameters<E[M]>[0]>

type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

// Converts the Rest API methods inside a .ts file into the zero api type used in the frontend
// E = { post(event: API<...>): APIResponse & APIResponse, get(event: API<...>)... }
// M = 'post' | 'get' ...
type MakeAPI<E extends Endpoint> = {
	[M in keyof E]: (request: EndpointRequestParams<E, M> & Omit<RequestInit, 'body'>, fetch?: Fetch) => Simplify<Returned<E, M>>
}

/** ZeroAPI */
export type Z<RestAPI> = MakeAPI<PickMethods<RestAPI>>