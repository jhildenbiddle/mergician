# mergeDeep <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/mergedeep.svg?style=flat-square)](https://www.npmjs.com/package/mergedeep)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergedeep/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergedeep/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergedeep/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/mergedeep/badge)](https://www.jsdelivr.com/package/npm/mergedeep)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=developers,frontend,javascript)

mergeDeep is a flexible, light-weight utility for deep (recursive) merging/cloning of JavaScript objects.

What sets mergeDeep apart from similar utilities are the options provided for customizing the merge process. These options make it easy to filter properties, inspect and modify properties before/after merging, merge arrays, and remove duplicate array items. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) are also handled properly, ensuring that getter/setter functions and descriptor values are defined properly on the newly merged object.

- [Demo](https://codesandbox.io/s/mergedeep-demo-jcfft4?file=/index.js) (CodeSandbox.io)

---

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Support](#support)
- [License](#license)

---

## Features

- Deep merge/clone JavaScript objects
- Filter properties
- Inspect and modify properties
- Merge arrays
- Remove duplicate array items
- Properly handle property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getters/setters) and [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) values
- Returns new object without modifying source objects (immutable)

<!-- omit in toc -->
#### Platform Support

| Node | IE   | Edge | Chrome | Firefox | Safari |
| ---- | ---- | ---- | ------ | ------- | ------ |
| 10+  | -    | 16+  | 61+    | 60+     | 10.1+  |

## Installation

<!-- omit in toc -->
#### NPM

```bash
npm install mergedeep --save-dev
```

```javascript
// CommonJS module
const mergeDeep = require('mergedeep');
```

```javascript
// ES module
import mergeDeep from 'mergedeep';
```

<!-- omit in toc -->
#### CDN

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/css-vars-ponyfill) (below), [unpkg](https://unpkg.com/browse/css-vars-ponyfill/), and other CDN services that auto-publish npm packages or GitHub repos.

```html
<!-- Global "mergeDeep" @ latest v1.x.x (see @ version in URL) -->
<script src="https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.js">
```

```javascript
// ES module @ latest v1.x.x (see @ version in URL)
import mergeDeep from 'https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.mjs';
```

<!-- omit in toc -->
#### Git

```bash
git clone https://github.com/jhildenbiddle/mergedeep.git
```

## Usage

There are three ways to call `mergeDeep`:

```javascript
// Using the default options
const merged = mergeDeep(obj1, obj2, obj3);
```

```javascript
// Specifying custom options
const merged = mergeDeep({ /* Options */ })(obj1, obj2, obj3);
```

```javascript
// Using a named custom merge function
const customMergeFunction = mergeDeep({ /* Options */ });
const merged = customMergeFunction(obj1, obj2, obj3);
```

<!-- omit in toc -->
### Using the default options

To merge objects using the default [options](#options), pass two or more objects directly to `mergeDeep`. A new object will be returned and the source object(s) will remain unmodified.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const cloned = mergeDeep({}, obj1);
const merged = mergeDeep(obj1, obj2, obj3);

console.log(cloned); // { a: 1 }
console.log(cloned === obj1); // false
console.log(merged); // { a: 1, b: [3, 3], c: { d: 2, e: 3 } }
```

<!-- omit in toc -->
### Specifying custom options

To specify merge [options](#options), pass a single object containing custom option to `mergeDeep`. A new function with the options applied will be returned, which can then be immediately invoked by passing one or more objects to be merged.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const merged = mergeDeep({
    appendArrays: true,
    dedupArrays: true
})(obj1, obj2, obj3);

console.log(merged); // { a: 1, b: [2, 3], c: { d: 2, e: 3 } }
```

<!-- omit in toc -->
### Using a named custom merge function

When merge [options](#options) are specified, the returned merge function can be assigned to a variable and reused, removing the need to pass the same options to `mergeDeep` multiple times.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const customMergeFunction = mergeDeep({
    appendArrays: true,
    dedupArrays: true
});
const cloned = customMergeFunction({}, obj2);
const merged = customMergeFunction(obj1, obj2, obj3);

console.log(cloned); // { b: [2], c: { d: 2 } }
console.log(merged); // { a: 1, b: [2, 3], c: { d: 2, e: 3 } }
```

## Options

- [onlyKeys](#onlykeys)
- [skipKeys](#skipkeys)
- [onlyCommonKeys](#onlycommonkeys)
- [onlyUniversalKeys](#onlyuniversalkeys)
- [skipCommonKeys](#skipcommonkeys)
- [skipUniversalKeys](#skipuniversalkeys)
- [appendArrays](#appendarrays)
- [prependArrays](#prependarrays)
- [dedupArrays](#deduparrays)
- [filter()](#filter)
- [beforeEach()](#beforeeach)
- [afterEach()](#aftereach)

<!-- omit in toc -->
### onlyKeys

Exclusive list of keys to be merged (others are skipped). Applies to top-level and nested keys.

- Type: Array
- Default: `[]`

```javascript
const obj1 = { a: 1 };
const obj2 = { b: { c: 2 } };
const obj3 = { b: { d: 3 } };

const merged = mergeDeep({
    onlyKeys: ['a', 'b', 'c']
})(obj1, obj2, obj3);

console.log(merged); // { a: 1, b: { c: 2 } }
```

<!-- omit in toc -->
### skipKeys

List of keys to be skipped (others are merged). Applies to top-level and nested keys.

- Type: Array
- Default: `[]`

```javascript
const obj1 = { a: 1 };
const obj2 = { b: { c: 2 } };
const obj3 = { b: { d: 3 } };

const merged = mergeDeep({
    skipKeys: ['c']
})(obj1, obj2, obj3);

console.log(merged); // { a: 1, b: { d: 3 } }
```

<!-- omit in toc -->
### onlyCommonKeys

Merge only keys found in multiple objects (ignore single occurrence keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const merged = mergeDeep({
    onlyCommonKeys: true
})(obj1, obj2, obj3);

console.log(merged); // { a: 3, b: { c: 3 } }
```

<!-- omit in toc -->
### onlyUniversalKeys

Merge only keys found in all objects. For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const merged = mergeDeep({
    onlyUniversalKeys: true
})(obj1, obj2, obj3);

console.log(merged); // { a: 3 }
```

<!-- omit in toc -->
### skipCommonKeys

Skip keys found in multiple objects (merge only single occurrence keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const merged = mergeDeep({
    skipCommonKeys: true
})(obj1, obj2, obj3);

console.log(merged); // { e: 3 }
```

<!-- omit in toc -->
### skipUniversalKeys

Skip keys found in all objects (merge only common keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const merged = mergeDeep({
    skipUniversalKeys: true
})(obj1, obj2, obj3);

console.log(merged); // { b: { d: 3 }, e: 3 }
```

<!-- omit in toc -->
### appendArrays

Merge array values at the end of existing arrays.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const merged = mergeDeep({
    appendArrays: true
})(obj1, obj2, obj3);

console.log(merged); // { a: [1, 1, 2, 2, 3, 3] }
```

<!-- omit in toc -->
### prependArrays

Merge array values at the beginning of existing arrays.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const merged = mergeDeep({
    prependArrays: true
})(obj1, obj2, obj3);

console.log(merged); // { a: [3, 3, 2, 2, 1, 1] }
```

<!-- omit in toc -->
### dedupArrays

Remove duplicate values from merged arrays.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const cloned = mergeDeep({
    appendArrays: true,
    dedupArrays: true
})({}, obj1);
const merged = mergeDeep({
    appendArrays: true,
    dedupArrays: true
})(obj1, obj2, obj3);

console.log(cloned); // { a: [1] }
console.log(merged); // { a: [1, 2, 3] }
```

<!-- omit in toc -->
### filter()

Callback used to conditionally merge or skip a property.

Return a "truthy" value to merge or a "falsy" value to skip. If no value is returned, merging/skipping will proceed based on other option values ([`onlyKeys`](#onlykeys), [`skipKeys`](#skipkeys), etc.)

- Type: Function
- Arguments:
  - **srcVal:** The source object's property value
  - **targetVal:** The new merged object's current property value
  - **key:** The object key being processed
  - **srcObj:** The object containing the source value
  - **targetObj:** The new merged object
  - **depth:** The nesting level of the key being processed

```javascript
const obj1 = { a: true };
const obj2 = { a: false, b: true };
const obj3 = { a: null, b: undefined, c: { d: true, e: '' } };

const merged = mergeDeep({
    // Skip properties with falsy values
    filter(srcVal, targetVal, key, srcObj, targetObj, depth) {
        return Boolean(srcVal);
    }
})(obj1, obj2, obj3);

console.log(merged); // { a: true, b: true, c: { d: true } }
```

<!-- omit in toc -->
### beforeEach()

Callback used for inspecting/modifying properties before merge.

If a value is returned, that value will be used as the new value to merge. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `srcVal` will be used.

- Type: Function
- Arguments:
  - **srcVal:** The source object's property value
  - **targetVal:** The new merged object's current property value
  - **key:** The object key being processed
  - **srcObj:** The object containing the source value
  - **targetObj:** The new merged object
  - **depth:** The nesting level of the key being processed

```javascript
const obj1 = { a: null };
const obj2 = { b: undefined };
const obj3 = { c: { d: '', e: 0 } };

const merged = mergeDeep({
    // Normalize non-zero "falsy" values to be false
    beforeEach(srcVal, targetVal, key, srcObj, targetObj, depth) {
        if (srcVal !== 0 && !Boolean(srcVal)) {
            return false;
        }
    }
})(obj1, obj2, obj3);

console.log(merged); // { a: false, b: false, c: { d: false, e: 0 } }
```

<!-- omit in toc -->
### afterEach()

Callback used for inspecting/modifying properties after merge.

If a value is returned, that value will be used as the new merged value. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `mergeVal` will be used.

- Type: Function
- Arguments:
  - **mergeVal:** The new merged value
  - **key:** The object key processed
  - **mergeObj:** The new merged object
  - **depth:** The nesting level of the key processed

```javascript
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: { d: 3, e: true } };

const merged = mergeDeep({
    // Add 1 to all numbers
    afterEach(mergeVal, key, mergeObj, depth) {
        if (typeof mergeVal === 'number') {
            return mergeVal + 1;
        }
    },
})(obj1, obj2, obj3);

console.log(merged); // { a: 2, b: 3, c: { d: 4, e: true } }
```

## Support

- Create a [Github issue](https://github.com/jhildenbiddle/mergedeep/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergedeep) or 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=developers,frontend,javascript) to spread the word and support the project!

## License

This project is licensed under the MIT License. See the [MIT LICENSE](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
