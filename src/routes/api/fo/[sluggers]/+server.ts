import type { API } from './$types'
import { Ok, BadRequest } from 'sveltekit-zero-api/http'
import { querySpread, err } from 'sveltekit-zero-api'

export function GET() {
	return Ok()
}

interface Post {
	body: {
		message: string
	},
	query: {
		boink: string
		test: number
	}
}

export async function POST(event: API<Post>) {
	const { message } = await event.request.json()
	
	const query = querySpread(event) as Post['query']
	const { boink, test } = query

	let errorResponse
	if (errorResponse = err.handler(
		err.require({ boink, test }),
		err.type(query, { boink: 'string', test: 'number' }),
		err.test(boink?.length > 2, { boink: 'Must be longer than 2 characters' }),
		err.match({ message }, /Giraffe/g, 'Must include the word "Giraffe"')
	))
		return errorResponse('BadRequest')

	let val = undefined
	if(errorResponse = err.handler(err.require({val})))
		return errorResponse('BadRequest')
		
	return Ok({
		body: {
			message: message ? 'Your message was: ' + message : 'You forgot to send a message',
			location: 'The params for this page was: ' + event.params.sluggers,
			queries: {
				boink,
				test
			}
		}
	})
}