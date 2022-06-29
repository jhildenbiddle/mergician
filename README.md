# mergedeep <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/mergedeep.svg?style=flat-square)](https://www.npmjs.com/package/mergedeep)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergedeep/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergedeep/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergedeep/dashboard?branch=main)
[![Codacy branch coverage](https://img.shields.io/codacy/coverage/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergedeep/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/mergedeep/badge)](https://www.jsdelivr.com/package/npm/mergedeep)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=css,developers,frontend,javascript)

Deep recursive object merging with options to inspect, modify, and filter keys/values, merge arrays (append/prepend), and remove duplicate values from merged arrays. Returns new object without modifying sources (immutable).

---

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)
- [License](#license)

---

## Features

- TBD

#### Platform Support <!-- omit in toc -->

| Node | IE   | Edge | Chrome | Firefox | Safari |
| ---- | ---- | ---- | ------ | ------- | ------ |
| 10+  | -    | 16+  | 61+    | 60+     | 10.1+  |

## Installation

#### NPM  <!-- omit in toc -->

Provided as CommonJS and ES modules.

```bash
npm install mergedeep --save-dev
```

```javascript
// CommonJS module
const mergedeep = require('mergedeep');
```

```javascript
// ES module
import mergedeep from 'mergedeep';
```

#### CDN  <!-- omit in toc -->

Provided as an ES module only. Available on [jsdelivr](https://www.jsdelivr.com/package/npm/css-vars-ponyfill), [unpkg](https://unpkg.com/browse/css-vars-ponyfill/), and other CDN services that auto-publish npm packages and GitHub repos.

```javascript
// Latest v1.x.x (note @ version in URL)
import mergedeep from 'https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.mjs';
```

#### Git  <!-- omit in toc -->

```bash
git clone https://github.com/jhildenbiddle/mergedeep.git
```

## Usage

Given the following objects:

```javascript
const obj1 = {
  a: 1,
  b: { foo: true },
  c: [1, 1]
}

const obj2 = {
  a: 2,
  b: { bar: false },
  c: [2, 2]
}

const obj3 = {
  a: 3
}
```

Merging can be done using the default options as follows:

```javascript
// Merge using default options (i.e. no custom options provided)
const mergedObj = mergedeep(obj1, obj2, obj3);

// { a: 3, b: { foo: true, bar: false}, c: [2, 2] }
```

Use the `onlyKeys` option to merge only specific keys:

```javascript
// Only merge specific keys
const mergedObj = mergedeep({
  onlyKeys: ['a', 'b', 'bar']
})(obj1, obj2, obj3);

// { a: 3, b: { bar: false} }
```

Use the `skipKeys` option to skip specific keys:

```javascript
// Only merge specific keys
const mergedObj = mergedeep({
  skipKeys: ['c']
})(obj1, obj2, obj3);

// { a: 3, b: { bar: false} }
```

Use the `skipUniqueKeys` option merge only

```javascript
// Only merge specific keys
const mergedObj = mergedeep({
  skipUniqueKeys: true
})(obj1, obj2, obj3);

// { a: 3 }
```

## Contact

- Create a [Github issue](https://github.com/jhildenbiddle/mergedeep/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergedeep) or ❤️ [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=developers,javascript) to support the project!

## License

This project is licensed under the MIT License. See the [MIT LICENSE](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
