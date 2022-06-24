const isObject = require('../src/is-object');
const mergeDeep = require('../dist/mergedeep.cjs');

// Test objects
const testObj1 = {
    array: [1, 2],
    number: 1,
    object: {
        a: 1,
        b: 1,
        c: [1, 1, [1, 1]],
        d: { x: 1, y: 1 }
    },
    string: 'foo',
};

const testObj2 = {
    array: [2, 3],
    number: 2,
    object: {
        b: 2,
        c: [2, 2, [2, 2]],
        d: { y: 2, z: 2 },
        e: null
    },
    string: 'bar',
    undefined: undefined
};

test('deep merge two objects', () => {
    const mergedObj = mergeDeep(testObj1, testObj2);

    expect(mergedObj).toMatchSnapshot();
});

describe('Options: Keys', () => {
    test('onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['object', 'string', 'a', 'b']
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['undefined', 'a', 'b']
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['object', 'string', 'a', 'b'],
            skipKeys: ['string', 'a']
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipUniqueKeys', () => {
        const mergedObj = mergeDeep({
            skipUniqueKeys: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipUniqueKeys + onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['object', 'undefined', 'a', 'b'],
            skipUniqueKeys: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipUniqueKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['array', 'a', 'b'],
            skipUniqueKeys: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Options: Arrays', () => {
    test('appendArrays', () => {
        const mergedObj = mergeDeep({
            appendArrays: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('prependArrays', () => {
        const mergedObj = mergeDeep({
            prependArrays: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('dedupArrays + appendArrays', () => {
        const mergedObj = mergeDeep({
            appendArrays: true,
            dedupArrays: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('dedupArrays + prependArrays', () => {
        const mergedObj = mergeDeep({
            prependArrays: true,
            dedupArrays: true
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Options: Callbacks', () => {
    test('filter() arguments', () => {
        const testObj1 = { a: 1, b: { c: 'foo' } };
        const testObj2 = { a: 2, b: { c: 'bar' } };

        const conditionsTested = [];

        const mergedObj = mergeDeep({
            filter(srcVal, targetVal, key, srcObj, targetObj, depth) {
                expect(isObject(srcObj)).toBe(true);
                expect(typeof key).toBe('string');
                expect(isObject(targetObj)).toBe(true);
                expect(typeof depth).toBe('number');

                /* eslint-disable jest/no-conditional-expect */
                if (srcVal === 1) {
                    conditionsTested.push('srcVal/key');
                    expect(key).toBe('a');
                }
                if (srcVal === 2) {
                    conditionsTested.push('srcVal/targetVal');
                    expect(targetVal).toBe(1);
                }
                if (srcObj === testObj2 && key === 'a') {
                    conditionsTested.push('depth:0');
                    expect(depth).toBe(0);
                }
                if (srcObj === testObj2.b && key === 'c') {
                    conditionsTested.push('depth:1');
                    expect(depth).toBe(1);
                }
                /* eslint-enable jest/no-conditional-expect */

                return srcVal;
            }
        })(testObj1, testObj2);

        expect(conditionsTested).toHaveLength(4);
        expect(mergedObj).toMatchSnapshot();
    });

    test('filter() true', () => {
        const mergedObj = mergeDeep({
            filter(srcVal, targetVal, key, srcObj, targetObj, depth) {
                return key === 'string';
            }
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('filter() false', () => {
        const mergedObj = mergeDeep({
            filter(srcVal, targetVal, key, srcObj, targetObj, depth) {
                return key !== 'string';
            }
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('filter() without return value', () => {
        const mergedObj = mergeDeep({
            filter() {}
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('beforeEach() arguments', () => {
        const testObj1 = { a: 1, b: { c: 'foo' } };
        const testObj2 = { a: 2, b: { c: 'bar' } };

        const conditionsTested = [];

        const mergedObj = mergeDeep({
            beforeEach(srcVal, targetVal, key, srcObj, targetObj, depth) {
                expect(isObject(srcObj)).toBe(true);
                expect(typeof key).toBe('string');
                expect(isObject(targetObj)).toBe(true);
                expect(typeof depth).toBe('number');

                /* eslint-disable jest/no-conditional-expect */
                if (srcVal === 1) {
                    conditionsTested.push('srcVal/key');
                    expect(key).toBe('a');
                }
                if (srcVal === 2) {
                    conditionsTested.push('srcVal/targetVal');
                    expect(targetVal).toBe(1);
                }
                if (srcObj === testObj2 && key === 'a') {
                    conditionsTested.push('depth:0');
                    expect(depth).toBe(0);
                }
                if (srcObj === testObj2.b && key === 'c') {
                    conditionsTested.push('depth:1');
                    expect(depth).toBe(1);
                }
                /* eslint-enable jest/no-conditional-expect */

                return srcVal;
            }
        })(testObj1, testObj2);

        expect(conditionsTested).toHaveLength(4);
        expect(mergedObj).toMatchSnapshot();
    });

    test('beforeEach() with return value', () => {
        const mergedObj = mergeDeep({
            beforeEach() {
                return 'baz';
            }
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('beforeEach() without return value', () => {
        const mergedObj = mergeDeep({
            beforeEach() {}
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('afterEach() arguments', () => {
        const testObj1 = { a: 1, b: { c: 'foo' } };
        const testObj2 = { a: 2, b: { c: 'bar' } };

        const conditionsTested = [];

        const mergedObj = mergeDeep({
            afterEach(mergeVal, key, mergeObj, depth) {
                expect(typeof key).toBe('string');
                expect(isObject(mergeObj)).toBe(true);
                expect(typeof depth).toBe('number');

                /* eslint-disable jest/no-conditional-expect */
                if (mergeVal === 2) {
                    conditionsTested.push('mergeVal/key');
                    expect(key).toBe('a');
                }
                if (mergeVal === 2) {
                    conditionsTested.push('depth:0');
                    expect(depth).toBe(0);
                }
                if (mergeVal === 'bar') {
                    conditionsTested.push('depth:1');
                    expect(depth).toBe(1);
                }
                /* eslint-enable jest/no-conditional-expect */

                return mergeVal;
            }
        })(testObj1, testObj2);

        expect(conditionsTested).toHaveLength(3);
        expect(mergedObj).toMatchSnapshot();
    });

    test('afterEach() return value', () => {
        const mergedObj = mergeDeep({
            afterEach() {
                return 'baz';
            }
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('afterEach() without return value', () => {
        const mergedObj = mergeDeep({
            afterEach() {}
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });
});
