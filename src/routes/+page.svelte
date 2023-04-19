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

	onMount(async () => {
		api.fo.sluggers$('boink').GET().Ok(res => console.log(res))

		const res = await api.fo.GET({ 
			query: {
				test: 123,
				str: 'abc'
			}
		})
		.Ok(res => {
			
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
