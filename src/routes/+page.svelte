<script lang='ts'>
	import api, { intersect } from '../api';
	import type { RequestParams, ResponseBody } from 'sveltekit-zero-api/helpers'
	import { onMount } from 'svelte'

	const query: RequestParams<ReturnType<typeof api.fo.sluggers$>['POST']> = {
		body: {
			message: 'Giraffe'
		},
		query: {
			boink: 'y23',
			test: 23
		}
	}
	let body: ResponseBody<ReturnType<typeof api.fo.sluggers$>['POST'], 'Ok'> | undefined
	
	onMount(async () => {
		console.log('here')
		body = await api.fo.sluggers$('test').POST(query)
			.Error(res => {
				const { boink, message, test } = intersect(res.body.errors)
				console.warn('ERR', res)
			}).Success(res => {
				console.log('OK', res)
			}).$.Ok(res => res.body)
	})
	
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
