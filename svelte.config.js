import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

// -- Removed when packaging
import { watch } from 'sveltekit-zero-api/watch'
if (process.env.NODE_ENV !== 'production')
   watch()
// --

const exports = [
	'index.ts',
	'__temp.ts',
	'http.ts',
	'api/index.ts',
	'watch/index.ts',
	'types/zeroapi.d.ts'
]

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),
	package: {
		exports: file => exports.includes(file),
		dir: './package'
	},
	kit: {
		adapter: adapter()
	}
}

export default config
