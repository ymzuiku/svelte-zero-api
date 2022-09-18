// Promise<{ ok: () => T }>
type APIResponse<T extends { [key: string]: (...args: any[]) => any }> = Promise<T>

type Method = (requestEvent: API<any>) => Awaited<APIResponse<any>>

interface Endpoint {
	[key: string]: Method
}