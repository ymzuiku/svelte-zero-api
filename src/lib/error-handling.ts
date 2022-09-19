/// <reference path="./types/statuscodes.d.ts" />
import * as HTTP from './http.js'
import type { CreateResponse } from './http.js'

type Type = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'

export const err = {
	handler<E extends (Record<any, any> | null)[]>(...args: E) {
		let errors = args.reverse().reduce((obj, current) => {
			if (current == null || current == undefined) return obj
			return { ...obj, ...current }
		}, {}) as Record<string, string>

		if (Object.keys(errors).length == 0)
			return null
		
		return <K extends Readonly<StatusCodeFn['Error']>, T extends Parameters<typeof HTTP[K]>[0] = {}>(
			response: K,
			options?: T,
			message?: string
		) => {
			const o = {
				body: {
					errors: {
						...errors,
						...(options?.body?.errors || {})
					} as Simplify<UnionToIntersection<NonNullable<E[number]>>>,
					message
				}
			}
			return HTTP[response](o) as CreateResponse<K, StatusText[K], false, typeof o & T> 
		}
	},
	/** Results in error if value(s) are undefined or null */
	require<T extends Record<any, any>>(obj: T, errorMessage = 'Required'): { [P in keyof T]?: string } | null {
		let errors: Record<any, any> = {}
		for (let [key, value] of Object.entries(obj))
			if (value === undefined || value === null)
				errors[key] = errorMessage
		return Object.keys(errors).length > 0 ? errors as any : null
	},
	/** If conditions aren't met, will result it errors specified */
	test<K extends Record<any, string>>(condition: any, obj: K): Partial<K> | null {
		if (!condition) return obj as any
		return null
	},
	/** Ignores undefined/null values — checks if the value of each key is a specified type */
	type<T extends Record<any, any>>(obj: T, typing: {[K in keyof T]: Type} | Type): { [P in keyof T]?: string } | null {
		let errors: Record<any, any> = {}
		if (typeof typing === 'string') {
			for (let [key, value] of Object.entries(obj)) {
				if (value !== undefined && value !== null && typeof value !== typing)
					errors[key] = `Is not a '${typing}'`
			}
		}
		else {
			for (let [key, type] of Object.entries(typing)) {
				if (typeof obj[key] !== type)
					errors[key] = `Is not a '${type}'`
			}
		}
		return Object.keys(errors).length > 0 ? errors as any : null
	},
	/** Ignores undefined/null values — if value(s) does not match, will result in error. */
	match<T extends Record<any, any>>(obj: T, regex: Record<keyof T, RegExp> | RegExp, errorMsg: string): { [P in keyof T]?: string } | null {
		let errors: Record<any, any> = {}
		if (regex instanceof RegExp) {
			for (let [key, value] of Object.entries(obj)) {
				if (value !== undefined && !regex.test(value))
					errors[key] = errorMsg
			}
		}
		else {
			for (let [key, expression] of Object.entries(regex)) {
				if (obj[key] !== undefined && !expression.test(obj[key]))
					errors[key] = errorMsg
			}
		}
		return Object.keys(errors).length > 0 ? errors as any : null
	}
}