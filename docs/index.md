# Mergician

[![NPM](https://img.shields.io/npm/v/mergician.svg?style=flat-square)](https://www.npmjs.com/package/mergician)
[![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/jhildenbiddle/mergician/test.yml?branch=main&label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergician/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergician/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/mergician/badge)](https://www.jsdelivr.com/package/npm/mergician)
[![Sponsor this project](https://img.shields.io/static/v1?style=flat-square&label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/jhildenbiddle)
[![Add a star on GitHub](https://img.shields.io/github/stars/jhildenbiddle/mergician?style=social)](https://github.com/jhildenbiddle/mergician)

Mergician is a uniquely flexible and light-weight utility for cloning and deep (recursive) merging of JavaScript objects.

Unlike native methods and other utilities, Mergician faithfully clones and merges objects by properly handling [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) values, [accessor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) functions, and prototype properties while offering advanced options for customizing the clone/merge process.

?> Version 2 contains new features and breaking changes (see the [Changelog](changelog) for details). Documentation for version 1 is available [on GitHub](https://github.com/jhildenbiddle/mergician/blob/v1.0.3/docs/index.md).

## Features

- Deep (recursive) clone/merge JavaScript objects
- Generates new object without modifying source object(s)
- Clone/merge enumerable and non-enumerable properties
- Clone/merge property [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) values
- Retain, skip, or convert [accessor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) functions to static values
- Inspect, filter, and modify properties
- Merge, skip, or hoist prototype properties
- Merge or skip key intersections, unions, and differences
- Merge, sort, and remove duplicate array items
- IntelliSense / code hinting support
- TypeScript support
- Lightweight (2k min+gzip) and dependency-free

**Platform Support**

<img src="assets/img/node.svg" alt=""> <span>Node 10+</span>
<br>
<img src="assets/img/chrome.svg" alt=""> <span>Chrome 61+</span>
<br>
<img src="assets/img/edge.svg" alt=""> <span>Edge 16+</span>
<br>
<img src="assets/img/firefox.svg" alt=""> <span>Firefox 60+</span>
<br>
<img src="assets/img/safari.svg" alt=""> <span>Safari 10.1+</span>

## Examples

Basic object cloning using default options:

```javascript
// ES module shown. CommonJS module also available (see below).
import { mergician } from 'mergician';

const obj1 = { a: [1, 1], b: { c: 1, d: 1 } };
const clonedObj = mergician({}, obj1);

// Results
console.log(clonedObj); // { a: [1, 1], b: { c: 1, d: 1 } }
console.log(clonedObj === obj1); // false
console.log(clonedObj.a === obj1.a); // false
console.log(clonedObj.b === obj1.b); // false
```

Advanced object merging using custom options:

```javascript
// ES module shown. CommonJS module also available (see below).
import { mergician } from 'mergician';

const obj1 = { a: [1, 1], b: { c: 1, d: 1 } };
const obj2 = { a: [2, 2], b: { c: 2 } };
const obj3 = { e: 3 };

const mergedObj = mergician({
  skipKeys: ['d'],
  appendArrays: true,
  dedupArrays: true,
  filter({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
    if (key === 'e') {
      targetObj['hello'] = 'world';
      return false;
    }
  }
})(obj1, obj2, obj3);

// Result
console.log(mergedObj); // { a: [1, 2], b: { c: 2 }, hello: 'world' }
```

## Installation

**NPM**

```bash
npm install mergician
```

```javascript
// ES module
import { mergician } from 'mergician';
```

```javascript
// CommonJS module
const { mergician } = require('mergician');
```

**CDN**

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/mergician) (below), [unpkg](https://unpkg.com/browse/mergician/), and other CDN services that auto-publish npm packages.

?> Note the `@` version lock in the URLs below. This prevents breaking changes in future releases from affecting your project and is therefore the safest method of loading dependencies from a CDN. When a new major version is released, you will need to manually update your CDN URLs by changing the version after the `@` symbol.

```javascript
// ES module @ latest v2.x.x
import { mergician } from 'https://cdn.jsdelivr.net/npm/mergician@2';
```

## Usage

### Using the default options <!-- {docsify-ignore} -->

To merge objects using the default [options](#options), pass two or more objects to `mergician()`. A new object will be returned and the source object(s) will remain unmodified.

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

### Specifying custom options <!-- {docsify-ignore} -->

To specify merge [options](#options), pass a single object containing custom options to `mergician()`. A custom merge function with the options applied will be returned, which can then be immediately invoked by passing two or more objects to be merged.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const clonedObj = mergician({
  skipKeys: ['c']
})({}, obj2);

const mergedObj = mergician({
  appendArrays: true,
  dedupArrays: true
})(obj1, obj2, obj3);

console.log(clonedObj); // { b: [2, 2] };
console.log(mergedObj); // { a: 1, b: [2, 3], c: { d: 2, e: 3 } }
```

### Using a named custom merge function <!-- {docsify-ignore} -->

To create a reusable custom merge function, pass a single [options](#options) object to mergician and assign a name to the function returned. This new function behaves exactly as `mergician()` does but with its default values set to the the custom options used to create it.

```javascript
const obj1 = { a: 1 };
const obj2 = { b: [2, 2], c: { d: 2 } };
const obj3 = { b: [3, 3], c: { e: 3 } };

const customMerge = mergician({
  appendArrays: true,
  dedupArrays: true
});

const clonedObj = customMerge({}, obj2);
const mergedObj1 = customMerge(obj1, obj2, obj3);
const mergedObj2 = customMerge({
  skipKeys: ['c']
})(obj1, obj2, obj3);

console.log(clonedObj); // { b: [2], c: { d: 2 } }
console.log(mergedObj1); // { a: 1, b: [2, 3], c: { d: 2, e: 3 } }
console.log(mergedObj2); // { a: 1, b: [2, 3] }
```

## Options

**Keys**

<!-- no toc -->

- [onlyKeys](#onlykeys)
- [skipKeys](#skipkeys)
- [onlyCommonKeys](#onlycommonkeys)
- [onlyUniversalKeys](#onlyuniversalkeys)
- [skipCommonKeys](#skipcommonkeys)
- [skipUniversalKeys](#skipuniversalkeys)

**Values**

- [invokeGetters](#invokegetters)
- [skipSetters](#skipsetters)

**Arrays**

- [appendArrays](#appendarrays)
- [prependArrays](#prependarrays)
- [dedupArrays](#deduparrays)
- [sortArrays](#sortarrays)

**Prototype**

- [hoistEnumerable](#hoistenumerable)
- [hoistProto](#hoistproto)
- [skipProto](#skipproto)

**Callbacks**

- [filter()](#filter)
- [beforeEach()](#beforeeach)
- [afterEach()](#aftereach)
- [onCircular()](#oncircular)

### onlyKeys

Exclusive list of keys to be merged (others are skipped). Applies to top-level and nested keys.

- Type: `array`
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

### skipKeys

List of keys to be skipped (others are merged). Applies to top-level and nested keys.

- Type: `array`
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

### onlyCommonKeys

Merge only keys found in multiple objects (skip single occurrence keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `boolean`
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

### onlyUniversalKeys

Merge only keys found in all objects. For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `boolean`
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

### skipCommonKeys

Skip keys found in multiple objects (merge only single occurrence keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `boolean`
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

### skipUniversalKeys

Skip keys found in all objects (merge only single occurrence and common keys). For nested objects, key comparisons are made between objects with the same parent key and at the same depth.

- Type: `boolean`
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

### invokeGetters

Invoke "getter" methods and merge returned values.

- Type: `boolean`
- Default: `false`

```javascript
const obj1 = {
  a: 1,
  get b() {
    return this.a + 1;
  }
};
const clonedObj1 = mergician({}, obj1);
const clonedObj2 = mergician({
  invokeGetters: true
})({}, obj1);

console.log(obj1); // { a: 1, b: [Getter] }
console.log(clonedObj1); // { a: 1, b: [Getter] }
console.log(clonedObj2); // { a: 1, b: 2 }
```

### skipSetters

Skip "setter" methods during merge. These methods wil be accessible to callback functions so that they can be called directly and/or replaced with alternate values if necessary.

- Type: `boolean`
- Default: `false`

```javascript
const obj1 = {
    firstname: 'John',
    lastname: 'Smith',
    set fullname() {
        return this.fullname = `${this.firstname} ${this.lastname}`;
    }
};
const clonedObj = mergician({
    skipSetters: true
})({}, obj1);

console.log(obj1);      // { firstname: 'John', lastname: 'Smith', fullname: [Setter] }
console.log(clonedObj); // { firstname: 'John', lastname: 'Smith' }
```

### appendArrays

Merge array values at the end of existing arrays. Arrays within arrays are not modified.

- Type: `boolean`
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

### prependArrays

Merge array values at the beginning of existing arrays. Arrays within arrays are not modified.

- Type: `boolean`
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

### dedupArrays

Remove duplicate array values in new merged object. Arrays within arrays are not modified.

- Type: `boolean`
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

### sortArrays

Sort array values in new merged object. Arrays within arrays are not modified.

When `true`, sorting is performed using the [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method's [default comparison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description) function. This can yield unexpected sorting results for those unfamiliar with how this comparison function works (e.g., `10` is sorted before `2`). Alternate comparison functions can be used ("natural" sorting, descending order, etc.) by assigning them to the `sortArrays` option.

- Type: `boolean` or `function`
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

### hoistEnumerable()

Merge enumerable prototype properties as direct properties of new merge object.

- Type: `boolean`
- Default: `false`

```js
const obj = { a: 1 };

console.log(obj); // { a: 1 }
console.log(Object.getPrototypeOf(obj)); // { b: 2 }

const clonedObj = mergician({
  hoistEnumerable: true
})({}, obj);

console.log(clonedObj); // { a: 1, b: 2 }
console.log(Object.getPrototypeOf(clonedObj)); // {}
```

### hoistProto()

Merge custom prototype properties as direct properties of new merge object.

- Type: `boolean`
- Default: `false`

```js
class Person {
  constructor(name) {
    this.name = name; // <= Own property
  }

  greeting() {
    // <= Prototype property
    return `My name is ${this.name}.`;
  }
}

const John = new Person('John');

console.log(John.greeting()); // My name is John.
console.log(John.hasOwnProperty('greeting')); // false
console.log(Object.getPrototypeOf(John).hasOwnProperty('greeting')); // true

const cloneObj = mergician({
  hoistProto: true
})({}, John);

console.log(cloneObj.greeting()); // My name is John.
console.log(John.hasOwnProperty('greeting')); // true
console.log(Object.getPrototypeOf(John).hasOwnProperty('greeting')); // false
```

### skipProto()

Skip merging of custom prototype properties.

- Type: `boolean`
- Default: `false`

```js
class Person {
  constructor(name) {
    this.name = name; // <= Own property
  }

  greeting() {
    // <= Prototype property
    return `My name is ${this.name}.`;
  }
}

const John = new Person('John');

console.log(John); // { name: 'John' };
console.log(John.greeting()); // My name is John.
console.log(Object.getPrototypeOf(John).hasOwnProperty('greeting')); // true

const cloneObj = mergician({
  skipProto: true
})({}, John);

console.log(cloneObj); // { name: 'John' };
console.log(cloneObj.greeting()); // undefined
console.log(Object.getPrototypeOf(John).hasOwnProperty('greeting')); // false
```

### filter()

Callback used to conditionally merge or skip a property.

Return a "[truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)" value to merge or a "[falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)" value to skip. If no value is returned, merging/skipping will proceed based on other option values ([`onlyKeys`](#onlykeys), [`skipKeys`](#skipkeys), etc.)

- Type: `function`
- Arguments:
  - **data**: `object`
    - **depth**: `number`
      The nesting level of the key being processed
    - **key**: `string`
      The object key being processed
    - **srcObj**: `object`
      The object containing the source value
    - **srcVal**: `any`
      The source object's property value
    - **targetObj**: `object`
      The new merged object
    - **targetVal**: `any`
      The new merged object's current property value

```javascript
const obj1 = { a: true };
const obj2 = { a: false, b: true };
const obj3 = { a: null, b: undefined, c: { d: 0, e: '' } };

const mergedObj = mergician({
  // Skip properties with non-zero "falsy" values
  filter({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
    return Boolean(srcVal) || srcVal === 0;
  }
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: true, b: true, c: { d: 0 } }
```

### beforeEach()

Callback used for inspecting/modifying properties before merge.

If a value is returned, that value will be used as the new value to merge. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `srcVal` will be used.

- Type: `function`
- Arguments:
  - **data**: `object`
    - **depth**: `number`
      The nesting level of the key being processed
    - **key**: `string`
      The object key being processed
    - **srcObj**: `object`
      The object containing the source value
    - **srcVal**: `any`
      The source object's property value
    - **targetObj**: `object`
      The new merged object
    - **targetVal**: `any`
      The new merged object's current property value

```javascript
const obj1 = { a: null };
const obj2 = { b: undefined };
const obj3 = { c: { d: '', e: 0 } };

const mergedObj = mergician({
  // Normalize non-zero "falsy" values to be false
  beforeEach({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
    if (srcVal !== 0 && !Boolean(srcVal)) {
      return false;
    }
  }
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: false, b: false, c: { d: false, e: 0 } }
```

### afterEach()

Callback used for inspecting/modifying properties after merge.

If a value is returned, that value will be used as the new merged value. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `mergeVal` will be used.

- Type: `function`
- Arguments:
  - **data**: Object containing merge data
    - **depth**: `number`
      The nesting level of the key being processed
    - **key**: `string`
      The object key being processed
    - **mergeVal**: `any`
      The new merged value
    - **srcObj**: `object`
      The object containing the source value
    - **targetObj**: `object`
      The new merged object

```javascript
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: { d: 3, e: true } };

const mergedObj = mergician({
  // Add 1 to all numbers
  afterEach({ depth, key, mergeVal, srcObj, targetObj }) {
    if (typeof mergeVal === 'number') {
      return mergeVal + 1;
    }
  }
})(obj1, obj2, obj3);

console.log(mergedObj); // { a: 2, b: 3, c: { d: 4, e: true } }
```

### onCircular()

Callback used for handling circular object references during merge.

If a value is returned, that value will be used as the new value to merge. If an `Object` with the shape of a [property descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is returned, the object will be used to define the property using [`Object.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). If no value is returned, the unmodified `srcVal` will be used.

- Type: `function`
- Arguments:
  - **data**: `object`
    - **depth**: `number`
      The nesting level of the key being processed
    - **key**: `string`
      The object key being processed
    - **srcObj**: `object`
      The object containing the source value
    - **srcVal**: `any`
      The source object's property value
    - **targetObj**: `object`
      The new merged object
    - **targetVal**: `any`
      The new merged object's current property value

```javascript
const circularObj = {
  a: 1,
  get b() {
    return this;
  }
};
const clonedObj = mergician({
  // Replace circular object reference with '[Circular]' string
  onCircular({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
    return '[Circular]';
  }
})({}, circularObj);

console.log(clonedObj); // { a: 1, b: '[Circular]' }
```

## Sponsorship

A [sponsorship](https://github.com/sponsors/jhildenbiddle) is more than just a way to show appreciation for the open-source authors and projects we rely on; it can be the spark that ignites the next big idea, the inspiration to create something new, and the motivation to share so that others may benefit.

If you benefit from this project, please consider lending your support and encouraging future efforts by [becoming a sponsor](https://github.com/sponsors/jhildenbiddle).

Thank you! 🙏🏻

<iframe src="https://github.com/sponsors/jhildenbiddle/button" title="Sponsor jhildenbiddle" height="35" width="116" style="border: 0; margin: 0;"></iframe>

## Contact & Support

- Follow 👨🏻‍💻 **@jhildenbiddle** on [Twitter](https://twitter.com/jhildenbiddle) and [GitHub](https://github.com/jhildenbiddle) for announcements
- Create a 💬 [GitHub issue](https://github.com/jhildenbiddle/mergician/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergician) and 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript) to promote the project
- Become a 💖 [sponsor](https://github.com/sponsors/jhildenbiddle) to support the project and future efforts

## License

This project is licensed under the [MIT license](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE).

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
