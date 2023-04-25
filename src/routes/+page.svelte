<script lang='ts'>
	import api from '$browser/api';
	import type { RequestParams, ResponseBody } from '$dist/helpers'
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
	
	const getMessage = () => api.fo.sluggers$('test').POST(query)
		.Error(res => {
			console.warn('ERR', res)
		}).Success(res => {
			console.log('OK', res)
		}).$.Ok(res => res.body)

	api.pipe.POST({ body: { foo: 'yas' } }).Any(res => {
		console.log('pipe', res)
		
		if(res.status === 400 && res.body) {
			if('message' in res.body) {
				res.body.message
						// ^?
			}
		}

	}).BadRequest(res => {
		if(res.body && 'message' in res.body) {
			res.body
		}
	})

	onMount(async () => {
		api.fo.sluggers$('boink').GET().Ok(res => console.log(res))

		const res = await api.fo.GET({ 
			query: {
				foo: 'Pizza is great',
				bar: 'Yas!'
			}
		})
		.Ok(res => {
			console.log(res.body)
		})
		
	})

	

</script>

{#await getMessage()}
	Retrieving...
	{:then body}
	{#if body}
		{body.message} @{body.location} 
	{/if}
{/await}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
