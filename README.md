# Getify

Getify is a utility to grab nested values from objects. Like lodash's `_.get`, or countless other variants. Getify uses [ES6 proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to enable a syntax that's closer to what you would get if you didn't use a library at all.

## Install

`npm install getify`

## How to use

```
import getify from 'getify'
const obj = {
  deeply: {
    nested: ['the', 'values', 'are', 'here']
  }
}
const value = getify(obj).deeply.nested[1](); // value == "values"
const missing = getify(obj).cant.find.anything.here() // missing === undefined
const defaultValue = getify(obj).nothing.here.as.well('oops!') // missing === "oops!"
```

## API

### `getify(obj).any.path['here'][3](optionalDefaultValue)`

`obj` is any valid javascript value: objects, strings, arrays, numbers. The path is any valid javascript path. If the path is not available in the object, getify will return `undefined` or the optionally provided default value.

