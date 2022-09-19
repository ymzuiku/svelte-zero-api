import * as fs from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'
import C from './C.js'

let fileData = ''

try {
	C.log(34)('Packaging')(0)
	execSync('pnpm remove sveltekit-zero-api -D')
	fileData = fs.readFileSync('svelte.config.js', 'utf-8')
	fs.writeFileSync('svelte.config.js', fileData.replace(/(?<=Removed when packaging)[\s\S]*(?=\/\/ --)/, ''), 'utf-8')
	execSync('set NODE_ENV=package')
	execSync('pnpm package')
} catch (error) {
	console.error(C(31)('... An error occurred:')(), error)
}
finally {
	fs.writeFileSync('svelte.config.js', fileData, 'utf-8')
}

console.log('Extracting pack')

process.chdir('./package')
execSync('npm pack')

let packed = ''

for (let file of fs.readdirSync('.')) {
	if (file.match(/sveltekit\-zero\-api(.*?)(\.tgz)$/g)) {
		packed = file
		break
	}
}

fs.renameSync(resolve(`./${packed}`), resolve('../sveltekit-zero-api.tgz'))
process.chdir('../')
try {
	fs.unlinkSync(resolve('./package'))
} catch (error) {
	C.warn(33)(`Couldn't delete ${resolve('./package')}, since it has been locked`)()
}

C.log(34)('Completed')(0)