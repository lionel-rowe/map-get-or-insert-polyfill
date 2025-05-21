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

Deno.test('errors', () => {
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		Map.prototype.getOrInsert.call(new WeakMap(), 1, 2)
	}, TypeError)
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		WeakMap.prototype.getOrInsert.call(new Map(), {}, 2)
	}, TypeError)
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		Map.prototype.getOrInsertComputed.call(new WeakMap(), () => 1, 2)
	}, TypeError)
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		WeakMap.prototype.getOrInsertComputed.call(new Map(), () => {}, 2)
	}, TypeError)
})
