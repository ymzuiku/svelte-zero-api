# Performance Benchmarks
Performance is important. The following test is tested locally, which is bound to an online MongoDB Database at a distance of ~500 km.

> a human blink lasts between 100ms and 400ms.

TL;DR — +30ms

(highend, simulated low-end mobile)

`test1`: await sveltekitzeroapi (~33ms, ~2040ms)

`test2`: sveltekitzeroapi callback (~35ms, ~2040ms)

`test3`: a normal fetch (~5ms, ~2040ms)

```ts

<script lang="ts">
	import api from '$src/api';
	import { onMount } from 'svelte';

	// Highend
	// 1 = 34.358 ms
	// 2 = 32.628 ms
	// 3 = 33.323 ms
	// Chrome's "Low-end mobile" devtools throtting
	// 1 (×10) = 2039.6 ms
	// 2 (×10) = 2040.2 ms
	const test1 = async (times) => {
		var time = []
		for (let i = 0; i < times; i++) {
			var t = Date.now()
			var response = await api.core.user.login.put({body: {email: '123@asd.com', password: '123456'}})
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
		api.core.user.login.put({body: {email: '123@asd.com', password: '123456'}}).badRequest(r => {
			time.push(Date.now() - timeStart)
			t(i+1, max, time)
		})
	}

	// Highend
	// 1 = 35.439 ms
	// 2 = 35.084 ms
	// 3 = 34.562 ms
	// Chrome's "Low-end mobile" devtools throtting
	// 1 (×10) = 2038.9 ms
	// 2 (×10) = 2042.1 ms
	const test2 = async (times) => {
		t(0, times, [])
	}

	// High-end
	// 1 (×1000) = 5.311 ms
	// 2 (×1000) = 5.227 ms
	// 3 (×1000) = 4.983 ms
	// Chrome's "Low-end mobile" devtools throtting
	// 1 (×10) = 2044.9 ms
	// 2 (×10) = 2038.7 ms
	const test3 = async (times) => {
		var time = []
		for (let i = 0; i < times; i++) {
			var t = Date.now()
			var response = await fetch(`http://localhost:3000/api/core/user/login`, {
				method: 'PUT',
				body: JSON.stringify({ email: '123@asd.com', password: '123456' })
			})
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