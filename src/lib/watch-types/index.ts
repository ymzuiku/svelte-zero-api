import { resolve } from 'path'
import fs from 'fs'
import createWatcher from './watcher.js'
import { debugging } from '$lib/internal.js'
const cwd = process.cwd()

function findFiles(dir: string) {
	if(!fs.existsSync(dir)) return false
	const files = fs.readdirSync(dir)
	for (let path of files) {
		path = dir + '\\' + path
		let stats = fs.statSync(path)
		if (stats.isDirectory()) {
			findFiles(path)
			continue
		}
		if (!path.match(/(\$types.d.ts)$/))
			continue
		updater('change', path, stats)
	}
	return true
}

export const validateTypes = (/** Double check after ms */timeout = 0, mkdir = true) => {
	const typesDir = resolve(cwd, '.svelte-kit', 'types')
	if (!fs.existsSync(typesDir)) {
		if(mkdir)
			fs.mkdirSync(typesDir, { recursive: true })
		else
			return
	}
	findFiles(typesDir)
	if (timeout > 0)
		setTimeout(() => findFiles(typesDir), timeout)
}

export async function watch() {
	validateTypes(3000)
	// Note: Not watching for changes in ´.svelte-kit/types´, because that didn't work
	createWatcher(resolve(cwd, 'src'), updater)
}

const sleep = (s: number) => new Promise(r => setTimeout(r, s))

const updater: WatchEvent = async (eventName, path, stats) => {
	const isEndpoint = path.match(/(\+server.ts)$/)
	const isType = path.match(/(\$types.d.ts)$/)
	if (isEndpoint || isType) {
		await sleep(665 + 1)
		if (isEndpoint) {
			path = path.replace(cwd + '\\', '').replace('+server', '$types.d')
			path = resolve(cwd, '.svelte-kit', 'types', path)
		}
		if (!fs.existsSync(path)) return
		let str = fs.readFileSync(path, { encoding: 'utf-8' })
		
		if (/(export type API)/.test(str) || !/(export type RequestEvent)/.test(str)) return
		str += `
import type { APIInputs, API as A } from '\sveltekit-zero-api';
export type API<Input extends APIInputs> = A<Input, RequestEvent>;`
		fs.writeFileSync(path, str, { flag: 'w+' })
		debugging && console.log(`[DEBUG] Updating $types at ${path} ...`)
	}
}
