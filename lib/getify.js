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
	"use strict"
	function getValueFromPath(obj, [currentKey, ...restOfPath]) {
		return (defaultValue) => {
			try {
				// If we reached the end of the path without any exceptions,
				// then the path existed, and we return the object
				if (currentKey === undefined) {
					return obj
				}

				// If the current key is one of our symbols, call the appropriate
				// function to get the next key(s)
				if (typeof defaultOperations[currentKey] === 'function') {
					const result = defaultOperations[currentKey](obj)

					if (Array.isArray(result)) {
						return result.map(key => getValueFromPath(obj[key], restOfPath)(defaultValue))
					} else {
						return getValueFromPath(obj[result], restOfPath)(defaultValue)
					}
				}

				// If the object has the key as an own property, keep recursing through
				// the path. Otherwise, we can safely return the default value instead
				if (obj.hasOwnProperty(currentKey)) {
					return getValueFromPath(obj[currentKey], restOfPath)(defaultValue)
				} else {
					return defaultValue
				}
			}
			catch(e) {
				// Something went wrong, so let's return the default value
				return defaultValue
			}
		}
	}

	function getify(obj) {
		let path = []

		function handler(path) {
			return {
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

					const newPath = [...path, key]
					return getProxy(getValueFromPath(obj, newPath), newPath)
				}
			}
		}

		function getProxy(obj, path) {
			return new Proxy(obj, handler(path))
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
