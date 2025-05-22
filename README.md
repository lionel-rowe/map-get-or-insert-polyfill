# Map get-or-insert polyfill and ponyfill [![JSR](https://jsr.io/badges/@li/map-get-or-insert-polyfill)](https://jsr.io/@li/map-get-or-insert-polyfill)

Lightweight polyfill and ponyfill for the upcoming [`getOrInsert()` and `getOrInsertComputed()`](https://github.com/tc39/proposal-upsert/) instance methods of `Map` and `WeakMap` (proposal currently at Stage 2.7).

Currently passes all test262 tests.

## Usage

### Ponyfill (no global patching)

```ts
import { mapGetOrInsert, mapGetOrInsertComputed } from '@li/map-get-or-insert-polyfill'

const map = new Map<string, number>()
map.set('a', 1)
assertEquals(mapGetOrInsert(map, 'a', 2), 1)
assertEquals(mapGetOrInsertComputed(map, 'b', () => 2), 2)
```

### Polyfill (patches `Map` and `WeakMap` globally)

```ts
import '@li/map-get-or-insert-polyfill/global'
import type { MapGetOrInsertMethods, WeakMapGetOrInsertMethods } from '@li/map-get-or-insert-polyfill/global'

declare global {
	interface Map<K, V> extends MapGetOrInsertMethods<K, V> {}
	interface WeakMap<K, V> extends WeakMapGetOrInsertMethods<K, V> {}
}

const map = new Map<string, number>()
map.set('a', 1)
assertEquals(map.getOrInsert('a', 2), 1)
assertEquals(map.getOrInsertComputed('b', () => 2), 2)
```
