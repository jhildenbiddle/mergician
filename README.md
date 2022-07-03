# mergeDeep <!-- omit in toc -->

[![NPM](https://img.shields.io/npm/v/mergedeep.svg?style=flat-square)](https://www.npmjs.com/package/mergedeep)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergedeep/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergedeep/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergedeep/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=css,developers,frontend,javascript)

mergeDeep is a flexible, light-weight utility for deep (recursive) merging/cloning of JavaScript objects.

What sets mergeDeep apart from similar utilities are the options provided for customizing the merge process. These options make it easy to merge some-but-not all properties, inspect and modify each property before and/or after merging, merge arrays, and efficiently remove duplicate array items. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getter/setter functions) are also copied properly instead of their returned/stored values.

**Note:** For simple operations that do not require the flexibility of this library, consider using native methods like [structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) for deep merging/cloning and the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) or [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) for shallow merging/cloning.

---

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
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

#### NPM  <!-- omit in toc -->

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

#### CDN  <!-- omit in toc -->

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/css-vars-ponyfill), [unpkg](https://unpkg.com/browse/css-vars-ponyfill/), and other CDN services that auto-publish npm packages and GitHub repos.

```html
<!-- Global "mergeDeep" | latest v1.x.x | see @ version in URL -->
<script src="https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.js">
```

```javascript
// ES module | latest v1.x.x | see @ version in URL
import mergeDeep from 'https://cdn.jsdelivr.net/npm/mergedeep@1/dist/mergedeep.min.mjs';
```

#### Git  <!-- omit in toc -->

```bash
git clone https://github.com/jhildenbiddle/mergedeep.git
```

## Usage

TBD

## Contact

- Create a [Github issue](https://github.com/jhildenbiddle/mergedeep/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergedeep) or ❤️ [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergedeep&hashtags=developers,javascript) to support the project!

## License

This project is licensed under the MIT License. See the [MIT LICENSE](https://github.com/jhildenbiddle/mergedeep/blob/main/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
