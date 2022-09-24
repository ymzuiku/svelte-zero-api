import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit'
import type { API } from './types/zeroapi.js'

export type { API, APIInputs } from './types/zeroapi.js'
export { querySpread } from './querySpread.js'
export { watch as watchAPI } from './watch/index.js'
export { err } from './error-handling.js'

export type AnyAPI = API<any> | RequestEvent | ServerLoadEvent