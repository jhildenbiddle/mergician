/**
 * Determines if the argument passed was created using the Object constructor
 *
 * @param {*} obj - Object to test
 * @return {boolean}
 */
function isObject(obj) {
    return Boolean(obj && obj.constructor.name === 'Object');
}

module.exports = isObject;
