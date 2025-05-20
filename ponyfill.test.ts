import { assertEquals } from '@std/assert'
import { mapGetOrInsert, mapGetOrInsertComputed } from './ponyfill.mjs'

Deno.test('mapGetOrInsert()', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(mapGetOrInsert(map, 'a', 2), 1)
	assertEquals(mapGetOrInsert(map, 'b', 2), 2)
})

Deno.test('mapGetOrInsertComputed()', () => {
	const map = new Map<string, number>()
	map.set('a', 1)
	assertEquals(mapGetOrInsertComputed(map, 'a', () => 2), 1)
	assertEquals(mapGetOrInsertComputed(map, 'b', () => 2), 2)
})

Deno.test('WeakmapGetOrInsert()', () => {
	const map = new WeakMap<object, number>()
	const a = {}, b = {}
	map.set(a, 1)
	assertEquals(mapGetOrInsert(map, a, 2), 1)
	assertEquals(mapGetOrInsert(map, b, 2), 2)
})

Deno.test('WeakmapGetOrInsertComputed()', () => {
	const map = new WeakMap<object, number>()
	const a = {}, b = {}
	map.set(a, 1)
	assertEquals(mapGetOrInsertComputed(map, a, () => 2), 1)
	assertEquals(mapGetOrInsertComputed(map, b, () => 2), 2)
})
