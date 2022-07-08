# mergeDeep <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/mergedeep.svg?style=flat-square)](https://www.npmjs.com/package/mergedeep)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergedeep/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergedeep/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergedeep/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=css,developers,frontend,javascript)

mergeDeep is a flexible, light-weight utility for deep (recursive) merging/cloning of JavaScript objects.

What sets mergeDeep apart from similar utilities are the options provided for customizing the merge process. These options make it easy to filter properties, inspect and modify properties before and/or after merging, merge arrays, and remove duplicate array items. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getter/setter functions) are also handled properly, ensuring existing functions are copied instead of their returned values and for new functions to be defined if needed.

**Note:** For simple operations that do not require the flexibility of this library, consider using native methods like [structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) for deep merging/cloning and the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) or [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) for shallow merging/cloning.

---

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Contact](#contact)
- [License](#license)

---

## Features

- Deep merge/clone JavaScript objects
- Filter keys/values
- Inspect and modify keys/values
- Merge arrays
- Remove duplicate array items
- Handles property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getters/setters) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- Returns new object / does not modify sources (immutable)

#### Platform Support <!-- omit in toc -->

| Node | IE   | Edge | Chrome | Firefox | Safari |
| ---- | ---- | ---- | ------ | ------- | ------ |
| 10+  | -    | 16+  | 61+    | 60+     | 10.1+  |

## Installation

#### NPM <!-- omit in toc -->

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

#### CDN <!-- omit in toc -->

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/css-vars-ponyfill) (below), [unpkg](https://unpkg.com/browse/css-vars-ponyfill/), and other CDN services that auto-publish npm packages or GitHub repos.

```html
<!-- Global "mergeDeep" @ latest v1.x.x (see @ version in URL) -->
<script src="https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.js">
```

```javascript
// ES module @ latest v1.x.x (see @ version in URL)
import mergeDeep from 'https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.mjs';
```

#### Git <!-- omit in toc -->

```bash
git clone https://github.com/jhildenbiddle/mergedeep.git
```

## Usage

There are three ways to call `mergeDeep`:

```javascript
// Using the default options
const merged1 = mergeDeep(obj1, obj2, obj3);

// Specifying custom options
const merged2 = mergeDeep({ /* Options */ })(obj1, obj2, obj3);

// Storing and then calling a custom merge function
const customMergeFunction = mergeDeep({ /* Options */ });
const merged3 = customMergeFunction(obj1, obj2, obj3);
```

### Using the default options <!-- omit in toc -->

To merge objects using the default [options](#options), pass two or more objects directly to `mergeDeep`. A new object will be returned and the source object(s) will remain unmodified.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: true } };
const obj3 = { b: [3, 3], c: { e: false } };

const cloned = mergeDeep({}, obj1);
const merged = mergeDeep(obj1, obj2, obj3);

console.log(cloned); // { a: 1 }
console.log(cloned === obj1); // false
console.log(merged); // { a: 1, b: [3, 3], c: { d: true, e: false } }
```

### Specifying custom options <!-- omit in toc -->

To specify merge [options](#options), pass a single object containing custom option to `mergeDeep`. A new function with the options applied will be returned, which can then be immediately invoked by passing one or more objects to be merged.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: true } };
const obj3 = { b: [3, 3], c: { e: false } };

const merged = mergeDeep({
    skipKeys: ['c'],
    appendArrays: true,
    dedupArrays: true
})(obj1, obj2, obj3);

console.log(merged); // { a: 1, b: [2, 3] }
```

### Storing and then calling a custom merge function <!-- omit in toc -->

When merge [options](#options) are specified, the returned merge function can be assigned to a variable and reused, removing the need to pass the same options to `mergeDeep` multiple times.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: true } };
const obj3 = { b: [3, 3], c: { e: false } };

const customMergeFunction = mergeDeep({
    skipKeys: ['c'],
    appendArrays: true,
    dedupArrays: true
});
const cloned = customMergeFunction({}, obj2);
const merged = customMergeFunction(obj1, obj2, obj3);

console.log(cloned); // { b: [2] }
console.log(merged); // { a: 1, b: [2, 3] }
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

### onlyKeys <!-- omit in toc -->

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

### skipKeys <!-- omit in toc -->

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

### onlyCommonKeys <!-- omit in toc -->

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

### onlyUniversalKeys <!-- omit in toc -->

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

### skipCommonKeys <!-- omit in toc -->

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

### skipUniversalKeys <!-- omit in toc -->

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

### appendArrays <!-- omit in toc -->

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

### prependArrays <!-- omit in toc -->

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

### dedupArrays <!-- omit in toc -->

Remove duplicate values from merged arrays. Requires either [`appendArrays`](#appendarrays) or [`prependArrays`](#prependarrays) to be `true`.

- Type: Boolean
- Default: `false`

```javascript
const obj1 = { a: [1, 1] };
const obj2 = { a: [2, 2] };
const obj3 = { a: [3, 3] };

const merged = mergeDeep({
    appendArrays: true,
    dedupArrays: true
})(obj1, obj2, obj3);

console.log(merged); // { a: [1, 2, 3] }
```

### filter() <!-- omit in toc -->

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

### beforeEach() <!-- omit in toc -->

Callback used for inspecting/modifying properties before merge.

If a value is returned, that value will be used as the new value to merge. If no value is returned, the unmodified `srcVal` will be used.

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

### afterEach() <!-- omit in toc -->

Callback used for inspecting/modifying properties after merge.

If a value is returned, that value will be used as the new merged value. If no value is returned, the unmodified `mergeVal` will be used.

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

## Contact

- Create a [Github issue](https://github.com/jhildenbiddle/mergedeep/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergedeep) or ❤️ [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=developers,javascript) to support the project!

## License

This project is licensed under the MIT License. See the [MIT LICENSE](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
