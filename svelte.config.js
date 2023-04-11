import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

const exports = [
	'index.ts',
	'__temp.ts',
	'http.ts',
	'api/index.ts',
	'watch/index.ts',
	'types/zeroapi.d.ts',
	'queryspread.ts',
	'helpers.ts'
]

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'sveltekit-zero-api': './package'
		}
	}
}

export default config