const { isObject } = require('../src/util');
const mergician = require('../src/index');

// Test Objects
// ============================================================================
// Property descriptors
const propFullName = {
    value: 'John Smith',
    writable: true,
    enumerable: true,
    configurable: true
};
const propGetFullName = {
    get() {
        return `${this.firstname} ${this.lastname}`;
    },
    enumerable: true,
    configurable: true
};
const propSetFullName = {
    set(val) {
        const names = val.trim().split(' ');
        this.firstname = names[0];
        this.lastname = names[1];
    },
    enumerable: true,
    configurable: true
};
const propGetSetFullName = {
    get() {
        return `${this.firstname} ${this.lastname}`;
    },
    set(val) {
        const names = val.trim().split(' ');
        this.firstname = names[0];
        this.lastname = names[1];
    },
    enumerable: true,
    configurable: true
};

// Objects
const testObj1 = { a: 1, b: [1, 1], d: true };
const testObj2 = { a: 2, b: [2, 2], c: { x: 2, y: [2, '😀'] }, e: null };
const testObj3 = { a: 3, b: [3, 3], c: { x: 3, y: [3, '😀'], z: 3 } };
const testCircularObj = { a: 1, get circular() { return this; } };
const testObjPerson = { firstname: 'John', lastname: 'Smith' };
const testObjGetter = Object.assign({}, testObjPerson);
const testObjSetter = Object.assign({}, testObjPerson);
const testObjGetterSetter = Object.assign({}, testObjPerson);
const testObjProto = { a: 1 };

// Apply property descriptors and prototypes to test objects
Object.defineProperty(testObjPerson, 'fullname', propFullName);
Object.defineProperty(testObjGetter, 'fullname', propGetFullName);
Object.defineProperty(testObjSetter, 'fullname', propSetFullName);
Object.defineProperty(testObjGetterSetter, 'fullname', propGetSetFullName);
Object.getPrototypeOf(testObjProto).b = true;


// Tests
// ============================================================================
describe('Default options', () => {
    test('clone object', () => {
        const mergedObj = mergician({}, testObj2);

        expect(mergedObj.b).not.toBe(testObj2.b);
        expect(mergedObj.c).not.toBe(testObj2.c);
        expect(mergedObj).toMatchSnapshot();
    });

    test('clone circular object', () => {
        const mergedObj = mergician({}, testCircularObj);

        expect(mergedObj).toMatchSnapshot();
        expect(mergedObj.a).toBe(1);
        expect(mergedObj.circular.a).toBe(1);
        expect(mergedObj.circular.circular.a).toBe(1);
    });

    test('deep merge two objects', () => {
        const mergedObj = mergician(testObj1, testObj2);

        expect(mergedObj.b).not.toBe(testObj2.b);
        expect(mergedObj.c).not.toBe(testObj2.c);
        expect(mergedObj).toMatchSnapshot();
    });

    test('deep merge three objects', () => {
        const mergedObj = mergician(testObj1, testObj2, testObj3);

        expect(mergedObj).toMatchSnapshot();
    });
});

describe('Options', () => {
    test('passing options returns custom merge function', () => {
        const customMerge = mergician({}); // Defaults

        expect(typeof customMerge).toBe('function');
    });

    describe('Keys', () => {
        test('onlyKeys', () => {
            const mergedObj = mergician({
                onlyKeys: ['a', 'c', 'x']
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipKeys', () => {
            const mergedObj = mergician({
                skipKeys: ['a', 'x']
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyKeys + skipKeys', () => {
            const mergedObj = mergician({
                onlyKeys: ['a', 'b'],
                skipKeys: ['b'],
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyCommonKeys', () => {
            const mergedObj = mergician({
                onlyCommonKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyCommonKeys + onlyKeys', () => {
            const mergedObj = mergician({
                onlyKeys: ['b', 'c', 'x', 'z'],
                onlyCommonKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyCommonKeys + skipKeys', () => {
            const mergedObj = mergician({
                skipKeys: ['a', 'z'],
                onlyCommonKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyUniversalKeys', () => {
            const mergedObj = mergician({
                onlyUniversalKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyUniversalKeys + onlyKeys', () => {
            const mergedObj = mergician({
                onlyKeys: ['a'],
                onlyUniversalKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onlyUniversalKeys + skipKeys', () => {
            const mergedObj = mergician({
                skipKeys: ['a'],
                onlyUniversalKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipCommonKeys', () => {
            const mergedObj = mergician({
                skipCommonKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipCommonKeys + onlyKeys', () => {
            const mergedObj = mergician({
                onlyKeys: ['d'],
                skipCommonKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipCommonKeys + skipKeys', () => {
            const mergedObj = mergician({
                skipKeys: ['d'],
                skipCommonKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipUniversalKeys', () => {
            const mergedObj = mergician({
                skipUniversalKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipUniversalKeys + onlyKeys', () => {
            const mergedObj = mergician({
                onlyKeys: ['c'],
                skipUniversalKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('skipUniversalKeys + skipKeys', () => {
            const mergedObj = mergician({
                skipKeys: ['c'],
                skipUniversalKeys: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('hoistProto = false', () => {
            const mergedObj = mergician({
                hoistProto: false
            })({}, testObjProto);

            expect(mergedObj).toMatchSnapshot();
            expect(Object.prototype.hasOwnProperty.call(mergedObj, 'a')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(mergedObj, 'b')).toBe(false);
        });

        test('hoistProto = true', () => {
            const mergedObj = mergician({
                hoistProto: true
            })({}, testObjProto);

            expect(mergedObj).toMatchSnapshot();
            expect(Object.prototype.hasOwnProperty.call(mergedObj, 'a')).toBe(true);
            expect(Object.prototype.hasOwnProperty.call(mergedObj, 'b')).toBe(true);
        });
    });

    describe('Values', () => {
        test('invokeGetters = false', () => {
            const mergedObj = mergician({
                invokeGetters: false
            })({}, testObjGetter);
            const fullNameDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'fullname');

            expect(mergedObj).toMatchSnapshot();
            expect(fullNameDescriptor).toHaveProperty('get');
        });

        test('invokeGetters = true', () => {
            const mergedObj = mergician({
                invokeGetters: true
            })({}, testObjGetter);
            const fullNameDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'fullname');

            expect(mergedObj).toMatchSnapshot();
            expect(fullNameDescriptor).not.toHaveProperty('get');
        });

        test('skipSetters = false', () => {
            const mergedObj = mergician({
                skipSetters: false
            })({}, testObjSetter);
            const fullNameDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'fullname');

            expect(mergedObj).toMatchSnapshot();
            expect(typeof fullNameDescriptor.set).toBe('function');
        });

        test('skipSetters = true', () => {
            const mergedObj = mergician({
                skipSetters: true
            })({}, testObjSetter);
            const fullNameDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'fullname');

            expect(mergedObj).toMatchSnapshot();
            expect(fullNameDescriptor).toBeUndefined();
        });
    });

    describe('Arrays', () => {
        const testObj1 = { a: [1, 1] };
        const testObj2 = { a: [2, 2], b: [2, [2, 2]], c: { d: [2, 2, '😀'] } };
        const testObj3 = { a: [3, 3], b: [3, [3, 3]], c: { d: [3, 3, '😀'] } };

        test('appendArrays', () => {
            const mergedObj = mergician({
                appendArrays: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('prependArrays', () => {
            const mergedObj = mergician({
                prependArrays: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('dedupArrays', () => {
            const mergedObj = mergician({
                appendArrays: true,
                dedupArrays: true
            })({}, testObj2);

            expect(mergedObj).toMatchSnapshot();
        });

        test('dedupArrays + appendArrays', () => {
            const mergedObj = mergician({
                appendArrays: true,
                dedupArrays: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('dedupArrays + prependArrays', () => {
            const mergedObj = mergician({
                prependArrays: true,
                dedupArrays: true
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('dedupArrays + afterEach (mergeVal should be deduped)', () => {
            const mergedObj = mergician({
                appendArrays: true,
                dedupArrays: true,
                afterEach({ mergeVal }) {
                    expect(mergeVal).toHaveLength(1);
                }
            })({ test: [1, 1] }, { test: [1, 1] });

            expect(mergedObj).toMatchSnapshot();
        });

        test('sortArrays with boolean', () => {
            const mergedObj = mergician({
                appendArrays: true,
                sortArrays: true,
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('sortArrays with function', () => {
            const mergedObj = mergician({
                appendArrays: true,
                sortArrays(a, b) {
                    if (typeof b === 'number') {
                        return b - a;
                    }
                    else {
                        return -1;
                    }
                }
            })(testObj1, testObj2, testObj3);

            expect(mergedObj).toMatchSnapshot();
        });

        test('sortArrays + afterEach (mergeVal should be sorted)', () => {
            const sortedArrays = [
                [1, 2],
                [3, 4],
                [1, 2, 3, 4]
            ];
            const mergedObj = mergician({
                appendArrays: true,
                sortArrays: true,
                afterEach({ mergeVal }) {
                    expect(sortedArrays).toContainEqual(mergeVal);
                }
            })({ test: [2, 1] }, { test: [4, 3] });

            expect(mergedObj).toMatchSnapshot();
        });
    });

    describe('Callbacks', () => {
        const testObj1 = { a: 1, b: { c: 'foo' } };
        const testObj2 = { a: 2, b: { c: 'bar' } };

        test('filter() arguments', () => {
            const conditionsTested = [];
            const mergedObj = mergician({
                filter({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
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
            const mergedObj = mergician({
                filter({ key }) {
                    return key === 'a';
                }
            })(testObj1, testObj2);

            expect(mergedObj).toMatchSnapshot();
        });

        test('filter() false', () => {
            const mergedObj = mergician({
                filter({ key }) {
                    return key !== 'a';
                }
            })(testObj1, testObj2);

            expect(mergedObj).toMatchSnapshot();
        });

        test('filter() without return value', () => {
            const mergedObj = mergician({
                filter() {}
            })(testObj1, testObj2);

            expect(mergedObj).toMatchSnapshot();
        });

        test('beforeEach() arguments', () => {
            const testObj1 = { a: 1, b: { c: 'foo' } };
            const testObj2 = { a: 2, b: { c: 'bar' } };

            const conditionsTested = [];

            const mergedObj = mergician({
                beforeEach({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
                    expect(typeof depth).toBe('number');
                    expect(typeof key).toBe('string');
                    expect(isObject(srcObj)).toBe(true);
                    expect(isObject(targetObj)).toBe(true);

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
            const mergedObj = mergician({
                beforeEach() {
                    return 'baz';
                }
            })(testObj1, testObj2, testObjGetterSetter);

            expect(mergedObj).toMatchSnapshot();

            const fullNameDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'fullname');

            expect(fullNameDescriptor).not.toHaveProperty('get');
            expect(fullNameDescriptor).not.toHaveProperty('set');
        });

        test('beforeEach() without return value', () => {
            const mergedObj = mergician({
                beforeEach() {}
            })(testObj1, testObj2);

            expect(mergedObj).toMatchSnapshot();
        });

        test('afterEach() arguments', () => {
            const testObj1 = { a: 1, b: { c: 'foo' } };
            const testObj2 = { a: 2, b: { c: 'bar' } };

            const conditionsTested = [];

            const mergedObj = mergician({
                afterEach({ depth, key, mergeVal, srcObj, targetObj }) {
                    expect(typeof depth).toBe('number');
                    expect(typeof key).toBe('string');
                    expect(isObject(targetObj)).toBe(true);

                    /* eslint-disable jest/no-conditional-expect */
                    if (mergeVal === 2) {
                        expect(key).toBe('a');
                        conditionsTested.push('mergeVal/key');

                        expect(depth).toBe(0);
                        conditionsTested.push('depth:0');

                        expect(srcObj).toBe(testObj2);
                        conditionsTested.push('srcObj');
                    }
                    if (mergeVal === 'bar') {
                        expect(depth).toBe(1);
                        conditionsTested.push('depth:1');
                    }
                    /* eslint-enable jest/no-conditional-expect */

                    return mergeVal;
                }
            })(testObj1, testObj2);

            expect(conditionsTested).toHaveLength(4);
            expect(mergedObj).toMatchSnapshot();
        });

        test('afterEach() return value', () => {
            const mergedObj = mergician({
                afterEach() {
                    return 'baz';
                }
            })(testObj1, testObj2, testObjGetterSetter);

            expect(mergedObj).toMatchSnapshot();

            const fullNameDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'fullname');

            expect(fullNameDescriptor).not.toHaveProperty('get');
            expect(fullNameDescriptor).not.toHaveProperty('set');
        });

        test('afterEach() without return value', () => {
            const mergedObj = mergician({
                afterEach() {}
            })(testObj1, testObj2);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onCircular() arguments', () => {
            const mergedObj = mergician({
                onCircular({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
                    expect(typeof depth).toBe('number');
                    expect(typeof key).toBe('string');
                    expect(isObject(srcObj)).toBe(true);
                    expect(isObject(srcVal)).toBe(true);
                    expect(srcVal).toBe(srcObj);
                    expect(isObject(targetObj)).toBe(true);
                }
            })({}, testCircularObj);

            expect(mergedObj).toMatchSnapshot();
        });

        test('onCircular() without return value', () => {
            const mergedObj = mergician({
                onCircular() {}
            })({}, testCircularObj);

            expect(mergedObj).toMatchSnapshot();
            expect(mergedObj.a).toBe(1);
            expect(mergedObj.circular.a).toBe(1);
            expect(mergedObj.circular.circular.a).toBe(1);
        });

        test('onCircular() with return value', () => {
            const mergedObj = mergician({
                onCircular() {
                    return true;
                }
            })({}, testCircularObj);

            expect(mergedObj).toMatchSnapshot();
        });
    });

    test('custom merge function accepts options', () => {
        const customMerge1 = mergician({ onlyKeys: ['b'], appendArrays: true });

        expect(typeof customMerge1).toBe('function');

        const customMerge2 = customMerge1({ dedupArrays: true });

        expect(typeof customMerge2).toBe('function');

        const mergedObj1 = customMerge1(testObj1, testObj2, testObj3);
        const mergedObj2 = customMerge2(testObj1, testObj2, testObj3);

        expect(mergedObj1).toMatchSnapshot();
        expect(mergedObj2).toMatchSnapshot();
    });
});

describe('Accessors', () => {
    test('handles getters', () => {
        const obj1 = { a: 1, get getVal() { return 'foo'; }};
        const obj2 = { b: 2, get getVal() { return 'bar'; }};
        const mergedObj = mergician(obj1, obj2);
        const getDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'getVal');

        expect(typeof mergedObj.a).toBe('number');
        expect('get' in getDescriptor).toBe(true);
        expect(typeof getDescriptor.get).toBe('function');
        expect(mergedObj).toMatchSnapshot();
    });

    test('handles setters', () => {
        const obj1 = { a: 1, set setVal(val) { this.a = val; }};
        const obj2 = { a: 2, set setVal(val) { this.a = val; }};
        const mergedObj = mergician(obj1, obj2);
        const setDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'setVal');

        expect(typeof mergedObj.a).toBe('number');
        expect('get' in setDescriptor).toBe(true);
        expect(typeof setDescriptor.set).toBe('function');
        mergedObj.setVal = 'foo';
        expect(mergedObj.a).toBe('foo');
        expect(mergedObj).toMatchSnapshot();
    });

    test('handles getter/setter arrays', () => {
        const obj1 = { a: 1, get getVal() { return [1, 1]; }, set setVal(val) { this.a = [2, 2]; }};
        const obj2 = { a: 2, get getVal() { return [3, 3]; }, set setVal(val) { this.a = [4, 4]; }};
        const mergedObj = mergician({
            appendArrays: true,
            dedupArrays: true
        })(obj1, obj2);
        const getDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'getVal');
        const setDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'setVal');

        expect(typeof mergedObj.a).toBe('number');

        // Getter
        expect('get' in getDescriptor).toBe(true);
        expect(typeof getDescriptor.get).toBe('function');
        expect(Array.isArray(mergedObj.getVal)).toBe(true);
        expect(mergedObj.getVal).toHaveLength(2);

        // Setter
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
        const mergedObj = mergician(obj1, obj2);
        const getDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'getVal');
        const setDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'setVal');

        expect(typeof mergedObj.a).toBe('number');

        // Getter
        expect('get' in getDescriptor).toBe(true);
        expect(typeof getDescriptor.get).toBe('function');
        expect(isObject(mergedObj.getVal)).toBe(true);
        expect(mergedObj.getVal.x).toBe(2);

        // Setter
        expect('set' in setDescriptor).toBe(true);
        expect(typeof setDescriptor.set).toBe('function');
        mergedObj.setVal = 'foo';
        expect(isObject(mergedObj.a)).toBe(true);
        expect(mergedObj.a.x).toBe(4);

        expect(mergedObj).toMatchSnapshot();
    });

    test('handles getter/setter return objects from callbacks', () => {
        const obj1 = { a: 1, b: 1, c: 1, d: 1 };
        const mergedObj = mergician({
            beforeEach({ key }) {
                if (key === 'a') {
                    return {
                        get() { return 'foo'; },
                        set() { this.testa = 'bar'; }
                    };
                }
                if (key === 'b') {
                    return {
                        value: 2,
                        writable: true,
                        configurable: true,
                        enumerable: true
                    };
                }
            },
            afterEach({ key }) {
                if (key === 'c') {
                    return {
                        get() { return 'baz'; },
                        set() { this.testc = 'qux'; }
                    };
                }
                if (key === 'd') {
                    return {
                        value: 2,
                        writable: true,
                        configurable: true,
                        enumerable: true
                    };
                }
            },
        })({}, obj1);
        const aDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'a');
        const cDescriptor = Object.getOwnPropertyDescriptor(mergedObj, 'c');

        expect(typeof mergedObj.a).toBe('string');
        expect(mergedObj.a).toBe('foo');
        expect('get' in aDescriptor).toBe(true);
        expect(typeof aDescriptor.get).toBe('function');
        expect('set' in aDescriptor).toBe(true);
        expect(typeof aDescriptor.set).toBe('function');
        expect(mergedObj.testa).toBeUndefined();
        mergedObj.a = 2;
        expect(mergedObj.testa).toBe('bar');

        expect(typeof mergedObj.b).toBe('number');
        expect(mergedObj.b).toBe(2);

        expect(typeof mergedObj.c).toBe('string');
        expect(mergedObj.c).toBe('baz');
        expect('get' in cDescriptor).toBe(true);
        expect(typeof cDescriptor.get).toBe('function');
        expect('set' in cDescriptor).toBe(true);
        expect(typeof cDescriptor.set).toBe('function');
        expect(mergedObj.testc).toBeUndefined();
        mergedObj.c = 2;
        expect(mergedObj.testc).toBe('qux');

        expect(typeof mergedObj.d).toBe('number');
        expect(mergedObj.d).toBe(2);

        expect(mergedObj).toMatchSnapshot();
    });
});
