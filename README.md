# Getify

A utility to grab nested values from objects. Like lodash's `_.get`, or countless other variants. Getify uses [ES6 proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to enable usage without string or array paths.

[![NPM Version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/johnste/getify.svg?branch=master)](https://travis-ci.org/johnste/getify)
[![Dependency Status](https://david-dm.org/johnste/getify.svg)](https://david-dm.org/johnste/getify)
[![devDependency Status](https://david-dm.org/johnste/getify/dev-status.svg)](https://david-dm.org/johnste/getify#info=devDependencies)

## How to use

```javascript
import getify from 'getify'

const obj = {
  a: {
  	b: ['c', 'd'],
  	e: ['f', 'g']
  }
}

// Get existing value from object
getify(obj).a.b[1]() // returns "d"

// Get undefined if path doesn't exist
getify(obj).nothing.here() // returns undefined

// Use a default value if path doesn't exist
getify(obj).nothing.here('oops!') // returns "oops!"
```

## Advanced usage

```javascript
const obj = {
  a: {
  	b: ['c', 'd', 'e'],
  	f: {0: 'g', 1: 'h'},
  }
}

// Save intermediate values paths (object destructuring works fine)
const { f, b } = getify(obj).a
b[1]() // returns 'd'
f[0]() // returns 'g'

// Use getify.all to get all properties on the current path
getify(obj).a[getify.all][1]() // returns ['d', 'h']
getify(obj).a[getify.all]() // returns [['c', 'd', 'e'], {0: 'g', 1: 'h'}]

// Use getify.first to get first property on the current path
getify(obj).a[getify.first][1]() // returns 'd'

// Use getify.first to get first property on the current path
getify(obj).a[getify.last][1]() // returns 'h'

// Or combine them
getify(obj).a[getify.all][getify.last]() // returns ['e', 'h']
```

## Browser and server support

ES6 Proxy is currently supported by the latest stable version of Chrome, Firefox and Edge. It's also supported by Node 6.x. Safari doesn't support Proxies.

[ES6 compatibility table: Proxy](http://kangax.github.io/compat-table/es6/#test-Proxy)

## Install

`npm install getify`

## API

### Get a path from a value

`getify(value).any.path['here'][3](defaultValue)`

`value` is any valid javascript value: objects, strings, arrays, numbers. The path is any valid javascript path. If the path is not available in the object, getify will return `undefined` or the default value. If the path exists and contains the value `undefined`, that will be returned regardless of the default value provided.

### Symbols

`getify.all` - get all keys on the current object. If there are no keys, this will result in an empty array

`getify.first` - get the first key on the current object. The key is the first one returned from `Object.keys`

`getify.last` - get the last key on the current object. The key is the last one returned from `Object.keys`

[npm-image]: https://img.shields.io/npm/v/getify.svg
[npm-url]: https://npmjs.org/package/getify

## A note on performance

Currently Getify is around 1-3 times slower than lodash `_.get` for simpler use cases in Chrome, and around 15-20 times slower in Firefox. Currently using getify is a two step process where the accessing paths on the Getified object creates a path in an array. When you execute the returned function Getify finds the nested value in the object in a way that's very close to how _.get works. I've been fiddling around trying to make this process go faster but my attempts thus far have had worse performance than the current one.
