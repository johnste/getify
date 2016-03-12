(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.getify = factory();
  }
}(this, function () {

	function getify(obj) {
		const path = []

		function getValueFromPath(obj) {
			return (val) => {
				try {
					return path.reduce((node, v) => node[v], obj) || val
				}
				catch(e) {
					return val
				}
			}
		}

		function handler() {
			return {
				get: function(target, key){
					if (typeof key == 'symbol' || key == '__proto__') {
						return target[key]
					}

					path.push(key)
					return getProxy(getValueFromPath(obj))
				}
			}
		}

		function getProxy(obj, path) {
			return new Proxy(obj, handler())
		}

		// For consistency's sake, we return the root object as a function
		return getProxy(() => obj, path)
	}

	// Just return a value to define the module export.
	// This example returns an object, but the module
	// can return a function as the exported value.
	return getify;
}));