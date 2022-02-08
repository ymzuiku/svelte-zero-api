# SvelteKit Zero API
This project is a fork of [svelte-zero-api](https://github.com/ymzuiku/svelte-zero-api) by [ymzuiku](https://github.com/ymzuiku).
It has two goals
1. Two-way communication between front-end and back-end
2. Self-documenting API that can be exported that includes examples based on in-line comments

This means less coding for you, less potential errors to worry about — and an always up-to-date API Documentation.

Here's a video on [How to get started](https://youtu.be/bgNKaxIYuQ0) with SvelteKit Zero API

[![Before and After](https://i.imgur.com/QWtxpyb.png)](https://youtu.be/u1sfchnI0Mo)

**Todo**
- Export API documentation
  - Typescript types are not "exportable" — I'm thinking of line comments as the most plausible solution.

### **Requirements**
- TypeScript in your SvelteKit project

## Install
Add to project → `npm i sveltekit-zero-api -D`

Add to `svelte.config.js`
```js
import watchSvelteKitAPI from 'sveltekit-zero-api/watch'

if (process.env.NODE_ENV !== 'production') {
    watchSvelteKitAPI();
}
```

### Updating

Currently, you have to delete node_modules and restart VSCode — then install using `npm i sveltekit-zero-api -D` again.
> This is due to my suspicion, that there's no way to 'stop/close' chokidor which watches the files, when `svelte-kit dev` is exited.

**How does it work?**
> It watches for changes in src/routes, and will write a __temp file that exports the types.

### **Pre-usage**
You'll be accessing `/src/api.ts` on the frontend. It's a **really** good idea to add it to Vite-alias and TS-path:

→ `svelte.config.js`
```js
import path from 'path'
...
/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        /** @type {import('vite').UserConfig} */
        vite: {
            resolve: {
                alias: {
                    $src: path.resolve('src')
                }
            }
        }
    }
}
```

→ `tsconfig.json`
```ts
{
    "compilerOptions": {
        "paths": {
            "$src/*": ["src/*"],
            "$src": ["src"],
        }
    }
}
```

## Usage

```ts
// routes/api/user/[id]/message

// Import generic interface
import type { API } from 'sveltekit-zero-api'
// Import any HTTP response-codes
import { Ok, Created, BadRequest, NotFound } from 'svelteit-zero-api/http'

interface Post {
	body: {
		some: string,
		another: number[],
		brain: {
			empty: boolean
		}
	}
}

export async const post({ url, request }: API<Post>) => {
	// Deconstruct json request-body
	const { some, another, brain } = request.json()
	...
	if(doesntWork)
		return BadRequest()
	if(notfound)
		return NotFound()
	if(alreadyExists)
		return Ok()
	return Created()
}


/*
 * Front-end
**/
<script lang="ts">
	import { onMount } from 'svelte'
	import api from '$src/api'
	
	onMount(() => {
		// #1 - One way to do it
		api.user.$id('@Refzlund').message.post({ body: { some: 'one', another: [1,2,3], brain: { empty: true } } })
			.success(response => console.log(response)) // Any 2⨯⨯-code
			.ok(r => console.log('Message already exists')) // Only 200-code
			.created(r => console.log('Your message has been created')) // Only 201-code
			.clientError(response => console.warn(response)) // Any 4⨯⨯-code
			.serverError(response => console.error(response)) // Any 5⨯⨯-code
			
		// #2 - Another way to do it       * Useful for {#await}-blocks
		let messagePromise = api.user.$id('@Refzlund').message.post({ body: { some: 'one', another: [1,2,3], brain: { empty: true } } })
		let response = await messagePromise // Is a response just like you'd expect
	})
</script>

```


### Use inside SvelteKit load function

SvelteKit has a module load function, which you can read more about at [SvelteKit Documentation](https://kit.svelte.dev/docs#loading).

Here, you are given a SvelteKit specific 'fetch' method. Simply pass this as a second argument, when making api calls. Other than that, it is just like normal.

```ts
<script context="module">
	import api from '$src/api'
	export async function load({ url, params, fetch, session, stuff }) {	
		// Example 1
		let response = await api.users.allUsers.get({}, fetch)

		// Example 2
		api.statistics.post({ body: { path: url.path } }, fetch)
```

### Slugs

At some point you'll want to pass slugs.

```ts
// we're accessing routes/api/users/confirmemail/[token].ts
export async function load({ url, params, fetch, session, stuff }) {
	const token = params.token
	
	// You can either do this (no typesafety):	
	const response = await api.users.confirmemail[token].post({}, fetch)

	// Or this (with typesafety):
	const response = await api.users.confirmemail.token$(token).post({}, fetch)

	// If you have multiple slugs like  routes/api/users/confirmemail/[token].[userid].ts  you have to do
	const response = await api.users.confirmemail[`${token}.${id}`].post({}, fetch)
	
	// ${}  are template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
```

### Queries

Using queries (aka url.searchParams) are simple!

`Backend`
```ts
import type { API } from 'sveltekit-zero-api'
import { Created } from 'svelteit-zero-api/http'

interface Query {
	query: {
		name: string,
		age: number
	},
	body: {
		letter: string
	}
}

export const post({ request, url }: API<Query>) => {
	const name = url.searchParams.get('name')
	const age = url.searchParams.get('age')
	const { letter } = request.json()
	...
	return Created({ body: { message: 'Your letter has been sent!', letter } })
}
```

`Frontend`
```ts
<script lang="ts">
	let apiSendLetter
	onMount(() => {
		apiSendLetter = await api.user.letter.post({ 
			query: { name: 'George', age: 52 }, 
			body: { letter: 'HOI' } 
		})
	})
</script>

{#await apiSendLetter then response}
	<div class="message">{response.body.message}</div>
{/await}
```

# Q&A

- Cannot read property '*' of undefined
> Happens if you run the API on [SSR](https://kit.svelte.dev/docs#ssr-and-javascript). Use onMount, or any other client-side called functions (on:click etc.). Read more about component life-cycle: https://svelte.dev/tutorial/onmount

# Other

Concerned about performance? See [performance benchmarks](./PerformanceBenchmarks.md). There's no real noticable impact overall, but I wanted to include this anyways.
