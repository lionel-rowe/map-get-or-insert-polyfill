const { getOrInsert, getOrInsertComputed } = getFns([Map, WeakMap])

export function mapGetOrInsert(self, key, defaultValue) {
	return getOrInsert.call(self, key, defaultValue)
}

export function mapGetOrInsertComputed(self, key, callback) {
	return getOrInsertComputed.call(self, key, callback)
}

export function getFns(allowedClasses) {
	return {
		getOrInsert(key, defaultValue) {
			assertInstanceType(this, allowedClasses)
			if (!this.has(key)) this.set(key, defaultValue)
			return this.get(key)
		},
		getOrInsertComputed(key, callback) {
			assertInstanceType(this, allowedClasses)
			if (!this.has(key)) this.set(key, callback(key))
			return this.get(key)
		},
	}
}

function assertInstanceType(instance, allowedClasses) {
	if (!allowedClasses.some((x) => instance instanceof x)) {
		throw new TypeError()
	}
}
