(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory)
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory()
	} else {
		// Browser globals (root is window)
		root.getify = factory()
  }
}(this, function () {

	function getValueFromPath(obj, [current, ...restOfPath]) {
		return (val) => {
			try {
				if (current === undefined) {
					return obj !== undefined ? obj : val
				}

				if (typeof defaultOperations[current] === 'function') {
					const result = defaultOperations[current](obj)

					if (Array.isArray(result)) {
						return result.map(key => getValueFromPath(obj[key], restOfPath)(val))
					} else {
						return getValueFromPath(obj[result], restOfPath)(val)
					}

				}

				return getValueFromPath(obj[current], restOfPath)(val)
			}
			catch(e) {
				return val
			}
		}
	}

	function getify(obj) {
		let path = []

		const handler = {
			get: function(target, key){
				// If the prototype request it, we return it, since
				// not returning it causes issues while outputting stuff
				// to console, for example
				if (obj[key] && obj[key].isPrototypeOf(obj)) {
					return obj[key]
				}

				if (key === Symbol.toStringTag) {
					return 'Getify Object'
				}

				path = [...path, key]
				return getProxy(getValueFromPath(obj, path))
			}
		}

		function getProxy(obj, path) {
			return new Proxy(obj, handler)
		}

		// For consistency's sake, we return the root object as a function
		return getProxy(getValueFromPath(obj, path), path)
	}

	// Create utility symbols
	getify.all = Symbol("getify.all")
	getify.first = Symbol("getify.first")
	getify.last = Symbol("getify.last")

	const defaultOperations = {
		[getify.all]: obj =>  Object.keys(obj),
		[getify.first]: obj => Object.keys(obj)[0],
		[getify.last]: obj => {
			const keys = Object.keys(obj)
			return keys[keys.length - 1]
		}
	}

	return getify
}));