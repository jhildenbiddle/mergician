<!-- omit in toc -->
# Mergician

[![NPM](https://img.shields.io/npm/v/mergician.svg?style=flat-square)](https://www.npmjs.com/package/mergician)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergician/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergician/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergician/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/mergician/badge)](https://www.jsdelivr.com/package/npm/mergician)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript)

Mergician is a flexible, light-weight utility for deep (recursive) merging/cloning of JavaScript objects.

What sets Mergician apart from similar utilities are the options provided for customizing the merge process. These options make it easy to filter properties, inspect and modify properties before/after merging, merge and sort arrays, and remove duplicate array items. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) are also handled properly, ensuring that getter/setter functions are retained and descriptor values are defined on the newly merged object.

- [Demo](https://codesandbox.io/s/mergician-demo-jcfft4?file=/index.js) (CodeSandbox.io)

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
- Sort arrays
- Remove duplicate array items ("dedup")
- Properly handle property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getters/setters) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
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
npm install mergician --save-dev
```

```javascript
// ES module
import mergician from 'mergician';
```

```javascript
// CommonJS module
const mergician = require('mergician');
```

<!-- omit in toc -->
#### CDN

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/css-vars-ponyfill) (below), [unpkg](https://unpkg.com/browse/css-vars-ponyfill/), and other CDN services that auto-publish npm packages.

```javascript
// ES module @ latest v1.x.x (see @ version in URL)
import mergician from 'https://cdn.jsdelivr.net/npm/mergician@1/dist/mergician.min.mjs';
```

```html
<!-- Global "mergician" @ latest v1.x.x (see @ version in URL) -->
<script src="https://cdn.jsdelivr.net/npm/mergician@1/dist/mergician.min.js">
```

<!-- omit in toc -->
#### Git

```bash
git clone https://github.com/jhildenbiddle/mergician.git
```

## Usage

There are three ways to call `mergician`:

```javascript
// Using the default options
const mergedObj = mergician(obj1, obj2, obj3);
```

```javascript
// Specifying custom options
const mergedObj = mergician({ /* Options */ })(obj1, obj2, obj3);
```

```javascript
// Using a named custom merge function
const customMerge = mergician({ /* Options */ });
const mergedObj = customMerge(obj1, obj2, obj3);
```

<!-- omit in toc -->
### Using the default options

To merge objects using the default [options](#options), pass two or more objects directly to `mergician`. A new object will be returned and the source object(s) will remain unmodified.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const clonedObj = mergician({}, obj1);
const mergedObj = mergician(obj1, obj2, obj3);

console.log(clonedObj); // { a: 1 }
console.log(clonedObj === obj1); // false
console.log(mergedObj); // { a: 1, b: [3, 3], c: { d: 2, e: 3 } }
```

<!-- omit in toc -->
### Specifying custom options

To specify merge [options](#options), pass a single object containing custom options to `mergician`. A new function with the options applied will be returned, which can then be immediately invoked by passing two or more objects to be merged.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const mergedObj = mergician({
    appendArrays: true,
    dedupArrays: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 1, b: [2, 3], c: { d: 2, e: 3 } }
```

<!-- omit in toc -->
### Using a named custom merge function

When merge [options](#options) are specified, the returned merge function can be assigned to a variable and reused, removing the need to pass the same options to `mergician` multiple times.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const customMerge = mergician({
    appendArrays: true,
    dedupArrays: true
});
const clonedObj = customMerge({}, obj2);
const mergedObj = customMerge(obj1, obj2, obj3);

console.log(clonedObj); // { b: [2], c: { d: 2 } }
console.log(mergedObj); // { a: 1, b: [2, 3], c: { d: 2, e: 3 } }
```

Like `mergician`, custom merge functions accept new [options](#options) passed as a single object and will return a new function with the options applied.

```javascript
const mergedObj = customMerge({
    onlyKeys: ['b']
})(obj1, obj2, obj3);

console.log(mergedObj); // { b: [2, 3] }
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
- [sortArrays](#sortarrays)
- [filter()](#filter)
- [beforeEach()](#beforeeach)
- [afterEach()](#aftereach)

<!-- omit in toc -->
### onlyKeys

Exclusive list of keys to be merged (others are skipped). Applies to top-level and nested keys.

- Type: `Array`
- Default: `[]`

```javascript
const obj1 = { a: 1 };
const obj2 = { b: { c: 2 } };
const obj3 = { b: { d: 3 } };

const mergedObj = mergician({
    onlyKeys: ['a', 'b', 'c']
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 1, b: { c: 2 } }
```

<!-- omit in toc -->
### skipKeys

List of keys to be skipped (others are merged). Applies to top-level and nested keys.

- Type: `Array`
- Default: `[]`

```javascript
const obj1 = { a: 1 };
const obj2 = { b: { c: 2 } };
const obj3 = { b: { d: 3 } };

const mergedObj = mergician({
    skipKeys: ['c']
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 1, b: { d: 3 } }
```

<!-- omit in toc -->
### onlyCommonKeys

Merge only keys found in multiple objects (ignore single occurrence keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const mergedObj = mergician({
    onlyCommonKeys: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 3, b: { c: 3 } }
```

<!-- omit in toc -->
### onlyUniversalKeys

Merge only keys found in all objects. For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const mergedObj = mergician({
    onlyUniversalKeys: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 3 }
```

<!-- omit in toc -->
### skipCommonKeys

Skip keys found in multiple objects (merge only single occurrence keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const mergedObj = mergician({
    skipCommonKeys: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { e: 3 }
```

<!-- omit in toc -->
### skipUniversalKeys

Skip keys found in all objects (merge only common keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: 1 };
const obj2 = { a: 2, b: { c: 2 } };
const obj3 = { a: 3, b: { c: 3, d: 3 }, e: 3 };

const mergedObj = mergician({
    skipUniversalKeys: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { b: { d: 3 }, e: 3 }
```

<!-- omit in toc -->
### appendArrays

Merge array values at the end of existing arrays. Arrays within arrays are not modified.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const mergedObj = mergician({
    appendArrays: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: [1, 1, 2, 2, 3, 3] }
```

<!-- omit in toc -->
### prependArrays

Merge array values at the beginning of existing arrays. Arrays within arrays are not modified.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const mergedObj = mergician({
    prependArrays: true
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: [3, 3, 2, 2, 1, 1] }
```

<!-- omit in toc -->
### dedupArrays

Remove duplicate array values in new merged object. Arrays within arrays are not modified.

- Type: `Boolean`
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const clonedObj = mergician({
    dedupArrays: true
})({}, obj1);
const mergedObj = mergician({
    appendArrays: true,
    dedupArrays: true
})(obj1, obj2, obj3);

console.log(clonedObj); // { a: [1] }
console.log(mergedObj); // { a: [1, 2, 3] }
```

<!-- omit in toc -->
### sortArrays

Sort array values in new merged object. Arrays within arrays are not modified.

When `true`, sorting is performed using the [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method's [default comparison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description) function. This can yield unexpected sorting results for those unfamiliar with how this comparison function works (e.g., `10` is sorted before `2`). Alternate comparison functions can be used ("natural" sorting, descending order, etc.) by assigning them to the `sortArrays` option.

- Type: `Boolean` or `Function`
- Default: `false`

```javascript
const obj1 = { a: [1, 4] };
const obj2 = { a: [2, 5] };
const obj3 = { a: [3, 6] };

const mergedAscending = mergician({
    appendArrays: true,
    sortArrays: true
})(obj1, obj2, obj3);
const mergedDescending = mergician({
    appendArrays: true,
    sortArrays(a, b) {
        return b - a;
    }
})(obj1, obj2, obj3);

console.log(mergedAscending); // { a: [1, 2, 3, 4, 5, 6] }
console.log(mergedDescending); // { a: [6, 5, 4, 3, 2, 1] }
```

<!-- omit in toc -->
### filter()

Callback used to conditionally merge or skip a property.

Return a "[truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)" value to merge or a "[falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)" value to skip. If no value is returned, merging/skipping will proceed based on other option values ([`onlyKeys`](#onlykeys), [`skipKeys`](#skipkeys), etc.)

- Type: `Function`
- Arguments:
  - **data**: Object containing merge data
    - **data.depth**: The nesting level of the key being processed
    - **data.key**: The object key being processed
    - **data.srcObj**: The object containing the source value
    - **data.srcVal**: The source object's property value
    - **data.targetObj**: The new merged object
    - **data.targetVal**: The new merged object's current property value

```javascript
const obj1 = { a: true };
const obj2 = { a: false, b: true };
const obj3 = { a: null, b: undefined, c: { d: 0, e: '' } };

const mergedObj = mergician({
    // Skip properties with non-zero "falsy" values
    filter({ srcVal }) {
        return Boolean(srcVal) || srcVal === 0;
    }
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: true, b: true, c: { d: 0 } }
```

<!-- omit in toc -->
### beforeEach()

Callback used for inspecting/modifying properties before merge.

If a value is returned, that value will be used as the new value to merge. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `srcVal` will be used.

- Type: `Function`
- Arguments:
  - **data**: Object containing merge data
    - **data.depth**: The nesting level of the key being processed
    - **data.key**: The object key being processed
    - **data.srcObj**: The object containing the source value
    - **data.srcVal**: The source object's property value
    - **data.targetObj**: The new merged object
    - **data.targetVal**: The new merged object's current property value

```javascript
const obj1 = { a: null };
const obj2 = { b: undefined };
const obj3 = { c: { d: '', e: 0 } };

const mergedObj = mergician({
    // Normalize non-zero "falsy" values to be false
    beforeEach({ srcVal }) {
        if (srcVal !== 0 && !Boolean(srcVal)) {
            return false;
        }
    }
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: false, b: false, c: { d: false, e: 0 } }
```

<!-- omit in toc -->
### afterEach()

Callback used for inspecting/modifying properties after merge.

If a value is returned, that value will be used as the new merged value. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `mergeVal` will be used.

- Type: `Function`
- Arguments:
  - **data**: Object containing merge data
    - **data.depth**: The nesting level of the key processed
    - **data.key**: The object key processed
    - **data.mergeVal**: The new merged value
    - **data.srcObj**: The object containing the source value
    - **data.targetObj**: The new merged object

```javascript
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: { d: 3, e: true } };

const mergedObj = mergician({
    // Add 1 to all numbers
    afterEach({ mergeVal }) {
        if (typeof mergeVal === 'number') {
            return mergeVal + 1;
        }
    },
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 2, b: 3, c: { d: 4, e: true } }
```

## Support

- Create a [Github issue](https://github.com/jhildenbiddle/mergician/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergician) or 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript) to spread the word and support the project!

## License

This project is licensed under the MIT License. See the [MIT LICENSE](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
