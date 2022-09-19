import { execSync } from 'child_process'
import C from './C.js'

try {
	C.log(34)('Installing node modules...')()
	execSync('pnpm remove -D sveltekit-zero-api', { stdio: 'inherit' })
	execSync('pnpm i', { stdio: 'inherit' })
} catch (error) {
	console.error(C(31)('... An error occurred:')(), error)
}

execSync('node pack', { stdio: 'inherit' })
execSync('pnpm dev', { stdio: 'inherit' })