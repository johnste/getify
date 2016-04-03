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

	function getPath(obj, path = []) {
		return (defaultValue) => {
			let index = 0
      let hasOwn = true
      const length = path.length

      while (obj != null && index < length) {
        const key = path[index++]

        // If the current key is one the getify operator symbols, call
        // the operator function to get the result
        if (typeof operators[key] === 'function') {
          return operators[key](obj, path.slice(index), defaultValue)
        }

        hasOwn = obj.hasOwnProperty(key)
        obj = obj[key]
      }
      return (index === length && hasOwn) ? obj : defaultValue;
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
					return getProxy(getPath(obj, newPath), newPath)
				}
			}
		}

		function getProxy(obj, path) {
			return new Proxy(obj, handler(path))
		}

		// For consistency's sake, we return the root object as a function
		return getProxy(getPath(obj), path)
	}

	// Create utility symbols
	getify.all = Symbol("getify.all")
	getify.first = Symbol("getify.first")
	getify.last = Symbol("getify.last")

	const operators = {
		[getify.all]: (obj, path, defaultValue) => {
      return Object.keys(obj).map(key => getPath(obj[key], path)(defaultValue))
    },
		[getify.first]: (obj, path, defaultValue) => {
      const firstKey = Object.keys(obj)[0]
      return getPath(obj[firstKey], path)(defaultValue)
    },
		[getify.last]: (obj, path, defaultValue) => {
			const keys = Object.keys(obj)
			const lastKey = keys[keys.length - 1]
      return getPath(obj[lastKey], path)(defaultValue)
		}
	}

	return getify
}));
