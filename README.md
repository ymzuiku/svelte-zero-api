# SvelteKit Zero API
Provides type-safety between front- and backend, but more importantly — creates a structure for ease of APIs in your project.

- Body and query is typed seemlessly in both frontend, and endpoints
- Queries are easier to use with querySpread which supports objects as query parameters
- Endpoint routes are automatically typed
- The returned content of endpoints are typed
- Supports slugged routes*
- Can be used in the page `Load` function
- You can type-define variables with endpoint responses

Inspired by [svelte-zero-api](https://github.com/ymzuiku/svelte-zero-api) by [ymzuiku](https://github.com/ymzuiku).

![Assigning variables directly](./assign-var.gif)
![Intellisense with API calls](./frontend-intellisense.gif)

---------

Installation, usage and utility types can all be fond on the GitHub Wiki:

### [Installation/Getting started](https://github.com/Refzlund/sveltekit-zero-api/wiki/Get-Started)
### [Backend - Setting up endpoints](https://github.com/Refzlund/sveltekit-zero-api/wiki/Backend)
### [Frontend - Using the API](https://github.com/Refzlund/sveltekit-zero-api/wiki/Frontend)

<sup>Let me know if you prefer to have the wiki content on the frontpage instead.</sup>

<br><br><br><br><br><br>

### Q&A
- The `api` type does not always update after changes
  - This is an issue with typescript. Just make a quick change (save) in a backend api and revert it again (save). 
- Cannot read property '*' of undefined
  - Happens if you run the API on [SSR](https://kit.svelte.dev/docs#ssr-and-javascript). Use onMount, or any other client-side called functions (on:click etc.). Read more about component life-cycle: https://svelte.dev/tutorial/onmount