import type { API } from '$sveltekit-zero-api'
import { Ok } from '$sveltekit-zero-api/http'

export async function GET(event: API) {
	return Ok()
}

interface Bar {}

export async function POST(event: API) {
	const bar: Bar = {}
	return Ok({
		body: bar
	})
}