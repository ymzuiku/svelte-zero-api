<script lang='ts'>
	import api from '../api';
	import { onMount } from 'svelte'

	onMount(() => {
		console.log('here')
		api.fo.sluggers$('test').POST({
			body: {
				message: 'Giraffe'
			},
			query: {
				boink: 'y23',
				test: 23
			}
		}).Ok(res => {
			console.log(res)
		}).BadRequest(res => {
			console.log(res.body)
		})
	})
	
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
