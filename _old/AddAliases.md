## Adding Alias to SvelteKit

Aliases help reduce import statements lengths, and otherwise make it easier to access places that are often used. I personally have my `api.ts` located in `/src/options`. 

*Alias* `/src/options` → `$options`

The default location for `api.ts` is `/src`, so that will be shown here -


In our config at `svelte.config.js` we add an alias to src:

```ts
import path from 'path'

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

And we add the same logical alias to our `tsconfig.json`:
```ts
{
	"compilerOptions": {
		"paths": {
			"$src/*": ["src/*"],
			"$src": ["src"]
		}
	}	
}
```

