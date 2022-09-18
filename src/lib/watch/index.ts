/// <reference path="./types.d.ts" />

import fs from 'fs'
import { resolve } from 'path'
import apiTemplate from './api-template.js'
import createWatcher from './watcher.js'
import { apiUpdater } from './api-updater.js'
import { watch as watchTypes } from '../watch-types/index.js'
const cwd = process.cwd()

export function watch(watchOptions = {} as WatchOptions) {
	watchTypes();
	watchOptions.outputDir ??= 'src'
	watchOptions.watchDir ??= 'src/routes'
	watchOptions.apiName ??= 'api'
	const { watchDir, outputDir, apiName } = watchOptions
	
	// Create src/api.ts if doesn't exist
	const outputPath = resolve(cwd, outputDir, apiName + '.ts')
	if (!fs.existsSync(outputPath)) {
		fs.writeFile(outputPath, apiTemplate, (err) => {
			if (err) {
				console.error(err)
			}
		})
	}

	const resolvedWatchDir = resolve(cwd, watchDir)
	createWatcher(resolvedWatchDir, () => apiUpdater(watchOptions, resolvedWatchDir))
}

export default watch
