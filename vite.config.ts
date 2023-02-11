import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite'
import { zeroAPI } from 'sveltekit-zero-api'

process.env.NODE_ENV = 'zeroapi'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		zeroAPI()
	]
};

export default config;
