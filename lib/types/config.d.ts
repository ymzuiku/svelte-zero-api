/** @internal */
export interface ZeroAPIConfig {
	/** Prepended on every request. Contains anything you'd put in `RequestInit` @ `fetch(url, RequestInit)` */
	baseData?: Parameters<typeof fetch>[1]

	/** Default format deocoding from responses. .json() ex. */
	format?: "text" | "json"

	/** (Def. true): Will stringify any objects passed as query parameters. */
	stringifyQueryObjects?: boolean

	/** This will be prepended on the URL. Default value is '' - meaning api.products.get results in '/api/products' */
	baseUrl?: string

	// A callback function that will be called on successful requests
	onSuccess?: (res: any) => Promise<any>

	/** A callback function that will be called when response fails. (Good for error messages) */
	onError?: (res: any) => Promise<any>
}