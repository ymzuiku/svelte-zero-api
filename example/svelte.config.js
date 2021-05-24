import preprocess from 'svelte-preprocess';

// 1. import
import zeroApiWatch from 'svelte-zero-api/watch';

// 2. add watch by change watchPath files, auto create api files:
zeroApiWatch({
	watchPath: './src/routes/api'
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
