import type { RequestEvent } from './helpers'

type InferQuery<X> = X extends { query?} ? Pick<X, 'query'> : {}
type InferBody<X> = X extends { body?} ? Pick<X, 'body'> : {}
/** @internal */
export type ExtractAPI<T> = T extends API<infer X> ? InferQuery<X> & InferBody<X> : {}

/** const get = (requestEvent: API<*>) => */
export interface API<T extends Record<any, any>> extends RequestEvent {
	request: {
		json: () => Promise<T['body']>
	} & Omit<RequestEvent['request'], 'json'>,
	url: Omit<RequestEvent['url'], 'searchParams'> & { searchParams: QueryGetter<T> }
}

type QueryGetter<T extends { query? }> = { get?: <K extends keyof T["query"]>(key: K) => string } & URLSearchParams

type InferQueryGetter<T> = T extends QueryGetter<infer X> ? X : never