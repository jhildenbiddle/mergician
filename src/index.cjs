const {
    getInMultiple,
    getInAll,
    getNotInMultiple,
    getNotInAll,
    isObject
} = require('./util.cjs');

const defaults = {
    // Keys
    onlyKeys: [],
    skipKeys: [],
    onlyCommonKeys: false,
    onlyUniversalKeys: false,
    skipCommonKeys: false,
    skipUniversalKeys: false,
    // Arrays
    appendArrays: false,
    prependArrays: false,
    dedupArrays: false,
    // Callbacks
    filter: Function.prototype,
    beforeEach: Function.prototype,
    afterEach: Function.prototype,
};

/**
 * Deep recursive object merging with options to inspect, modify, and filter
 * keys/values, merge arrays (append/prepend), and remove duplicate values from
 * merged arrays. Returns new object without modifying sources (immutable).
 *
 * @preserve
 *
 * @example
 * // Without options
 * mergeDeep(obj1, obj2, obj3, ...);
 *
 * @example
 * // With options (defaults shown)
 * mergeDeep({
 *   // Keys
 *   onlyKeys: [],
 *   skipKeys: [],
 *   onlyCommonKeys: false,
 *   onlyUniversalKeys: false,
 *   skipCommonKeys: false,
 *   skipUniversalKeys: false,
 *   // Arrays
 *   appendArrays: false,
 *   prependArrays: false,
 *   dedupArrays: false,
 *   // Callbacks
 *   filter(srcVal, targetVal, key, srcObj, targetObj, depth) {},
 *   beforeEach(srcVal, targetVal, key, srcObj, targetObj, depth) {},
 *   afterEach(mergeVal, key, mergeObj, depth) {},
 * })(obj1, obj2, obj3, ...)
 *
 * @param {...object} optionsOrObjects - Options or objects to merge
 * @param {array} [options.onlyKeys] - Array of keys to merged (others are
 * skipped)
 * @param {array} [options.skipKeys] - Array of keys to skip (others are merged)
 * @param {boolean} [options.onlyCommonKeys = false] - Merge only keys found in
 * multiple objects (ignore single occurrence keys)
 * @param {boolean} [options.onlyUniversalKeys = false] - Merge only keys found in
 * all objects
 * @param {boolean} [options.skipCommonKeys = false] - Skip keys found in
 * multiple objects (merge single occurrence keys)
 * @param {boolean} [options.skipUniversalKeys = false] - Skip keys found in
 * all objects
 * @param {boolean} [options.appendArrays = false] - Merge array values at the
 * end of existing arrays
 * @param {boolean} [options.prependArrays = false] - Merge array values at the
 * beginning of existing arrays
 * @param {boolean} [options.dedupArrays = false] - Remove duplicate values from
 * merged arrays
 * @param {function} [options.filter] - Callback for skipping merging key/value.
 * Return a "truthy" value to merge or a "falsy" value to skip.
 * @param {function} [options.beforeEach] - Callback used for
 * inspecting/modifying key/value before merge. Return value is used as value to
 * merge.
 * @param {function} [options.afterEach] - Callback used for
 * inspecting/modifying key/value after merge. Return value is used as merged
 * value.
 * @returns {function|object} Merge function with options applied or new merged
 * object
 * @param {...object} [objects] - Objects to merge
 * @returns {object} New merged object
 */
function mergeDeep(...optionsOrObjects) {
    const options = arguments.length === 1 ? arguments[0] : {};
    const settings = { ...defaults, ...options };
    const dedupArrayMap = new Map();

    let mergeDepth = 0;

    function _mergeDeep(...objects) {
        let mergeKeyList;

        if (settings.onlyCommonKeys) {
            mergeKeyList = getInMultiple(...objects.map(obj => Object.keys(obj)));
        }
        else if (settings.onlyUniversalKeys) {
            mergeKeyList = getInAll(...objects.map(obj => Object.keys(obj)));

        }
        else if (settings.skipCommonKeys) {
            mergeKeyList = getNotInMultiple(...objects.map(obj => Object.keys(obj)));

        }
        else if (settings.skipUniversalKeys) {
            mergeKeyList = getNotInAll(...objects.map(obj => Object.keys(obj)));

        }
        else if (settings.onlyKeys.length) {
            mergeKeyList = settings.onlyKeys;
        }

        if (mergeKeyList && mergeKeyList !== settings.onlyKeys && settings.onlyKeys.length) {
            mergeKeyList = mergeKeyList.filter(key => settings.onlyKeys.includes(key));
        }

        const result = objects.reduce((targetObj, srcObj) => {
            let keys = mergeKeyList || Object.keys(srcObj);

            if (settings.skipKeys.length) {
                keys = keys.filter(key => settings.skipKeys.indexOf(key) === -1);
            }

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                if (key in srcObj === false) {
                    continue;
                }

                const srcDescriptor = Object.getOwnPropertyDescriptor(srcObj, key);
                const srcVal = srcDescriptor && 'get' in srcDescriptor ? srcDescriptor : srcObj[key];
                const targetDescriptor = Object.getOwnPropertyDescriptor(targetObj, key);
                const targetVal = targetDescriptor && 'get' in targetDescriptor ? targetDescriptor : targetObj[key];

                let mergeVal;

                if (settings.filter !== defaults.filter) {
                    const returnVal = settings.filter(srcVal, targetVal, key, srcObj, targetObj, mergeDepth);

                    if (returnVal !== undefined && !returnVal) {
                        continue;
                    }
                }

                if (settings.beforeEach !== defaults.beforeEach) {
                    const returnVal = settings.beforeEach(srcVal, targetVal, key, srcObj, targetObj, mergeDepth);

                    // Accessor (getter/setter)
                    if (returnVal && isObject(returnVal) && 'get' in returnVal) {
                        mergeVal = {};

                        Object.defineProperty(mergeVal, key, returnVal);
                    }
                    else {
                        mergeVal = returnVal !== undefined ? returnVal : srcVal;
                    }
                }
                else {
                    mergeVal = srcVal;
                }

                if (Array.isArray(mergeVal)) {
                    if (Array.isArray(targetVal)) {
                        if (settings.appendArrays) {
                            mergeVal = [...targetVal, ...mergeVal];
                        }
                        else if (settings.prependArrays) {
                            mergeVal = [...mergeVal, ...targetVal];
                        }
                        else {
                            mergeVal = [...mergeVal];
                        }
                    }

                    if (settings.dedupArrays) {
                        // If a user-defined afterEach callback exists, remove
                        // duplicates so the expected value is returned (slower)
                        if (settings.afterEach !== defaults.afterEach) {
                            mergeVal = [...new Set(mergeVal)];
                        }
                        // If not, store a reference to the array so duplicates
                        // can be removed after merge is complete (faster)
                        else {
                            dedupArrayMap.set(targetObj, [key]);
                        }
                    }
                }
                else if (isObject(targetVal) && isObject(mergeVal) && 'get' in mergeVal === false) {
                    mergeDepth++;

                    mergeVal = _mergeDeep(targetVal, srcVal);

                    mergeDepth--;
                }

                if (settings.afterEach !== defaults.afterEach) {
                    const returnVal = settings.afterEach(mergeVal, key, targetObj, mergeDepth);

                    // Accessor (getter/setter)
                    if (returnVal && isObject(returnVal) && 'get' in returnVal) {
                        mergeVal = {};

                        Object.defineProperty(mergeVal, key, returnVal);
                    }
                    else {
                        mergeVal = returnVal !== undefined ? returnVal : mergeVal;
                    }
                }

                // Accessor (getter/setter)
                if (mergeVal && isObject(mergeVal) && 'get' in mergeVal) {
                    Object.defineProperty(targetObj, key, mergeVal);
                }
                else {
                    targetObj[key] = mergeVal;
                }
            }

            return targetObj;
        }, {});

        // Remove duplicate
        for (const [obj, keyArray] of dedupArrayMap.entries()) {
            for (const key of keyArray) {
                obj[key] = [...new Set(obj[key])];
            }
        }

        return result;
    }

    // With options:
    // Ex: mergeDeep({...})(obj1, obj2);
    if (arguments.length === 1) {
        return function (...objects) {
            return _mergeDeep(...objects);
        };
    }
    // Without options
    // Ex: mergeDeep(obj1, obj2);
    else {
        return _mergeDeep(...arguments);
    }
}

module.exports = mergeDeep;
