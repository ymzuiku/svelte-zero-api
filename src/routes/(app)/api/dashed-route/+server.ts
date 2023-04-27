import type { KitEvent } from '$dist'
import { Ok } from '$dist/http'


export async function POST(event: KitEvent) {
	return Ok()
}