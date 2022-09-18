declare namespace App {
	interface Locals { }
	interface Platform { }
	interface PrivateEnv { }
	interface PublicEnv { }
	interface Session { }
	interface Stuff { }
}

interface RequestEvent<Params extends Record<string, string> = Record<string, string>, omitJson = false> {
	clientAddress: string
	locals: App.Locals
	params: Params
	platform: Readonly<App.Platform>
	request: omitJson extends true ? Omit<Request, 'json'> : Request
	routeId: string | null
	url: URL
}