/**
 * Determines if the value passed was created using the Object constructor
 *
 * @param {*} obj - Value to test
 * @return {boolean}
 */
function isObject(obj) {
    return Boolean(obj && obj.constructor.name === 'Object');
}

module.exports = isObject;
