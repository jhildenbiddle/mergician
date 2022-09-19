# Mergician

[![NPM](https://img.shields.io/npm/v/mergician.svg?style=flat-square)](https://www.npmjs.com/package/mergician)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergician/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergician/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergician/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/mergician/badge)](https://www.jsdelivr.com/package/npm/mergician)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript)

Mergician is a uniquely flexible and light-weight utility for deep (recursive) merging/cloning of JavaScript objects.

Unlike native methods and other merge/clone utilities, Mergician provides advanced options for customizing the merge/clone process. These options make it easy to inspect, filter, and modify keys and properties; merge or skip unique, common, and universal keys (i.e., intersections, unions, and differences); and merge, sort, and remove duplicates from arrays. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) are also handled properly, ensuring that getter/setter functions are retained and descriptor values are defined on new merged/cloned objects.

- [Documentation & Demos](https://jhildenbiddle.github.io/mergician/)

## Examples

Basic object cloning using default options:

```javascript
// ES module shown. CommonJS module also available (see below).
import mergician from 'mergician';

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
import mergician from 'mergician';

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

## Features

Unlike native methods and other merge/clone utilities, Mergician provides advanced options for customizing the merge/clone process. These options make it easy to inspect, filter, and modify keys and properties; merge or skip unique, common, and universal keys (i.e., key unions and differences); and merge, sort, and remove duplicates from arrays. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) are also handled properly, ensuring that getter/setter functions are retained and descriptor values are defined on new merged/cloned objects.

- Deep merge or clone JavaScript objects
- Inspect, filter, and modify keys and properties
- Merge or skip unique, common, and universal keys (i.e., key unions and differences)
- Merge, sort, and remove duplicates from arrays
- Copy property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getters/setters) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- Returns new object without modifying source objects (immutable)
- Lightweight (1.5k min+gzip) and dependency-free

**Platform Support**

<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/node.svg"> <span>Node 10+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/chrome.svg"> <span>Chrome 61+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/edge.svg"> <span>Edge 16+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/firefox.svg"> <span>Firefox 60+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/safari.svg"> <span>Safari 10.1+</span>

## Installation

**NPM**

```bash
npm install mergician
```

```javascript
// ES module
import mergician from 'mergician';
```

```javascript
// CommonJS module
const mergician = require('mergician');
```

**CDN**

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/mergician) (below), [unpkg](https://unpkg.com/browse/mergician/), and other CDN services that auto-publish npm packages.

```javascript
// ES module @ latest v1.x.x (see @ version in URL)
import mergician from 'https://cdn.jsdelivr.net/npm/mergician@1/dist/mergician.min.mjs';
```

```html
<!-- Global "mergician" @ latest v1.x.x (see @ version in URL) -->
<script src="https://cdn.jsdelivr.net/npm/mergician@1/dist/mergician.min.js">
```

> 💡 Note the `@` version lock in the URLs above. This prevents breaking changes in future releases from affecting your project and is therefore the safest method of loading dependencies from a CDN. When a new major version is released, you will need to manually update your CDN URLs by changing the version after the `@` symbol.

## Usage & Options

See the [documentation site](https://jhildenbiddle.github.io/mergician/) for details.

## Contact & Support

- Create a [Github issue](https://github.com/jhildenbiddle/mergician/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergician) or 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript) to spread the word and support the project!

## License

This project is licensed under the [MIT license](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE).

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
