<script lang="ts">
	import { api } from './api/zero-api';

	const data = api.ping.post({ body: { pong: 'pong!!!' } });
</script>

<h1>Welcome to SvelteKit Zero API</h1>

{#await data then res}
	<h2>fetch: {res.body.thePong}</h2>
{/await}
