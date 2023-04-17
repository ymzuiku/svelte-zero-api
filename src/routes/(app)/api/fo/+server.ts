import type { API } from '$dist'
import { Ok } from '$dist/http'

interface Get<Q> {
	query: Q
}

export async function GET<const R extends { query?: any, body?: any }>(event: API<Get<R['query']>>) {
	return Ok({
		body: {} as unknown as R
	})
}

interface Bar {}

export async function POST(event: API) {
	const bar: Bar = {}
	return Ok({
		body: bar
	})
}