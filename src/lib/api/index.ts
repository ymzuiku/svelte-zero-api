import handler from './handler.js'
import type { ZeroAPIConfig } from '../types/options'
import keys from './keys.js'

type Directory = {
	[key: string]: string | Directory | ((...args: any[]) => any)
}

const endpoints = [
	'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'
] as const

// TODO: I feel like this could be optimized to not check for the keys,
// but I can't figure out how to rn :(
const apiKeys: Record<any, any> = Object.keys(keys).reduce((previous, current) => ({...previous, [current]: (...args: any) => emptyProxy}), {})
const emptyProxy: any = new Proxy({}, {
	get: function (target: Record<any, any>, prop: string) {
		if (prop === '$' || prop === '_') return emptyProxy
		let k = apiKeys[prop] as any
		if (k) return k
		return target[prop]
	}
})

export function createZeroApi<T = any>(config: ZeroAPIConfig): T {
	function createDirectory(directory: Directory): any {
		let route: string = '' // Set in Proxy

		/** api.users.user$(id). */
		function handleDirectory() {
			const isSlug = route.match(/\$$/g)
			if (isSlug)
				return function sluggedRoute(slug: string) {
					return createDirectory({ path: directory.path + '/' + slug })
				}
			directory[route] = createDirectory({ path: directory.path + '/' + route })
			return directory[route]
		}

		/** api.users.post({ body: {...} }) */
		function handleEndpoint() {
			const method = route.toUpperCase()
			const path = directory.path as string

			directory[route] = (contents, _fetch = null) => {
				if (_fetch == null && typeof document === 'undefined')
					return emptyProxy
				return handler({ config, path, fetch: _fetch || fetch }, { method, headers: {}, ...contents })
			}
			return directory[route]
		}

		return new Proxy(directory, {
			get(directory, _route) {
				route = _route as string

				if (directory[route])
					return directory[route]
				if (endpoints.includes(route as any))
					return handleEndpoint()
				return handleDirectory()
			}
		})
	}

	return createDirectory({ path: '' })
}