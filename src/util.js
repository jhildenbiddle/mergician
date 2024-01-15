/**
 * Returns a map of array values and their occurrence count
 *
 * @example
 * countOccurrences([1, 2], [2, 3]); // { 1: 1, 2: 2, 3: 1 }
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {object} Array values and their occurrence count
 */
export function countOccurrences(...arrays) {
    const countObj = {};

    arrays.forEach(array => {
        array.forEach(v => {
            countObj[v] = v in countObj ? ++countObj[v] : 1;
        });
    });

    return countObj;
}

/**
 * Returns values found in all arrays
 *
 * @example
 * getInAll([1, 2], [2, 3]); // [2]
 * getInAll([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [3]
 * getInAll([1, 2, 3, 'x'], [2, 3, 4, 'x'], [3, 4, 5]); // [3]
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {array} List of values
 */
export function getInAll(...arrays) {
    return arrays.reduce((acc, curr) =>
        acc.filter(Set.prototype.has, new Set(curr))
    );
}

/**
 * Returns values found in multiple (possibly all) arrays
 *
 * @example
 * getInMultiple([1, 2], [2, 3]); // [2]
 * getInMultiple([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [2, 3, 4]
 * getInMultiple([1, 2, 3, 'x'], [2, 3, 4, 'x'], [3, 4, 5]); // [2, 3, 4, 'x']
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {array} List of values
 */
export function getInMultiple(...arrays) {
    const countObj = countOccurrences(...arrays);

    return Object.keys(countObj).filter((v) => countObj[v] > 1);
}

/**
 * Returns values not found in all arrays
 *
 * @example
 * getNotInAll([1, 2], [2, 3]); // [1, 3]
 * getNotInAll([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [1, 2, 4, 5]
 * getNotInAll([1, 2, 3, 'x'], [2, 3, 4, 'x'], [3, 4, 5]); // [1, 2, 4, 5, 'x']
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {array} List of values
 */
export function getNotInAll(...arrays) {
    const countObj = countOccurrences(...arrays);

    return Object.keys(countObj).filter((v) => countObj[v] < arrays.length);
}

/**
 * Returns values found in one array only (i.e. not multiple)
 *
 * @example
 * getNotInMultiple([1, 2], [2, 3]); // [1, 3]
 * getNotInMultiple([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [1, 5]
 * getNotInMultiple([1, 2, 3, 'x'], [2, 3, 4, 'x'], [3, 4, 5]); // [1, 5]
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {array} List of values
 */
export function getNotInMultiple(...arrays) {
    const countObj = countOccurrences(...arrays);

    return Object.keys(countObj).filter((v) => countObj[v] === 1);
}

/**
 * Returns array of an object's own keys and (optionally) the enumerable keys
 * from the object's prototype chain.
 *
 * @example
 * getObjectKeys({ a: 1 }); // ['a']
 * getObjectKeys({ a: 1 }, true); // ['a', 'b', 'c', ...]
 *
 * @param {object} obj - Object to parse
 * @param {boolean} hoistEnumerable include enumerable prototype properties
 * @return {array} List of keys
 */
export function getObjectKeys(obj, hoistEnumerable = false) {
    const keys = Object.getOwnPropertyNames(obj);

    if (hoistEnumerable) {
        for (const key in obj) {
            !keys.includes(key) && keys.push(key);
        }
    }

    return keys;
}

/**
 * Determines if the value passed was created using the Object constructor
 *
 * @param {*} obj - Value to test
 * @return {boolean}
 */
export function isObject(value) {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
}

/**
 * Determines if the value passed is a property descriptor
 *
 * @param {*} obj - Value to test
 * @return {boolean}
 */
export function isPropDescriptor(obj) {
    if (!isObject(obj)) {
        return false;
    }

    const hasFlagKey = ['writable', 'enumerable', 'configurable'].some(key => key in obj);
    const hasMethod = ['get', 'set'].some(key => typeof obj[key] === 'function');
    const hasMethodKeys = ['get', 'set'].every(key => key in obj);

    let isDescriptor = (
        ('value' in obj && hasFlagKey) ||
        (hasMethod && (hasMethodKeys || hasFlagKey))
    );

    // Test for invalid key(s)
    if (isDescriptor) {
        const validKeys = [
            'configurable',
            'get',
            'set',
            'enumerable',
            'value',
            'writable'
        ];

        isDescriptor = Object.keys(obj).some(key => !(key in validKeys));
    }

    return isDescriptor;
}
