import type { API } from './$types'
import { Ok } from 'sveltekit-zero-api/http'

export function GET() {
	return Ok()
}

interface Post {
	body: {
		message: string
	},
	query: {
		test: number,
		boink: string
	}
}

export async function POST(event: API<Post>) {
	const { message } = await event.request.json()
	const noQ = 'No query provided'
	let t = event.url.searchParams.get('test') || noQ
	let b = event.url.searchParams.get('boink') || noQ

	return Ok({
		body: {
			message: message ? 'Your message was: ' + message : 'You forgot to send a message',
			location: 'The params for this page was: ' + event.params.sluggers,
			queries: {
				boink: b,
				test: t
			}
		}
	})
}