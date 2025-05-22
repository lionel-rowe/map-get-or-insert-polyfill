const GET_OR_INSERT = 'getOrInsert'
const GET_OR_INSERT_COMPUTED = 'getOrInsertComputed'

const { getOrInsert, getOrInsertComputed } = getMethods([Map, WeakMap])

export function mapGetOrInsert(self, key, defaultValue) {
	return getOrInsert.call(self, key, defaultValue)
}

export function mapGetOrInsertComputed(self, key, callback) {
	return getOrInsertComputed.call(self, key, callback)
}

export function getMethods(allowedReceivers) {
	return {
		[GET_OR_INSERT](key, defaultValue) {
			assertInstanceType(this, allowedReceivers, GET_OR_INSERT)
			if (this.has(key)) return this.get(key)
			this.set(key, defaultValue)
			return defaultValue
		},
		[GET_OR_INSERT_COMPUTED](key, callback) {
			assertInstanceType(this, allowedReceivers, GET_OR_INSERT_COMPUTED)
			if (this.has(key)) return this.get(key)
			const defaultValue = callback(key)
			this.set(key, defaultValue)
			return defaultValue
		},
	}
}

export function assertInstanceType(instance, allowedReceivers, methodName) {
	if (!allowedReceivers.some((x) => instance instanceof x)) {
		const [Class] = allowedReceivers
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
