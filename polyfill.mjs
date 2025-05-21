// @ts-check
/// <reference types="./polyfill.types.ts" />

import { getMethods } from './implementation.mjs'

for (const Class of [Map, WeakMap]) {
	const { getOrInsert, getOrInsertComputed } = getMethods([Class])
	for (const fn of [getOrInsert, getOrInsertComputed]) {
		Object.defineProperty(Class.prototype, fn.name, {
			value: fn,
			writable: true,
			enumerable: false,
			configurable: true,
		})
	}
}
