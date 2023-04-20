import { querySpread, type API } from '$dist'
import { Ok } from '$dist/http'

interface Get {
	query: {
		foo: string,
		bar: string
	}
}

export async function GET<const R extends Get>(event: API<R>) {
	const query = querySpread(event)
	
	return Ok({
		body: query as unknown as R['query']
	})
}

interface Bar {}

export async function POST(event: API) {
	const bar: Bar = {}
	return Ok({
		body: bar
	})
}

interface Put {
	body: {
		foo: string
		bar: number
	}
}

export async function PUT<const R extends Put>(event: API<R>) {
	return Ok({
		body: await event.request.json() as unknown as R['body']
	})
}