import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite'
import { zeroAPI } from 'sveltekit-zero-api'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		zeroAPI()
	]
};

export default config;
