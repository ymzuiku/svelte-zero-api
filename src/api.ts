import { createZeroApi } from 'sveltekit-zero-api/api'
import type { GeneratedAPI } from './sveltekit-zero-api'
export { intersect } from 'sveltekit-zero-api/helpers'

const routes = createZeroApi({
	onError: async (err) => console.error('[API]', err),
	prependCallbacks: prepend => prepend.InternalServerError(res => console.warn('ERR', res)),
}) as GeneratedAPI

export default routes.api