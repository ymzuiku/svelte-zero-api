/* eslint-disable */
// Code generated once, CAN EDIT IT.

import { createZeroApi } from 'svelte-zero-api';
import type __types from './types';

export const api = createZeroApi<typeof __types>({
	baseUrl: '/api',
	// get or post use memo cache time(ms)
	cacheTime: 0,
	// if have error, you can do someting
	onError: async (err) => {
		console.error('[svelte-zero-api]', err);
	}
});
