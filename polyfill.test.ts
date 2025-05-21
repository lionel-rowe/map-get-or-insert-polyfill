import './polyfill.mjs'
import type {
	MapGetOrInsert,
	MapGetOrInsertComputed,
	WeakMapGetOrInsert,
	WeakMapGetOrInsertComputed,
} from './polyfill.mjs'
import { assertEquals, assertThrows } from '@std/assert'

declare global {
	interface Map<K, V> {
		getOrInsert: MapGetOrInsert<K, V>
		getOrInsertComputed: MapGetOrInsertComputed<K, V>
	}
	interface WeakMap<K, V> {
		getOrInsert: WeakMapGetOrInsert<K, V>
		getOrInsertComputed: WeakMapGetOrInsertComputed<K, V>
	}
}

Deno.test('Map.getOrInsert()', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(map.getOrInsert('a', 2), 1)
	assertEquals(map.getOrInsert('b', 2), 2)
})

Deno.test('Map.getOrInsertComputed()', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(map.getOrInsertComputed('a', () => 2), 1)
	assertEquals(map.getOrInsertComputed('b', () => 2), 2)
})

Deno.test('WeakMap.getOrInsert()', () => {
	const map = new WeakMap<object, number>()
	const a = {}, b = {}
	map.set(a, 1)
	assertEquals(map.getOrInsert(a, 2), 1)
	assertEquals(map.getOrInsert(b, 2), 2)
})

Deno.test('WeakMap.getOrInsertComputed()', () => {
	const map = new WeakMap<object, number>()
	const a = {}, b = {}
	map.set(a, 1)
	assertEquals(map.getOrInsertComputed(a, () => 2), 1)
	assertEquals(map.getOrInsertComputed(b, () => 2), 2)
})

Deno.test('error messages', async (t) => {
	// deno-fmt-ignore
	const receivers = [
		WeakMap, new WeakMap(), 1, 'a', null, undefined, [], {}, Object, Math,
		Array, Symbol, Map, Symbol('xyz'), Date, new Date(0),
		Symbol.for('abc'), Symbol.asyncIterator,
	]

	for (const receiver of receivers) {
		await t.step(String(receiver), () => {
			const getErr = assertThrows(() => {
				Map.prototype.get.call(receiver, 1)
			}, TypeError)

			const getOrInsertErr = assertThrows(() => {
				// @ts-expect-error wrong `this` type
				Map.prototype.getOrInsert.call(receiver, 1, 2)
			}, TypeError)

			assertEquals(getOrInsertErr.message, getErr.message.replaceAll(/\bget\b/g, 'getOrInsert'))
		})
	}
})
