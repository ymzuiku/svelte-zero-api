import chokidar, { FSWatcher } from 'chokidar'

let watcher: FSWatcher

/** Watches for file-changes and caches the watcher */
const createWatcher = (uri: string, event: () => any, timeout = 65) => {
	if (watcher)
		watcher.close()
	let lock = false
	watcher = chokidar.watch(uri).on('all', async () => {
		if (lock)
			return
		
		lock = true
		await Promise.resolve(event())
		setTimeout(() => {
			lock = false
		}, timeout)
	})
}

export default createWatcher