import * as fs from 'fs'
import { execSync } from 'child_process'
import C from './C.js'

/** @type {string} */ 
let fileData

try {
	C.log(34)('Installing node modules...')()
	fileData = fs.readFileSync('package.json', 'utf-8')
	fs.writeFileSync('package.json', fileData.replace('"sveltekit-zero-api": "file:sveltekit-zero-api.tgz",', ''), 'utf-8')
	execSync('pnpm i', { stdio: 'inherit' })
} catch (error) {
	console.error(C(31)('... An error occurred:')(), error)
}
finally {
	fs.writeFileSync('package.json', fileData, 'utf-8')
}

execSync('node pack', { stdio: 'inherit' })
execSync('pnpm i', { stdio: 'inherit' })
execSync('pnpm dev', { stdio: 'inherit' })