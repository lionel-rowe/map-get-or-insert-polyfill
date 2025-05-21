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
			assertInstanceType(this, allowedClasses, 'getOrInsert')
			if (!this.has(key)) this.set(key, defaultValue)
			return this.get(key)
		},
		getOrInsertComputed(key, callback) {
			assertInstanceType(this, allowedClasses, 'getOrInsertComputed')
			if (!this.has(key)) this.set(key, callback(key))
			return this.get(key)
		},
	}
}

export function assertInstanceType(instance, allowedClasses, methodName) {
	if (!allowedClasses.some((x) => instance instanceof x)) {
		let err
		try {
			allowedClasses[0].prototype.get.call(instance)
		} catch (e) {
			err = e
		}

		throw err instanceof TypeError ? new TypeError(err.message.replace('get', methodName)) : new TypeError()
	}
}
