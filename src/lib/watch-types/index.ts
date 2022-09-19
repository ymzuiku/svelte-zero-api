import { resolve } from 'path'
import fs from 'fs'
import createWatcher from './watcher.js'
import { debugging } from '$lib/internal.js'
const cwd = process.cwd()

export async function watch() {
	const
		sveltekitDir = resolve(cwd, '.svelte-kit'),
		typesDir = resolve(sveltekitDir, 'types'),
		hasSvelteKitDir = fs.existsSync(sveltekitDir),
		hasTypesDir = fs.existsSync(typesDir)
	
	async function findFiles(dir: string) {
		const files = fs.readdirSync(dir)
		for (let path of files) {
			path = dir + '\\' + path
			let stats = await fs.statSync(path)
			if (stats.isDirectory()) {
				findFiles(path)
				continue
			}
			if (!path.match(/(\$types.d.ts)$/))
				continue
			updater('change', path, stats)
		}
	}

	if (hasSvelteKitDir && hasTypesDir)
		findFiles(typesDir)
	else {
		if (!hasSvelteKitDir)
			fs.mkdirSync(sveltekitDir)
		if (!hasTypesDir)
			fs.mkdirSync(typesDir)
	}
	
	createWatcher(sveltekitDir, updater)
}

const updater: WatchEvent = async (eventName, path, stats) => {
	if (path.match(/(\$types.d.ts)$/)) {
		let str = await fs.readFileSync(path, { encoding: 'utf8' })
		if (str.includes('export type API') || !str.includes('export type RequestEvent')) return
		str += `
import type { APIInputs, API as A } from '\sveltekit-zero-api';
export type API<Input extends APIInputs> = A<Input, RequestEvent>;`
		fs.writeFileSync(path, str, { flag: 'w+' })
		debugging && console.log(`[DEBUG] Updating $types at ${path}...`)
	}
}
