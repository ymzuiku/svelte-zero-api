import { createZeroApi } from '$dist/api'
import type { GeneratedAPI } from './sveltekit-zero-api'
export { intersect } from '$dist/helpers'

const routes = createZeroApi({
	onError: async (err) => console.error('[API]', err)
}) as GeneratedAPI

export default routes.api