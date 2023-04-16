import api from '$browser/api'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ parent, fetch }) => {

	const response = await api.fo.POST({}, fetch).Ok(res => {
		
	})

	return {
		user: response.body
	}
}