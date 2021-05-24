# svelte-zero-api

Easy change [Svelte Kit](https://kit.svelte.dev/) APIs to `Zero API`.

Use [Svelte Kit](https://kit.svelte.dev/) APIs like call function, support Typescript.

> Only 1kb size before gzip in font-ent client

![](./zero-api.png)

## Install

```bash
npm install svelte-zero-api
```

## Getting started

1 - Edit `svelte.config.js`, add this codes:

> olny add code-start to code-end

```js
import preprocess from "svelte-preprocess";

// --------------------- code-start
// 1. import
import zeroApiWatch from "svelte-zero-api/watch";

// 2. add watch by change watchPath files, auto create api files:
zeroApiWatch({
  watchPath: "./src/routes/api",
  baseUrl: "/api",
  // exportName: 'api',
  // dirName: 'zero-api',
});
// --------------------- code-end

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
  },
};

export default config;
```

2 - Use all api function in front-end pages, example:

at `src/routes/index.svelte`

```ts
<script lang="ts">
  import { api } from "./api/zero-api";

  import Button from "../lib/Button.svelte";

  // We can use api before onMount, because api function only run in browser.
  // like front end function, and have Typescrit point out.
  let helloGet = api.hello.get({ query: { name: "Cat" } });
  let helloPost = api.hello.post({ body: { name: "Dog" } });
</script>

{#await helloFetch}
	<div>loading...</div>
{:then res}
	<div>{res.body.world}</div>
{/await}

```

## How definition get.query in typescript?

```ts
import type { QueryGet } from "svelte-zero-api";

interface Get {
  query: {
    name: string;
  };
}

// use `Get & QueryGet<Get>` definition types add query.get(K keyof query);
export const get = async ({ query }: Get & QueryGet<Get>) => {
  return { body: { world: "I'm a " + query.get("name") } };
};
```

## Other

- [A simple Example](./example/README.md)
- [How about dont't use style-zero-api/watch?](./README-not-watch.md)

---

That's all, Thanks read my broken English.
