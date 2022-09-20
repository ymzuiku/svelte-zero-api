export default 
`import { createZeroApi } from 'sveltekit-zero-api'
import type { GeneratedAPI } from './sveltekit-zero-api'

const routes = createZeroApi({
	onError: async (err) => console.error('[API]', err)
}) as GeneratedAPI

export default routes.api`
