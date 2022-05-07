export type { ResponseBody, RequestParams } from './types'
export type { API } from './types/fetch'
export { querySpread } from './utility'

import type { ZeroAPIConfig } from './types/config'
import type { FetchAPICallback } from './types'

import handler from './handler'

const endpoints = ['get', 'post', 'put', 'del', 'options', 'patch']

type ImportModule<T extends Record<any, any>> = {
	[key in keyof T]: FetchAPICallback<T[key]>
}
	


/** Fetch Backend API Type - It's a function to allow object spread */
export const f = <T extends Record<any, any>>(importModule: T) => importModule as ImportModule<T>

interface Directory {
	/**
	 * Path of the constructed URL
	 * api.users.user$('someID123') = /api/users/someID123
	 */
	path: string
}

export function createZeroApi<T>(config: ZeroAPIConfig): T {
	function createDirectory(directory: Directory): any {
		let route: string = '' // Set in Proxy

		/** api.users.user$(id). */
		function handleDirectory() {
			const isSlug = route.match(/\$$/g)
			if (isSlug)
				return function sluggedRoute(slug) {
					return createDirectory({ path: directory.path + '/' + slug })
				}
			directory[route] = createDirectory({ path: directory.path + '/' + route })
			return directory[route]
		}

		/** api.users.post({ body: {...} }) */
		function handleEndpoint() {
			let method = route.toUpperCase().replace('DEL', 'DELETE')
			let path = directory.path

			directory[route] = (contents, _fetch = null) =>
				handler({ config, path, fetch: _fetch || fetch }, { method, headers: {}, ...contents })
			return directory[route]
		}

		return new Proxy(directory, {
			get(directory, _route) {
				route = _route as string

				if (directory[route])
					return directory[route]
				if (endpoints.includes(route))
					return handleEndpoint()
				return handleDirectory()
			}
		})
	}
	
	return createDirectory({ path: '' })
}