# Mergician

[![NPM](https://img.shields.io/npm/v/mergician.svg?style=flat-square)](https://www.npmjs.com/package/mergician)
[![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/jhildenbiddle/mergician/Build%20&%20Test/main?label=checks&style=flat-square)](https://github.com/jhildenbiddle/mergician/actions?query=branch%3Amain+)
[![Codacy code quality](https://img.shields.io/codacy/grade/9831274fda2341129b76ff3582ec0df5/main?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/mergician/dashboard?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/mergician/badge)](https://www.jsdelivr.com/package/npm/mergician)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript)

Mergician is a flexible, light-weight utility for deep (recursive) merging/cloning of JavaScript objects.

- [Documentation & Demos](https://jhildenbiddle.github.io/mergician/)

## Why?

What sets Mergician apart from similar utilities are the options provided for customizing the merge process. These options make it easy to filter properties, inspect and modify properties before/after merging, merge and sort arrays, and remove duplicate array items. Property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) are also handled properly, ensuring that getter/setter functions are retained and descriptor values are defined on the newly merged object.

## Features

- Deep merge/clone JavaScript objects
- Filter properties
- Inspect and modify properties
- Merge arrays
- Sort arrays
- Remove duplicate array items ("dedup")
- Properly handle property [accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) (getters/setters) and [descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- Returns new object without modifying source objects (immutable)

**Platform Support**

<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/node.svg"> <span>Node 10+</span><br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/chrome.svg"> <span>Chrome 61+</span><br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/edge.svg"> <span>Edge 16+</span><br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/firefox.svg"> <span>Firefox 60+</span><br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/safari.svg"> <span>Safari 10.1+</span><br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/mergician/main/docs/assets/img/ie.svg"> <span>Not supported</span>

## Installation

#### NPM

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

## Usage & Options

See the [documentation site](https://jhildenbiddle.github.io/mergician/) for details and demos.

## Contact & Support

- Create a [Github issue](https://github.com/jhildenbiddle/mergician/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/mergician) or 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fmergician&hashtags=developers,frontend,javascript) to spread the word and support the project!

## License

This project is licensed under the [MIT license](https://github.com/jhildenbiddle/mergician/blob/main/LICENSE).

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
