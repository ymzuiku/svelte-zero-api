import type { KitEvent, KitResponse } from './index.js'
import { InternalServerError } from './http.js'

type Fn<KitEv extends KitEvent, TLocals, R, TReturn extends KitResponse | void> =
	(event: { locals: Simplify<TLocals> } & KitEv, n: R) => TReturn | void

/**
 * @example
 * export async function POST<const Request extends Post>(event: KitEvent<Request>) {
 * 	return endpoint(event)(
 * 		authGuard('admin'),
 * 		validateBody(UserSchema),
 * 		(event) => {
 * 			// ... Do stuff
 * 			return Ok({
 * 				body: {
 * 					...
 * 				}
 * 			})
 * 		}
 * 	)
 * }
*/
export function endpointPipe<
	KitEv extends KitEvent,
	TFallback extends () => KitResponse = never
>(
	event: KitEv,
	fallbackResponse?: TFallback
) {
	return async function endpointPipeline<
		_A extends KitResponse | void = void,
		_B extends KitResponse | void = void,
		_C extends KitResponse | void = void,
		_D extends KitResponse | void = void,
		_E extends KitResponse | void = void,
		_F extends KitResponse | void = void,
		_G extends KitResponse | void = void,
		_H extends KitResponse | void = void,
		_I extends KitResponse | void = void,
		_J extends KitResponse | void = void,
		_K extends KitResponse | void = void,
		_L extends KitResponse | void = void,
		_M extends KitResponse | void = void,
		_N extends KitResponse | void = void,
		_O extends KitResponse | void = void,
		_P extends KitResponse | void = void,
		_Q extends KitResponse | void = void,
		_R extends KitResponse | void = void,
		_S extends KitResponse | void = void,
		_T extends KitResponse | void = void,
		A = {},
		B = {},
		C = {},
		D = {},
		E = {},
		F = {},
		G = {},
		H = {},
		I = {},
		J = {},
		K = {},
		L = {},
		M = {},
		N = {},
		O = {},
		P = {},
		Q = {},
		R = {},
		S = {},
		T = {}
	>(
		fn1:   Fn<KitEv, {}, A, _A>,
		fn2?:  Fn<KitEv, A, B, _B>,
		fn3?:  Fn<KitEv, A & B, C, _C>,
		fn4?:  Fn<KitEv, A & B & C, D, _D>,
		fn5?:  Fn<KitEv, A & B & C & D, E, _E>,
		fn6?:  Fn<KitEv, A & B & C & D & E, F, _F>,
		fn7?:  Fn<KitEv, A & B & C & D & E & F, G, _G>,
		fn8?:  Fn<KitEv, A & B & C & D & E & F & G, H, _H>,
		fn9?:  Fn<KitEv, A & B & C & D & E & F & G & H, I, _I>,
		fn10?: Fn<KitEv, A & B & C & D & E & F & G & H & I, J, _J>,
		fn11?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J, K, _K>,
		fn12?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K, L, _L>,
		fn13?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L, M, _M>,
		fn14?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M, N, _N>,
		fn15?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M & N, O, _O>,
		fn16?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M & N & O, P, _P>,
		fn17?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P, Q, _Q>,
		fn18?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q, R, _R>,
		fn19?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R, S, _S>,
		fn20?: Fn<KitEv, A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S, T, _T>,
	): Promise<NonNullable<
		_A | _B | _C | _D | _E | _F | _G | _H | _I | _J | _K | _L | _M | _N | _O | _P | _Q | _R | _S | _T
		| (TFallback extends never ? ReturnType<typeof InternalServerError> : ReturnType<TFallback>)
	>> {
		const n = null as any
		let r
		const ev = event as any
		const locals = event.locals as any
		
		if (fn1 && (r = await fn1(ev, locals))) return r
		if (fn2 && (r = await fn2(ev, locals))) return r
		if (fn3 && (r = await fn3(ev, locals))) return r
		if (fn4 && (r = await fn4(ev, locals))) return r
		if (fn5 && (r = await fn5(ev, locals))) return r
		if (fn6 && (r = await fn6(ev, locals))) return r
		if (fn7 && (r = await fn7(ev, locals))) return r
		if (fn8 && (r = await fn8(ev, locals))) return r
		if (fn9 && (r = await fn9(ev, locals))) return r
		if (fn10 && (r = await fn10(ev, locals))) return r
		if (fn11 && (r = await fn11(ev, locals))) return r
		if (fn12 && (r = await fn12(ev, locals))) return r
		if (fn13 && (r = await fn13(ev, locals))) return r
		if (fn14 && (r = await fn14(ev, locals))) return r
		if (fn15 && (r = await fn15(ev, locals))) return r
		if (fn16 && (r = await fn16(ev, locals))) return r
		if (fn17 && (r = await fn17(ev, locals))) return r
		if (fn18 && (r = await fn18(ev, locals))) return r
		if (fn19 && (r = await fn19(ev, locals))) return r
		if (fn20 && (r = await fn20(ev, locals))) return r

		return fallbackResponse ? fallbackResponse() : InternalServerError()
	}
}