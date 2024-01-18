import { mergician } from '../dist/mergician.mjs';

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
