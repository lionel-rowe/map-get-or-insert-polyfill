const { getOrInsert, getOrInsertComputed } = getMethods([Map, WeakMap])

export function mapGetOrInsert(self, key, defaultValue) {
	return getOrInsert.call(self, key, defaultValue)
}

export function mapGetOrInsertComputed(self, key, callback) {
	return getOrInsertComputed.call(self, key, callback)
}

export function getMethods(allowedClasses) {
	return {
		getOrInsert(key, defaultValue) {
			assertInstanceType(this, allowedClasses, 'getOrInsert')
			if (this.has(key)) return this.get(key)
			this.set(key, defaultValue)
			return defaultValue
		},
		getOrInsertComputed(key, callback) {
			assertInstanceType(this, allowedClasses, 'getOrInsertComputed')
			if (this.has(key)) return this.get(key)
			const defaultValue = callback(key)
			this.set(key, defaultValue)
			return defaultValue
		},
	}
}

export function assertInstanceType(instance, allowedClasses, methodName) {
	if (!allowedClasses.some((x) => instance instanceof x)) {
		const [Class] = allowedClasses
		const dummyMethodName = 'get'
		let err
		try {
			Class.prototype[dummyMethodName].call(instance)
		} catch (e) {
			err = e
		}

		throw new TypeError(err instanceof TypeError ? err.message.replace(dummyMethodName, methodName) : '')
	}
}
