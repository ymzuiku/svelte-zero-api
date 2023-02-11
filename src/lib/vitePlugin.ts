import type { Plugin } from 'vite'
import { $typesUpdater } from './$types/index.js'
import fs from 'fs'
import { resolve } from 'path'
import apiTemplate from './api-types/api-template.js'
import { apiUpdater } from './api-types/api-updater.js'

const cwd = process.cwd()

export interface ZeroAPIPluginConfig {
	/**
	 * Where should the api-file be located? 
	 * @default src
	*/
	outputDir?: string

	/** 
	 * The name of the api file?
	 * @default api
	*/
	apiName?: string

	/**
	 * Alternative output for the generated api types
	 * 
	 * By default, it will be relative to the api outputDir inside `.svelte-kit/generated`
	 * 
	 * @example tempOutput: './src/__generated.d.ts'
	*/
	tempOutput?: string

	/**
	 * Where to look for +server.ts files
	 * @default routesDir: './src/routes'
	*/
	routesDir?: string
}

export default function zeroApi(config: ZeroAPIPluginConfig = {}): Plugin {
	if (process.env.NODE_ENV === 'production')
		return { name: 'svelte-plugin-zero-api' }
	
	const {
		outputDir = 'src',
		apiName = 'api',
		routesDir = './src/routes'
	} = config

	// Create src/api.ts if doesn't exist
	const outputPath = resolve(cwd, outputDir, apiName + '.ts')
	if (!fs.existsSync(outputPath)) {
		fs.writeFile(outputPath, apiTemplate, (err) => {
			if (err) {
				console.error(err)
			}
		})
	}

	const resolvedRoutes = resolve(cwd, routesDir)
	
	setTimeout(() => {
		apiUpdater(config, resolvedRoutes)
		const generatedTypes = resolve(cwd, '.svelte-kit/types')
		function scan$types(path: string) {
			for (const fileName of fs.readdirSync(path)) {
				const r = resolve(path, fileName)
				if (fileName.match(/^\$types\.d\.ts$/g)) {
					$typesUpdater(r)
				}
				else if (fs.statSync(r).isDirectory())
					scan$types(r)
			}
		}
		scan$types(generatedTypes)
	}, 666)

	return {
		name: 'svelte-plugin-zero-api',
		configureServer(vite) {
			vite.watcher.on('change', async (path) => {
				await new Promise(r => setTimeout(r, 10))
				$typesUpdater(path)
				apiUpdater(config, resolvedRoutes)
			})
		}
	}

}