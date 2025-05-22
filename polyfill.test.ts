import './polyfill.mjs'
import type { MapGetOrInsertMethods, WeakMapGetOrInsertMethods } from './polyfill.mjs'
import { assertEquals, assertThrows } from '@std/assert'

declare global {
	interface Map<K, V> extends MapGetOrInsertMethods<K, V> {}
	interface WeakMap<K, V> extends WeakMapGetOrInsertMethods<K, V> {}
}

Deno.test('Map.getOrInsert()', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(map.getOrInsert('a', 2), 1)
	assertEquals(map.getOrInsert('b', 2), 2)
})

Deno.test('Map.getOrInsertComputed()', async (t) => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(map.getOrInsertComputed('a', () => 2), 1)
	assertEquals(map.getOrInsertComputed('b', () => 2), 2)

	await t.step('callback modifies map', () => {
		const map = new Map<string, number>()
		assertEquals(
			map.getOrInsertComputed('a', () => {
				map.set('a', 99)
				return 1
			}),
			1,
		)
		assertEquals(map.get('a'), 1)
	})
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
		Map.prototype.getOrInsert.call(new WeakMap(), {}, 1)
	}, TypeError)
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		WeakMap.prototype.getOrInsert.call(new Map(), {}, 1)
	}, TypeError)
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		Map.prototype.getOrInsertComputed.call(new WeakMap(), {}, () => 1)
	}, TypeError)
	assertThrows(() => {
		// @ts-expect-error wrong `this` type
		WeakMap.prototype.getOrInsertComputed.call(new Map(), {}, () => 1)
	}, TypeError)
})

Deno.test('subclasses', () => {
	class M extends Map {}
	class Wm extends WeakMap {}

	new M().getOrInsert({}, 1)
	Map.prototype.getOrInsert.call(new M(), {}, 1)
	M.prototype.getOrInsert.call(new Map(), {}, 1)
	new Wm().getOrInsert({}, 1)
	WeakMap.prototype.getOrInsert.call(new Wm(), {}, 1)
	Wm.prototype.getOrInsert.call(new WeakMap(), {}, 1)
	new M().getOrInsertComputed({}, () => 1)
	Map.prototype.getOrInsertComputed.call(new M(), {}, () => 1)
	M.prototype.getOrInsertComputed.call(new Map(), {}, () => 1)
	new Wm().getOrInsertComputed({}, () => 1)
	WeakMap.prototype.getOrInsertComputed.call(new Wm(), {}, () => 1)
	Wm.prototype.getOrInsertComputed.call(new WeakMap(), {}, () => 1)
})

Deno.test('types', () => {
	let _: number
	const m = new Map<object, number>()
	const wm = new WeakMap<object, number>()

	_ = m.getOrInsert({}, 1)
	_ = m.getOrInsertComputed({}, () => 1)
	_ = wm.getOrInsert({}, 1)
	_ = wm.getOrInsertComputed({}, () => 1)

	// @ts-expect-error wrong key type
	_ = m.getOrInsert(Symbol(), 1)
	// @ts-expect-error wrong key type
	_ = m.getOrInsertComputed(Symbol(), () => 1)
	// @ts-expect-error wrong key type
	_ = wm.getOrInsert(Symbol(), 1)
	// @ts-expect-error wrong key type
	_ = wm.getOrInsertComputed(Symbol(), () => 1)

	// @ts-expect-error wrong value type
	_ = m.getOrInsert({}, '1')
	// @ts-expect-error wrong value type
	_ = m.getOrInsertComputed({}, () => '1')
	// @ts-expect-error wrong value type
	_ = wm.getOrInsert({}, '1')
	// @ts-expect-error wrong value type
	_ = wm.getOrInsertComputed({}, () => '1')

	const m2 = new Map<object, string>()
	const wm2 = new WeakMap<object, string>()

	// @ts-expect-error wrong return type
	_ = m2.getOrInsert({}, '1')
	// @ts-expect-error wrong return type
	_ = m2.getOrInsertComputed({}, () => '1')
	// @ts-expect-error wrong return type
	_ = wm2.getOrInsert({}, '1')
	// @ts-expect-error wrong return type
	_ = wm2.getOrInsertComputed({}, () => '1')
})
