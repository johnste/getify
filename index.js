function getValueFromPath(obj, path) {
	return function() {
		try {
			return path.reduce((node, v) => node[v], obj)
		}
		catch(e) {
			return
		}
	}
}

export default function getify(obj) {
	const path = []
	function handler(path) {
		return {
		    get: function(target, key){
		    	if (typeof key == 'symbol' || key == '__proto__') {
		    		return target[key]
		    	}

		    	// Add key onto path
		    	const newPath = [...path, key]

		    	return getProxy(getValueFromPath(obj, newPath), newPath)
		    }
		}
	}

	function getProxy(obj, path) {
		return new Proxy(obj, handler(path))
	}

	// For consistency's sake, we return the root object as a function
	function getRoot() {
		return obj;
	}

	return getProxy(getRoot , path)
}
