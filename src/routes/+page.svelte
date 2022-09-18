<script>
	import api from '../api';
	import { onMount } from 'svelte'

	onMount(() => {
		console.log('here')
		api.fo.sluggers$('test').POST({
			body: { message: 'Some message' },
			query: {
				boink: 'yes',
				test: 1
			}
		}).ok(res => {
			console.log(res)
		})
	})
	
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
