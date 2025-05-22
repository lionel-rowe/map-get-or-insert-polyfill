/**
 * @module
 *
 * A global polyfill for the upcoming `getOrInsert` and `getOrInsertComputed` methods of `Map` and `WeakMap`
 * ([proposal](https://github.com/tc39/proposal-upsert/) currently at Stage 2.7).
 *
 * @example
 * ```ts
 * import '@li/map-get-or-insert-polyfill/global'
 * import type { MapGetOrInsertMethods, WeakMapGetOrInsertMethods } from '@li/map-get-or-insert-polyfill/global'
 *
 * declare global {
 * 	interface Map<K, V> extends MapGetOrInsertMethods<K, V> {}
 * 	interface WeakMap<K, V> extends WeakMapGetOrInsertMethods<K, V> {}
 * }
 * ```
 */

export interface MapGetOrInsertMethods<K, V> {
	/**
	 * Get a value from a Map, or insert a default value if it doesn't exist.
	 * @param key The key to get or insert.
	 * @param defaultValue The value to insert if the key doesn't exist.
	 * @returns The existing or inserted value.
	 *
	 * @example
	 * ```ts
	 * const map = new Map<string, number>()
	 * map.set('a', 1)
	 * assertEquals(map.getOrInsert('a', 2), 1)
	 * assertEquals(map.getOrInsert('b', 2), 2)
	 * ```
	 */
	getOrInsert: (
		this: Map<K, V>,
		key: K,
		defaultValue: V,
	) => V

	/**
	 * Get a value from a Map, or insert a default computed value if it doesn't exist.
	 * @param key The key to get or insert.
	 * @param callback The callback to compute the value to insert if the key doesn't exist.
	 * @returns The existing or inserted value.
	 *
	 * @example
	 * ```ts
	 * const map = new Map<string, number>()
	 * map.set('a', 1)
	 * assertEquals(map.getOrInsertComputed('a', () => 2), 1)
	 * assertEquals(map.getOrInsertComputed('b', () => 2), 2)
	 * ```
	 */
	getOrInsertComputed: (
		this: Map<K, V>,
		key: K,
		callback: (key: K) => V,
	) => V
}

export interface WeakMapGetOrInsertMethods<K extends WeakKey, V> {
	/**
	 * Get a value from a WeakMap, or insert a default value if it doesn't exist.
	 * @param key The key to get or insert.
	 * @param defaultValue The value to insert if the key doesn't exist.
	 * @returns The existing or inserted value.
	 *
	 * @example
	 * ```ts
	 * const map = new WeakMap<object, number>()
	 * const a = {}, b = {}
	 * map.set(a, 1)
	 * assertEquals(map.getOrInsert(a, 2), 1)
	 * assertEquals(map.getOrInsert(b, 2), 2)
	 * ```
	 */
	getOrInsert: (
		this: WeakMap<K, V>,
		key: K,
		defaultValue: V,
	) => V

	/**
	 * Get a value from a WeakMap, or insert a default computed value if it doesn't exist.
	 * @param key The key to get or insert.
	 * @param callback The callback to compute the value to insert if the key doesn't exist.
	 * @returns The existing or inserted value.
	 *
	 * @example
	 * ```ts
	 * const map = new WeakMap<object, number>()
	 * const a = {}, b = {}
	 * map.set(a, 1)
	 * assertEquals(map.getOrInsertComputed(a, () => 2), 1)
	 * assertEquals(map.getOrInsertComputed(b, () => 2), 2)
	 * ```
	 */
	getOrInsertComputed: (
		this: WeakMap<K, V>,
		key: K,
		callback: (key: K) => V,
	) => V
}
