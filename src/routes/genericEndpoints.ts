import type { API } from '$dist'
import { Ok } from '$dist/http'
import type { EP, Fetch, Z, R } from '$dist/z'

interface Get {
	query: {
		foo: string
	}
}

interface Post {
	body?: {
		foo: string
	}
}

const endpoint = {
	GET: (event: API<Get>) => ({ test: 'test' }),
	POST: <const Request extends Post>(event: API<Request>) => {
		return Ok({
			body: {} as unknown as Request['body']
		})
	}
}

type GeneratedAPI = {
	users: {
		POST: EP<typeof endpoint.POST> extends { body: any } | { query: any }
			? <const T extends EP<typeof endpoint.POST>>(request: T, fetch?: Fetch) => R<typeof endpoint.POST<T>>
			: <const T extends EP<typeof endpoint.POST>>(request?: T, fetch?: Fetch) => R<typeof endpoint.POST<T>>
	} & Z<Omit<typeof endpoint, 'POST' | 'PUT'>>
}

const api = {} as GeneratedAPI

const test = api.users.POST({ body: { foo: 'yas' } })
	.Ok(res => {
		res.body.foo
				// ^? (property) foo: "yas"
	})

