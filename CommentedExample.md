## Usage
Backend → `src/routes/api/core/user/login.ts`
```ts
// We import response templates { Ok, Created, BadRequest, Found, NotFound } etc.
// Tip:
// While writing the code, Intellisense picks up
// `return Ok({` — and can then auto import OK, 
// BadRequest, and all other HTTP StatusCodes
import { Ok, BadRequest, InternalError } from 'sveltekit-zero-api/http'

// Import of mongoose model
import User from '$models/user'

// An interface for request contents. 
// If contents are unknown, make them nullable:
// 	 body?: object,
// 	 headers?: object
// If contents are not required:
//  body?: { 
//		/** "This is an example message" // This is a comment to the example */
//		message?: string 
//  }
interface Put {
	body: {
		/** "some@email.com" */
		email: string,
		/** "goodP#ssword123" */
		password: string
	}
}

export const put = async ({ body }: Put) => {
	const { email, password } = body
	const response = User.login({ email, password })

	// `reponse` is invalid — ­invalid credentials
	if(!response)
		// Error and target comes with ClientError responses (4××):
		// Error: string
		// {error: string} = frontend => response.body.error
		// Target: HTML Element
		// {target: string} = frontend => response.body.target
		// Typically used at front-end to let the user know why the request has failed.
		return BadRequest({ error: 'Invalid e-mail or password', target: 'email' })

	// Get JWT and RefreshToken
	const { jwtToken, username, refreshToken } = response

	// We presumably have the token
	if(jwtToken) {
		return Ok({
			// We set the cookies in the header
			headers: {
				'set-cookie': [
					`LIE=${jwtToken}; Path=/; HttpOnly;`,
				],
			},
			// We return a refreshtoken and username in the body, with example strings
			body: {
				/** "NmEyNmMxYTUtNzQyMi00OWRlLWI1MWItZTUzZjRjMTE1NTJk" // Can be sent using api/core/user/refreshtoken */
				refreshToken: refreshToken as string, // We explicitly set this as string, because refreshToken: an
				/** "ExampleUsername69" */
				username // username is implicitly a string 
			}
		});
	}

	// We didn't get jwtToken → something went wrong in the system.
	return InternalError({ error: 'JWT Token could not be retrieved' })
}
```
Frontend → `src/routes/login.svelte`
```ts
<script lang="ts">
	import { TextInput } from '$components/inputs'
	import { refreshtoken, user } from '$components/stores/user'
	
	let emailElement
	let passwordElement

	const email = ''
	const password = ''
	
	const login = () => {

		api.core.user.login.put({body: {email, password }})
			.OK(response => { //👍 Works since we return Ok in put

				// The intellisense highlight "refreshToken" and "username" from body
				$refreshtoken = response.body.refreshToken 
				$user.username = response.body.username // setting the active user, by

				console.log(response.statusText) // Normal SvelteKit response variables are still available like in a normal fetch

			}) 
			.created(response => { //👎 status: 201 Will tell you 'created' does not exist because we didn't return it

			})
			.clientError(response => { //👍 status: 4×× ­— Works because we return a 4×× status-code (BadRequest)
			
				// We invalidate the Input-fields with the error message
				emailElement.invalidate({response.body.error})
				passwordElement.invalidate({response.body.error})

			})
			.badRequest(response => { //👍 status: 400
				// We only return BadRequest as a 4××, so no need to use this function
			})
			.internalError(response => { //👍 status: 500
				console.error('Something has happened with the servers. Oh-oh.')
			})
			.informational(response => { //👎 We do not return a 1×× code

			})

	}

</script>

<TextInput bind:value={email} this:bind={emailElement}>
<TextInput bind:value={password} this:bind={passwordElement}>
```
