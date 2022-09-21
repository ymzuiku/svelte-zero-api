import type { API } from 'sveltekit-zero-api'
import { Ok } from 'sveltekit-zero-api/http'

export async function GET(event: API) {
	return Ok()
}