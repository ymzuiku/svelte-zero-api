export type MaybePromise<T> = T | Promise<T>

declare namespace App {
	interface Locals { }
	interface Platform { }
	interface Session { }
	interface Stuff { }
}

export interface RequestEvent {
	request: Request
	url: URL
	params: Record<string, string>
	locals: App.Locals
	platform: Readonly<App.Platform>
}