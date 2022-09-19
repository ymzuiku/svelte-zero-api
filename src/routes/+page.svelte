<script lang='ts'>
	import api, { intersect } from '../api';
	import { onMount } from 'svelte'

	onMount(async () => {
		console.log('here')
		let res = api.fo.sluggers$('test').POST({
			body: {
				message: 'Giraffe'
			},
			query: {
				boink: 'y23',
				test: 23
			}
		}).BadRequest(res => {
			const { boink } = intersect(res.body.errors)
		}).Ok(res => {

		})
	})
	
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
