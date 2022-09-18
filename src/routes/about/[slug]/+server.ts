import { error } from '@sveltejs/kit'

type Load = import('./$types').PageLoad
export const load: Load = ({ params }) => {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		}
	}

	throw error(404, 'Not found')
}