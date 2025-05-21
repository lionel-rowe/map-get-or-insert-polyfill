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
