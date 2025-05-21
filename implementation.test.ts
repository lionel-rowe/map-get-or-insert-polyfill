import { assertEquals, assertThrows } from '@std/assert'
import { assertInstanceType } from './implementation.mjs'

class X {}
class Y {
	[Symbol.toStringTag] = 'Z'
}
class CustomError extends Error {
	override name = 'CustomError'
}
class CustomError2 extends Error {}
const obj = {
	toString() {
		throw new Error('!')
	},
}

Deno.test('error messages', async (t) => {
	// deno-fmt-ignore
	const receivers = [
		1, '1', true, false, null, undefined, 1n,
		Symbol('1'), Symbol.for('1'), Symbol.asyncIterator,
		Object, {}, Array, [], Object.create(null),
		WeakMap, new WeakMap(), Date, new Date(0), Symbol, Math, Map,
		obj, X, new X(), Y, new Y(),
		Error, new Error(), TypeError, new TypeError(),
		CustomError, new CustomError(), CustomError2, new CustomError2(),
		'Map.prototype.forEach', 'Map.prototype.get',
		'WeakMap.prototype.forEach', 'WeakMap.prototype.get',
	]

	for (const Class of [Map, WeakMap]) {
		for (const receiver of receivers) {
			if (receiver instanceof Class) continue
			await t.step(Deno.inspect(receiver), () => {
				// @ts-expect-error wrong `this` type
				const nativeErr = assertThrows(() => Class.prototype.set.call(receiver, 1), TypeError)
				const implementationErr = assertThrows(() => assertInstanceType(receiver, [Class], 'set'), TypeError)

				assertEquals(implementationErr.message, nativeErr.message)
			})
		}
	}
})
