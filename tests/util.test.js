const {
    countOccurrences,
    getInMultiple,
    getInAll,
    getNotInMultiple,
    getNotInAll,
    getObjectKeys,
    isObject,
    isPropDescriptor
} = require('../src/util');

const arr1 = ['a', 'b', 'c'];
const arr2 = ['b', 'c', 'd'];
const arr3 = ['c', 'd', 'e'];
const testObj = Object.create(
    // Prototype (standard object)
    Object.create(null, {
        enumerableTrue: {
            configurable: true,
            enumerable: true,
            value: true,
            writable: true,
        },
        enumerableFalse: {
            configurable: true,
            enumerable: false,
            value: false,
            writable: true,
        }
    }),
    // Properties (descriptors object)
    {
        firstName: {
            enumerable: true,
            value: 'John',
            writable: true,
        },
        lastName: {
            enumerable: true,
            value: 'Smith',
            writable: true,
        },
        fullName: {
            enumerable: false,
            get() {
                return `${this.firstName} ${this.lastName}`;
            },
            set(val) {
                const names = val.replace(/\s+/g, ' ').trim().split(' ');

                this.firstName = names[0] || '';
                this.lastName = names[1] || '';
            },
        }
    }
);

describe('countOccurrences', () => {
    test('generates map', () => {
        const result = countOccurrences(arr1, arr2, arr3);

        expect(result).toMatchSnapshot();
    });
});

describe('getInMultiple', () => {
    test('gets common values in two arrays', () => {
        const result = getInMultiple(arr1, arr2);

        expect(result).toMatchSnapshot();
    });

    test('gets common values found in multiple arrays', () => {
        const result = getInMultiple(arr1, arr2, arr3);

        expect(result).toMatchSnapshot();
    });
});

describe('getInAll', () => {
    test('gets universal values in two arrays', () => {
        const result = getInAll(arr1, arr2);

        expect(result).toMatchSnapshot();
    });

    test('gets universal values in multiple arrays', () => {
        const result = getInAll(arr1, arr2, arr3);

        expect(result).toMatchSnapshot();
    });
});

describe('getNotInMultiple', () => {
    test('gets values found in one of two arrays', () => {
        const result = getNotInMultiple(arr1, arr2);

        expect(result).toMatchSnapshot();
    });

    test('gets values found in one of multiple arrays', () => {
        const result = getNotInMultiple(arr1, arr2, arr3);

        expect(result).toMatchSnapshot();
    });
});

describe('getNotInAll', () => {
    test('gets values not found in two arrays', () => {
        const result = getNotInAll(arr1, arr2);

        expect(result).toMatchSnapshot();
    });

    test('gets values not found in three arrays', () => {
        const result = getNotInAll(arr1, arr2, arr3);

        expect(result).toMatchSnapshot();
    });
});

describe('getObjectKeys', () => {
    test('gets own properties', () => {
        const result = getObjectKeys(testObj);

        expect(result).toMatchSnapshot();
    });

    test('gets enumerable properties', () => {
        const result = getObjectKeys(testObj, true);

        expect(result).toMatchSnapshot();
    });
});

describe('isObject', () => {
    test('true of object literal', () => {
        expect(isObject({})).toBe(true);
    });

    test('false for array', () => {
        expect(isObject([])).toBe(false);
    });

    test('false for function', () => {
        expect(isObject(Function.prototype)).toBe(false);
    });
});

describe('isPropDescriptor', () => {
    test('false when not an object', () => {
        const result = isPropDescriptor(null);

        expect(result).toBe(false);
    });

    test('false without a descriptor property', () => {
        const result = isPropDescriptor({ a: 1 });

        expect(result).toBe(false);
    });

    test('true with value and another descriptor prop', () => {
        const result = isPropDescriptor({
            configurable: true,
            value: true,
        });

        expect(result).toBe(true);
    });

    test('true with get and a descriptor prop', () => {
        const result = isPropDescriptor({
            get() { return true; },
            enumerable: true,
        });

        expect(result).toBe(true);
    });

    test('true with set and a descriptor prop', () => {
        const result = isPropDescriptor({
            set() { this.test = true; },
            enumerable: true,
        });

        expect(result).toBe(true);
    });

    test('true with only get and set', () => {
        const result = isPropDescriptor({
            get() { return true; },
            set() { this.test = true; },
        });

        expect(result).toBe(true);
    });
});