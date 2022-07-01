const { isObject } = require('../src/util');
const mergeDeep = require('../dist/mergedeep.cjs');

// Test objects
const testObj1 = { a: 1, b: [1, 1], d: true };
const testObj2 = { a: 2, b: [2, 2], c: { x: 2, y: [2, '😀'] }, e: null };
const testObj3 = { a: 3, b: [3, 3], c: { x: 3, y: [3, '😀'], z: 3 } };

describe('Default options', () => {
    test('deep merge two objects', () => {
        const mergedObj = mergeDeep(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('deep merge three objects', () => {
        const mergedObj = mergeDeep(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Accessors', () => {
    test('handles getters', () => {
        const obj1 = { a: 1, get getVal() { return 'foo'; }};
        const obj2 = { b: 2, get getVal() { return 'bar'; }};
        const mergedObj = mergeDeep(obj1, obj2);
        const getDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'getVal');

        expect(typeof mergedObj.a).toBe('number');
        expect(isObject(getDescriptor)).toBe(true);
        expect('get' in getDescriptor).toBe(true);
        expect(typeof getDescriptor.get).toBe('function');
        expect(mergedObj).toMatchSnapshot();
    });

    test('handles setters', () => {
        const obj1 = { a: 1, set setVal(val) { this.a = val; }};
        const obj2 = { a: 2, set setVal(val) { this.a = val; }};
        const mergedObj = mergeDeep(obj1, obj2);
        const setDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'setVal');

        expect(typeof mergedObj.a).toBe('number');
        expect(isObject(setDescriptor)).toBe(true);
        expect('get' in setDescriptor).toBe(true);
        expect(typeof setDescriptor.set).toBe('function');
        mergedObj.setVal = 'foo';
        expect(mergedObj.a).toBe('foo');
        expect(mergedObj).toMatchSnapshot();
    });

    test('handles getter/setter arrays', () => {
        const obj1 = { a: 1, get getVal() { return [1, 1]; }, set setVal(val) { this.a = [2, 2]; }};
        const obj2 = { a: 2, get getVal() { return [3, 3]; }, set setVal(val) { this.a = [4, 4]; }};
        const mergedObj = mergeDeep({
            appendArrays: true,
            dedupArrays: true
        })(obj1, obj2);
        const getDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'getVal');
        const setDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'setVal');

        expect(typeof mergedObj.a).toBe('number');

        // Getter
        expect(isObject(getDescriptor)).toBe(true);
        expect('get' in getDescriptor).toBe(true);
        expect(typeof getDescriptor.get).toBe('function');
        expect(Array.isArray(mergedObj.getVal)).toBe(true);
        expect(mergedObj.getVal).toHaveLength(2);

        // Setter
        expect(isObject(setDescriptor)).toBe(true);
        expect('set' in setDescriptor).toBe(true);
        expect(typeof setDescriptor.set).toBe('function');
        mergedObj.setVal = 'foo';
        expect(Array.isArray(mergedObj.a)).toBe(true);
        expect(mergedObj.a).toHaveLength(2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('handles getter/setter objects', () => {
        const obj1 = { a: 1, get getVal() { return { x: 1 }; }, set setVal(val) { this.a = { x: 3 }; }};
        const obj2 = { a: 2, get getVal() { return { x: 2 }; }, set setVal(val) { this.a = { x: 4 }; }};
        const mergedObj = mergeDeep(obj1, obj2);
        const getDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'getVal');
        const setDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'setVal');

        expect(typeof mergedObj.a).toBe('number');

        // Getter
        expect(isObject(getDescriptor)).toBe(true);
        expect('get' in getDescriptor).toBe(true);
        expect(typeof getDescriptor.get).toBe('function');
        expect(isObject(mergedObj.getVal)).toBe(true);
        expect(mergedObj.getVal.x).toBe(2);

        // Setter
        expect(isObject(setDescriptor)).toBe(true);
        expect('set' in setDescriptor).toBe(true);
        expect(typeof setDescriptor.set).toBe('function');
        mergedObj.setVal = 'foo';
        expect(isObject(mergedObj.a)).toBe(true);
        expect(mergedObj.a.x).toBe(4);

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Options: Keys', () => {
    test('onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['a', 'c', 'x']
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['a', 'x']
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['a', 'b'],
            skipKeys: ['b'],
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyCommonKeys', () => {
        const mergedObj = mergeDeep({
            onlyCommonKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyCommonKeys + onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['b', 'c', 'x', 'z'],
            onlyCommonKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyCommonKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['a', 'z'],
            onlyCommonKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyUniversalKeys', () => {
        const mergedObj = mergeDeep({
            onlyUniversalKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyUniversalKeys + onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['a'],
            onlyUniversalKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('onlyUniversalKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['a'],
            onlyUniversalKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipCommonKeys', () => {
        const mergedObj = mergeDeep({
            skipCommonKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipCommonKeys + onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['d'],
            skipCommonKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipCommonKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['d'],
            skipCommonKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipUniversalKeys', () => {
        const mergedObj = mergeDeep({
            skipUniversalKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipUniversalKeys + onlyKeys', () => {
        const mergedObj = mergeDeep({
            onlyKeys: ['c'],
            skipUniversalKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('skipUniversalKeys + skipKeys', () => {
        const mergedObj = mergeDeep({
            skipKeys: ['c'],
            skipUniversalKeys: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Options: Arrays', () => {
    const testObj1 = { a: [1, 1] };
    const testObj2 = { a: [2, 2, [2, 2]], b: { x: [2, '😀'] } };
    const testObj3 = { a: [3, 3, [3, 3]], b: { x: [3, '😀'] } };

    test('appendArrays', () => {
        const mergedObj = mergeDeep({
            appendArrays: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('prependArrays', () => {
        const mergedObj = mergeDeep({
            prependArrays: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('dedupArrays + appendArrays', () => {
        const mergedObj = mergeDeep({
            appendArrays: true,
            dedupArrays: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('dedupArrays + prependArrays', () => {
        const mergedObj = mergeDeep({
            prependArrays: true,
            dedupArrays: true
        })(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });

    test('dedupArrays + afterEach with deduped mergeVal)', () => {
        const mergedObj = mergeDeep({
            appendArrays: true,
            dedupArrays: true,
            afterEach(mergeVal, key, mergeObj, depth) {
                expect(mergeVal).toHaveLength(1);
            }
        })({ test: [1, 1] }, { test: [1, 1] });

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Options: Callbacks', () => {
    const testObj1 = { a: 1, b: { c: 'foo' } };
    const testObj2 = { a: 2, b: { c: 'bar' } };

    test('filter() arguments', () => {
        const conditionsTested = [];
        const mergedObj = mergeDeep({
            filter(srcVal, targetVal, key, srcObj, targetObj, depth) {
                expect(isObject(srcObj)).toBe(true);
                expect(typeof key).toBe('string');
                expect(isObject(targetObj)).toBe(true);
                expect(typeof depth).toBe('number');

                /* eslint-disable jest/no-conditional-expect */
                if (srcVal === 1) {
                    expect(key).toBe('a');
                    conditionsTested.push('srcVal/key');
                }
                if (srcVal === 2) {
                    expect(targetVal).toBe(1);
                    conditionsTested.push('srcVal/targetVal');
                }
                if (srcObj === testObj2 && key === 'a') {
                    expect(depth).toBe(0);
                    conditionsTested.push('depth:0');
                }
                if (srcObj === testObj2.b && key === 'c') {
                    expect(depth).toBe(1);
                    conditionsTested.push('depth:1');
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
                return key === 'a';
            }
        })(testObj1, testObj2);

        expect(mergedObj).toMatchSnapshot();
    });

    test('filter() false', () => {
        const mergedObj = mergeDeep({
            filter(srcVal, targetVal, key, srcObj, targetObj, depth) {
                return key !== 'a';
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
                    expect(key).toBe('a');
                    conditionsTested.push('srcVal/key');
                }
                if (srcVal === 2) {
                    expect(targetVal).toBe(1);
                    conditionsTested.push('srcVal/targetVal');
                }
                if (srcObj === testObj2 && key === 'a') {
                    expect(depth).toBe(0);
                    conditionsTested.push('depth:0');
                }
                if (srcObj === testObj2.b && key === 'c') {
                    expect(depth).toBe(1);
                    conditionsTested.push('depth:1');
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
                    expect(key).toBe('a');
                    conditionsTested.push('mergeVal/key');
                }
                if (mergeVal === 2) {
                    expect(depth).toBe(0);
                    conditionsTested.push('depth:0');
                }
                if (mergeVal === 'bar') {
                    expect(depth).toBe(1);
                    conditionsTested.push('depth:1');
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
