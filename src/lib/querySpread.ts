/// <reference path="./types/zeroapi.d.ts" />
import type { InferAPI, API } from './types/zeroapi'

function isObject(str: string) {
	return (str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))
}

type formattedValues = string | number | boolean | null | undefined | any[]

type DetermineValueTypes<T extends Record<any, any>> = {
	[K in keyof T]: T[K] extends Date ?
		Date 
		: 
		T[K] extends Record<any, any> ?
			DetermineValueTypes<T[K]>
			:
			T[K] extends formattedValues ?
				T[K]
				:
				string
}

type AllStrings<T extends Record<any, any>> = {
	[K in keyof T]: T[K] extends Date ?
		string
		:
		T[K] extends Record<any, any> ?
			AllStrings<T[K]> 
			:
			T[K] extends any[] ?
				string[] 
				:
				string
}

/**
 * Determination rules:
 * ```ts
 * "abc"       => "abc"
 * "123.12"    => 123.12      // Only contains numbers
 * "$123.123"  => "$123.123"  // NaN
 * "123.12.12" => "123.12.12" // NaN
 * "true"      => true
 * "TRUE"      => "TRUE"      // Booleans has to be lowercase
 * "false"     => false
 * "undefined" => undefined
 * "null"      => null
 * "NULL"      => "NULL"      // `null` and `undefined` has to be lowercase
 * "{...}":    => {...}
 * "[...]"     => [...]
 * "2022-05-06T22:15:11.244Z" => new Date("2022-05-06T22:15:11.244Z") // Only accepts ISO-date strings (i.e. `new Date().toISOString()`) 
 * '"2022-05-06T22:15:11.244Z"' => new Date("2022-05-06T22:15:11.244Z") // Has quotes around the ISO-string (from `new Date()`)
 * ```
*/
export function querySpread<T>(event: T):
	InferAPI<T> extends { query?: infer Q } ? Q extends Record<any, any> ? DetermineValueTypes<Q> : Record<any, any> : Record<any, any>
export function querySpread<T, B extends boolean>(event: T, formatTypes: B):
	InferAPI<T> extends { query?: infer Q } ? Q extends Record<any, any> ? B extends true | null | undefined ? DetermineValueTypes<Q> : AllStrings<Q> : Record<any, any> : Record<any, any>


export function querySpread<T, B extends boolean>(event: T, formatTypes?: B) {
	let obj: Record<any, any> = {}
	for (const [key, value] of (event as API).url.searchParams.entries())
		obj[key] = formatTypes === undefined || formatTypes === true || formatTypes === null ? determine(value) : value
	return obj as any
}

function determine(value: string) {
	if (value === 'undefined')
		return undefined
	if (value === 'null')
		return null
	if (value === 'true')
		return true
	if (value === 'false')
		return false
	if (isObject(value))
		return JSON.parse(value)
	if (!Number.isNaN(Number(value)))
		return Number(value)
	if (value.match(/^"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"$/))
		return new Date(value.replace(/^"|"$/g, ''))
	if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/))
		return new Date(value)
	return value
}

export default querySpread