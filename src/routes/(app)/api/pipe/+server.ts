import { endpointPipe, type KitEvent } from '$dist'
import { Ok, Unauthorized, BadRequest } from '$dist/http'

interface Post {
	body: {
		foo: string
	}
}

export async function POST<const R extends Post>(event: KitEvent<Post>) {
	
	return endpointPipe(event, () => BadRequest({ body: { message: 'End of the pipe :(', deep: { deeper: true } } }))(
		authGuard('admin'),
		parseJSON<Post>,
		({ locals }) => {
			const { foo } = locals.json
			console.log(foo)
			return Ok()
		},
		() => {
			console.log('We didn\'t get here')
		},
		undefinedResponse
	)
}




function undefinedResponse() {
	return BadRequest()
}

//
// * Somewhere else *
// e.g. /endpoint-services
//

// parse-json.ts
async function parseJSON<const T extends { body: any }>(
	event: KitEvent<T>,
	locals: { json: T['body'] }
) {
	try {
		locals.json = await event.request.json()
	} catch (error) {
		return BadRequest({
			body: {
				message: 'Bad JSON in body'
			}
		})
	}
}

// authguard.ts
type AuthLevel =
	| 'user'
	| 'admin'

type AuthGuarded<L> = { locals: { auth: L } }

function authGuard<const L extends AuthLevel>(level: L) {
	return (
		event: KitEvent,
		locals: { auth: L }
	) => {
		const authorized = true
		if (!authorized)
			return Unauthorized()
	}
}