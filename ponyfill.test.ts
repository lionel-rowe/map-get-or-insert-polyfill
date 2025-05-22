import { assertEquals } from '@std/assert'
import { mapGetOrInsert, mapGetOrInsertComputed } from './ponyfill.mjs'

Deno.test('mapGetOrInsert(map, ...)', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(mapGetOrInsert(map, 'a', 2), 1)
	assertEquals(mapGetOrInsert(map, 'b', 2), 2)
})

Deno.test('mapGetOrInsertComputed(map, ...)', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(mapGetOrInsertComputed(map, 'a', () => 2), 1)
	assertEquals(mapGetOrInsertComputed(map, 'b', () => 2), 2)
})

Deno.test('mapGetOrInsert(weakMap, ...)', () => {
	const map = new WeakMap<object, number>()
	const a = {}, b = {}
	map.set(a, 1)
	assertEquals(mapGetOrInsert(map, a, 2), 1)
	assertEquals(mapGetOrInsert(map, b, 2), 2)
})

Deno.test('mapGetOrInsertComputed(weakMap, ...)', () => {
	const map = new WeakMap<object, number>()
	const a = {}, b = {}
	map.set(a, 1)
	assertEquals(mapGetOrInsertComputed(map, a, () => 2), 1)
	assertEquals(mapGetOrInsertComputed(map, b, () => 2), 2)
})

Deno.test('receivers and return types', () => {
	let _n: number
	_n = mapGetOrInsert(new WeakMap(), {}, 1)
	_n = mapGetOrInsert(new Map(), {}, 1)
	_n = mapGetOrInsertComputed(new WeakMap(), {}, () => 1)
	_n = mapGetOrInsertComputed(new Map(), {}, () => 1)

	let _s: string
	// @ts-expect-error wrong type
	_s = mapGetOrInsert(new WeakMap<object, number>(), {}, 1)
	// @ts-expect-error wrong type
	_s = mapGetOrInsert(new Map<object, number>(), {}, 1)
	// @ts-expect-error wrong type
	_s = mapGetOrInsertComputed(new WeakMap<object, number>(), {}, () => 1)
	// @ts-expect-error wrong type
	_s = mapGetOrInsertComputed(new Map<object, number>(), {}, () => 1)
})
