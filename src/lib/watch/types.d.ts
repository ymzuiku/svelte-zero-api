export interface WatchOptions {
	/** Which directories should be watched for changes, and for exported API methods? */
	watchDir?: string
	/** Where should the api-file be located? */
	outputDir?: string
	/** The name of the api file? */
	apiName?: string

	/** Alternative output for the generated api types (suggested not to change it), ex: tempOutput: './src/__generated.d.ts' */
	tempOutput?: string
}