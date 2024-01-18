import { mergician } from '../dist/mergician.esm.js';

// Use for JSDoc / IntelliSense testing
mergician;
mergician({
  afterEach({}) {
    return true;
  },
  filter({}) {
    return true;
  }
});
mergician({}, { a: 1 });
