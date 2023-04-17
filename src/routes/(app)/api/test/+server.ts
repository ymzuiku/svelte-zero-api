import type { API } from '$dist'
import { Ok } from '$dist/http'

export function GET(requestEvent: API<any>) {
	requestEvent.request.json()
	return Ok()
}

export function POST(event: API<any>) {
	return Ok({
		body: {
			message: 'Hello World!'
		}
	})
} 