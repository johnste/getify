# Getify

Getify is a utility to grab nested values from objects. Like lodash's `_.get`, or countless other variants. Getify uses [ES6 proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to enable a syntax that's closer to what you would get if you didn't use a library at all.

[![NPM Version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/johnste/getify.svg?branch=master)](https://travis-ci.org/johnste/getify)

## How to use

```
import getify from 'getify'

const obj = {
  deeply: {
    nested: ['the', 'values', 'are', 'here']
  }
}

const value = getify(obj).deeply.nested[1](); //  === "values"

const missing = getify(obj).cant['find'].anything.here() //  === undefined

const defaultValue = getify(obj).nothing.here.as.well('oops!') //  === "oops!"
```

## Browser and server support

ES6 Proxies are currently supported by the latest stable version of Chrome, Firefox and Edge. It is not supported by Node 5.x or Safari yet.

[ES6 compatibility table: Proxy](http://kangax.github.io/compat-table/es6/#test-Proxy)

## Install

`npm install getify`

## API

### `getify(obj).any.path['here'][3](optionalDefaultValue)`

`obj` is any valid javascript value: objects, strings, arrays, numbers. The path is any valid javascript path. If the path is not available in the object, getify will return `undefined` or the optionally provided default value.

[npm-image]: https://img.shields.io/npm/v/getify.svg
[npm-url]: https://npmjs.org/package/getify
