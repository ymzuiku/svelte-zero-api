import type { API } from '$dist'

interface Get {
	query: {
		foo: string
	}
}

interface Post {
	body: {
		foo: string
	}
}

const endpoint = {
	GET: (event: API<Get>) => ({ test: 'test' }),
	POST: <const Request extends Post>(event: API<Request>) => ({ requestBody: { } as Request['body'] })
}

type InferAPI<T extends API> = T extends API<infer Input> ? Input : {}

type GeneratedAPI = {
	users: {
		POST: <const T extends InferAPI<Parameters<typeof endpoint.POST>[0]>>(request: T) => typeof endpoint.POST<T>
	}
}

const api = {} as GeneratedAPI

const test = api.users.POST({ body: { foo: 'yas' } })
	// ^?