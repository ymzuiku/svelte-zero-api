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
	))
		return errorResponse('BadRequest')
	
	if (errorResponse = err.handler(
		err.require({  message }),
		err.match({ message }, /Giraffe/g, 'Must include the word "Giraffe"')
	))
		return errorResponse('BadRequest')
		
	return Ok({
		body: {
			message: 'Your message was: ' + message,
			location: 'The params for this page was: ' + event.params.sluggers,
			queries: {
				boink,
				test
			}
		}
	})
}