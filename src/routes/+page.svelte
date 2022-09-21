<script lang='ts'>
	import api, { intersect } from '../api';
	import type { RequestParams, ResponseBody } from 'sveltekit-zero-api/helpers'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

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
	
	const getMessage = () => browser && api.fo.sluggers$('test').POST(query)
		.Error(res => {
			console.warn('ERR', res)
		}).Success(res => {
			console.log('OK', res)
		}).$.Ok(res => res.body)

	onMount(() => {
		api.fo.sluggers$('boink').GET().Ok(res => console.log(res))

		api.fo.GET().Ok(res => {
			
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
