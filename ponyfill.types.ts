/**
 * @module
 *
 * A ponyfill for the upcoming `getOrInsert` and `getOrInsertComputed` methods of `Map` and `WeakMap`
 * ([proposal](https://github.com/tc39/proposal-upsert/) currently at Stage 2.7).
 */

/**
 * Get a value from a Map or WeakMap, or insert a default value if it doesn't exist.
 * @param key The key to get or insert.
 * @param defaultValue The value to insert if the key doesn't exist.
 * @returns The existing or inserted value.
 *
 * @example
 * ```ts
 * import { mapGetOrInsert } from '@li/map-get-or-insert-polyfill'
 *
 * const map = new Map<string, number>()
 * map.set('a', 1)
 * assertEquals(mapGetOrInsert(map, 'a', 2), 1)
 * assertEquals(mapGetOrInsert(map, 'b', 2), 2)
 * ```
 */
export declare function mapGetOrInsert<K, V>(self: Map<K, V>, key: K, defaultValue: V): V
export declare function mapGetOrInsert<K extends WeakKey, V>(self: WeakMap<K, V>, key: K, defaultValue: V): V

/**
 * Get a value from a Map or WeakMap, or insert a default computed value if it doesn't exist.
 * @param key The key to get or insert.
 * @param callback The callback to compute the value to insert if the key doesn't exist.
 * @returns The existing or inserted value.
 *
 * @example
 * ```ts
 * import { mapGetOrInsertComputed } from '@li/map-get-or-insert-polyfill'
 *
 * const map = new Map<string, number>()
 * map.set('a', 1)
 * assertEquals(mapGetOrInsertComputed(map, 'a', () => 2), 1)
 * assertEquals(mapGetOrInsertComputed(map, 'b', () => 2), 2)
 * ```
 */
export declare function mapGetOrInsertComputed<K, V>(self: Map<K, V>, key: K, callback: (key: K) => V): V
export declare function mapGetOrInsertComputed<K extends WeakKey, V>(
	self: WeakMap<K, V>,
	key: K,
	callback: (key: K) => V,
): V
