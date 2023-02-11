import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit'
import type { API } from './types/zeroapi.js'

export type { API, APIInputs } from './types/zeroapi.js'
export { querySpread } from './querySpread.js'
export { default as zeroAPI } from './vitePlugin.js'
export { err } from './error-handling.js'

export type AnyAPI = API<any> | RequestEvent | ServerLoadEvent