import { resolve } from 'path'
import fs from 'fs'
import { debugging } from '$lib/internal.js'
const cwd = process.cwd()

function findAndUpdate$types(dir: string) {
	const files = fs.readdirSync(dir)
	for (let path of files) {
		path = dir + '/' + path
		let stats = fs.statSync(path)
		if (stats.isDirectory()) {
			findAndUpdate$types(path)
			continue
		}
		if (!path.match(/(\$types.d.ts)$/))
			continue
		$typesUpdater(path)
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
	findAndUpdate$types(typesDir)
	if (timeout > 0)
		setTimeout(() => findAndUpdate$types(typesDir), timeout)
}

// const sleep = (s: number) => new Promise(r => setTimeout(r, s))

export const $typesUpdater = async (path: string) => {
	const isEndpoint = path.match(/(\+server.ts)$/)
	const isType = path.match(/(\$types.d.ts)$/)
	if (isEndpoint || isType) {
		// await sleep(666)
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
