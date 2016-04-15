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

	function getValue(obj, nesting, hasOwn = true) {
		return (defaultValue) => {
      if (nesting) {
        obj = baseFlatten(obj, nesting - 1, val => val === MISSING_PROPERTY ? defaultValue : val)
      }
      return (hasOwn) ? obj : defaultValue;
		}
	}

	function getify(obj) {
		return getProxy(getValue(obj), obj)
	}

  function getProxy(accessor, obj, nesting) {
    return new Proxy(accessor, handler(obj, nesting))
  }

  function getOne(obj, key) {
    if (!obj) {
      return {}
    }

    if (typeof operators[key] === 'function') {
      key = operators[key](obj)
    }

    if (Array.isArray(key)) {
      const val = key.map(key => obj[key])
      return { val, multiple: true, hasOwn: true }
    } else {
      const val = obj[key]
      let hasOwn = obj.hasOwnProperty(key)
      return { val, hasOwn }
    }
  }

  function baseFlatten(array, depth = 1, fn) {
    if (depth <= 0) {
      return array.map(fn);
    }

    if (depth > 0) {
      return array.map(subArray => baseFlatten(subArray, depth - 1, fn));
    }
  }

  function handler(obj, nesting = 0) {
    return {
      get: function(target, key){
        var multiple = false

        function getVal(object) {
          const result = getOne(object, key)
          if (result.multiple) {
            multiple = true
          }
          return result.hasOwn ? result.val : MISSING_PROPERTY
        }

        // If the prototype request it, we return it, since
        // not returning it causes issues while outputting stuff
        // to console, for example

        if (obj && typeof obj === 'object' && obj[key] && obj[key].isPrototypeOf(obj)) {
          return obj[key]
        }

        if (nesting) {

          const val = baseFlatten(obj, nesting - 1, getVal);
          if (multiple) {
            nesting += 1
          }
          return getProxy(getValue(val, nesting), val, nesting)

        } else {
          const { val, hasOwn, multiple } = getOne(obj, key, nesting)
          if (multiple)       {
            nesting += 1
          }
          return getProxy(getValue(val, nesting, hasOwn), val, nesting)
        }
      }
    }
  }

  // Symbol for declaring missing properties
  const MISSING_PROPERTY = Symbol("getify.MISSING_PROPERTY")

	// Create utility symbols
	getify.all = Symbol("getify.all")
	getify.first = Symbol("getify.first")
	getify.last = Symbol("getify.last")

	const operators = {
		[getify.all]: obj => Object.keys(obj),
		[getify.first]: obj => Object.keys(obj)[0],
		[getify.last]: obj => {
			const keys = Object.keys(obj)
			return keys[keys.length - 1]
		}
	}

	return getify
}));
