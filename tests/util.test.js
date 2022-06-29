const {
    countOccurrences,
    getInMultiple,
    getInAll,
    getNotInMultiple,
    getNotInAll,
    isObject
} = require('../src/util');

const arr1 = ['a', 'b', 'c'];
const arr2 = ['b', 'c', 'd'];
const arr3 = ['c', 'd', 'e'];

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
