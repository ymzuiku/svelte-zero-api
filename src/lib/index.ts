import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit'
import type { API } from './types/zeroapi.js'

export type {
	/** @deprecated Use KitEvent instead */
	API,
	APIInputs,
	API as KitEvent
} from './types/zeroapi.js'
export { querySpread } from './querySpread.js'
export { default as zeroAPI } from './vitePlugin.js'
export { err } from './error-handling.js'
export { endpointPipe } from './pipe'

export type KitResponse = APIResponse<any>
export type AnyAPI = API<any> | RequestEvent | ServerLoadEvent