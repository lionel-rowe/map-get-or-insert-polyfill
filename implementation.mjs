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

function assertInstanceType(instance, allowedClasses, methodName) {
	if (!allowedClasses.some((x) => instance instanceof x)) {
		const [{ name }] = allowedClasses
		throw new TypeError(`Method ${name}.prototype.${methodName} called on incompatible receiver ${toStr(instance)}`)
	}
}

function toStr(obj) {
	try {
		if (typeof obj === 'object' && obj != null) {
			const stringified = String(obj)
			if (/^\[object \w+\]$/.test(stringified)) {
				const protoCtorName = Object.getPrototypeOf(obj)?.constructor?.name
				if (typeof protoCtorName === 'string') return `#<${protoCtorName}>`
			}

			return Object.prototype.toString.call(obj)
		}

		return String(obj)
	} catch {
		return '[unknown]'
	}
}
