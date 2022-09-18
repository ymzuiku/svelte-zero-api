# Performance Benchmarks
TL;DR — 0.0003 seconds performance loss. If it matters🤔

> *note that SvelteKit-zero-api handles `body.json()` automatically

`src/routes/api/test`
```ts
import { Ok } from 'sveltekit-zero-api/http'

interface Put {
	body: {
		hello: string
	}
}

export let put = ({body}: Put) => {
	return Ok({ 
		body: {
			iam: body.hello
		} 
	})
}
```

`front-end`
```ts
<script lang="ts">
	import api from '$src/api';
	import { onMount } from 'svelte';

	// test1(1000):
	// 1 = 4.693 ms average
	// 2 = 4.629 ms average
	// 3 = 4.528 ms average
	const test1 = async (times) => {
		var time = []
		for (let i = 0; i < times; i++) {
			var t = Date.now()
			var response = await api.test.put({body: {hello: 'world'}})
			time.push(Date.now() - t)
		}
		var avg = 0
		time.forEach(x => avg += x)
		avg = avg / times
		console.log(avg);
	}

	const t = (i, max, time) => {
		if(i >= max) {
			var avg = 0
			time.forEach(x => avg += x)
			avg = avg / max
			console.log(avg);
			return
		}

		var timeStart = Date.now()
		api.test.put({body: {hello: 'world'}}).success(r => {
			time.push(Date.now() - timeStart)
			t(i+1, max, time)
		})
	}

	// test2(1000)
	// 1 = 4.841 ms average
	// 2 = 4.956 ms
	// 3 = 4.880 ms average
	const test2 = async (times) => {
		t(0, times, [])
	}

	// 4.376 ms average
	// 4.314 ms average
	// 4.338 ms average
	const test3 = async (times) => {
		var time = []
		for (let i = 0; i < times; i++) {
			var t = Date.now()
			var response = await fetch(`http://localhost:3000/api/test`, {
				method: 'PUT',
				body: JSON.stringify({ hello: 'world' })
			})
			await response.json()
			time.push(Date.now() - t)
		}
		var avg = 0
		time.forEach(x => avg += x)
		avg = avg / times
		console.log(avg);
	}

	onMount(async () => {
		
		// test2(10)

	})
</script>
```