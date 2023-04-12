import type { API } from '$sveltekit-zero-api'
import type { RequestEvent } from './$types'

import { Ok, BadRequest } from '$sveltekit-zero-api/http'
import { querySpread, err } from '$sveltekit-zero-api'

interface Optional {
	query?: {
		test?: string
	}
}

export function GET(event: API<Optional, RequestEvent>) {
	
	return Ok()
}

interface Post {
	body: {
		message: string
	},
	query?: {
		boink: string
		test: number
	}
}

export async function POST(event: API<Post>) {
	const { message } = await event.request.json()
	
	const query = querySpread(event)
	const { boink, test } = query

	await new Promise(r => setTimeout(r, 2000))

	let errorResponse 
	if (errorResponse = err.handler(
		err.require({ boink, test, message }),
		err.type(query, { boink: 'string', test: 'number' }),
		err.test(boink?.length > 2, { boink: 'Must be longer than 2 characters' }),
		err.match({ message }, /Giraffe/g, 'Must include the word "Giraffe"')
	))
		return errorResponse('BadRequest')
	
	if (errorResponse = err.handler(
		err.require({  message }),
		
	))
		return errorResponse('BadRequest', {})
	
	return Ok({
		body: {
			message: 'Your message was: ' + message, 
			location: event.params.sluggers,
			queries: {
				boink,
				test
			}
		}
	})
}