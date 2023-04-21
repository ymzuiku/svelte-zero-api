import api from '$browser/api'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, fetch }) => {

	const response = await api.fo.POST({
		headers: {
			'content-type': 'application/json'
		}
	}, fetch).Ok(res => {
		console.log('POST from within the server')
	})

	return {
		user: response.body
	}
}