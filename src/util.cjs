/**
 * Returns a map of array values and their occurrence count
 *
 * @example
 * countOccurrences([1, 2], [2, 3]); // { 1: 1, 2: 2, 3: 1 }
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {object} Array values and their occurrence count
 */
function countOccurrences(...arrays) {
    const countObj = {};

    arrays.forEach(array => {
        array.forEach(v => {
            countObj[v] = v in countObj ? ++countObj[v] : 1;
        });
    });

    return countObj;
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
function getInMultiple(...arrays) {
    const countObj = countOccurrences(...arrays);

    return Object.keys(countObj).filter((v) => countObj[v] > 1);
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
function getInAll(...arrays) {
    return arrays.reduce((acc, curr) =>
        acc.filter(Set.prototype.has, new Set(curr))
    );
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
function getNotInMultiple(...arrays) {
    const countObj = countOccurrences(...arrays);

    return Object.keys(countObj).filter((v) => countObj[v] === 1);
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
function getNotInAll(...arrays) {
    const countObj = countOccurrences(...arrays);

    return Object.keys(countObj).filter((v) => countObj[v] < arrays.length);
}

/**
 * Determines if the value passed was created using the Object constructor
 *
 * @param {*} obj - Value to test
 * @return {boolean}
 */
function isObject(obj) {
    return Boolean(obj && obj.constructor.name === 'Object');
}

module.exports = {
    countOccurrences,
    getInMultiple,
    getInAll,
    getNotInMultiple,
    getNotInAll,
    isObject
};
