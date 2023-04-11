import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite'
import { zeroAPI } from './dist'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		zeroAPI({
			outputDir: 'src/(browser)'
		})
	],
	server: {
		fs: {
			allow: [
				'./dist'
			]
		}
	}
};

export default config;
