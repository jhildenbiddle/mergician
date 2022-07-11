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
    sortArrays: false,
    // Callbacks
    filter: Function.prototype,
    beforeEach: Function.prototype,
    afterEach: Function.prototype,
};

function isPropDescriptor(obj) {
    if (!isObject(obj)) {
        return false;
    }

    return (
        'get' in obj && typeof obj.get === 'function' ||
        'set' in obj && typeof obj.set === 'function' ||
        'value' in obj && ('writable' in obj || 'enumerable' in obj || 'configurable' in obj)
    );
}

/**
 * Deep recursive object merging with options to inspect, modify, and filter
 * keys/values, merge arrays (append/prepend), and remove duplicate values from
 * merged arrays. Returns new object without modifying sources (immutable).
 *
 * @preserve
 *
 * @example
 * // Without options (use default option values)
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
 *   sortArrays: false,
 *   // Callbacks
 *   filter({ srcVal, targetVal, key, srcObj, targetObj, depth }) {},
 *   beforeEach({ srcVal, targetVal, key, srcObj, targetObj, depth }) {},
 *   afterEach({ mergeVal, key, mergeObj, depth }) {},
 * })(obj1, obj2, obj3, ...)
 *
 * @param {...object} optionsOrObjects - Options or objects to merge
 * @param {array} [options.onlyKeys] - Exclusive array of keys to be merged
 * (others are skipped)
 * @param {array} [options.skipKeys] - Array of keys to skip (others are merged)
 * @param {boolean} [options.onlyCommonKeys = false] - Merge only keys found in
 * multiple objects (ignore single occurrence keys)
 * @param {boolean} [options.onlyUniversalKeys = false] - Merge only keys found
 * in all objects
 * @param {boolean} [options.skipCommonKeys = false] - Skip keys found in
 * multiple objects (merge only single occurrence keys)
 * @param {boolean} [options.skipUniversalKeys = false] - Skip keys found in all
 * objects (merge only common keys)
 * @param {boolean} [options.appendArrays = false] - Merge array values at the
 * end of existing arrays
 * @param {boolean} [options.prependArrays = false] - Merge array values at the
 * beginning of existing arrays
 * @param {boolean} [options.dedupArrays = false] - Remove duplicate array
 * values in new merged object
 * @param {boolean|function} [options.sortArrays = false] - Sort array values in
 * new merged object
 * @param {function} [options.filter] - Callback used to conditionally merge or
 * skip a property. Return a "truthy" value to merge or a "falsy" value to skip.
 * Return no value to proceed according to other option values.
 * @param {function} [options.beforeEach] - Callback used for
 * inspecting/modifying properties before merge. Return value is used as value
 * to merge.
 * @param {function} [options.afterEach] - Callback used for
 * inspecting/modifying properties after merge. Return value is used as merged
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
    const sortArrayMap = new Map();
    const sortArrayFn = typeof settings.sortArrays === 'function' ? settings.sortArrays : undefined;

    let mergeDepth = 0;

    function _mergeDeep(...objects) {
        let mergeKeyList;

        if (objects.length > 1) {
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
        }

        if (!mergeKeyList && settings.onlyKeys.length) {
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

                const srcVal = srcObj[key];
                const targetVal = targetObj[key];

                let mergeVal = srcVal;

                if (settings.filter !== defaults.filter) {
                    const returnVal = settings.filter({
                        srcVal: mergeVal,
                        targetVal,
                        key,
                        srcObj,
                        targetObj,
                        depth: mergeDepth
                    });

                    if (returnVal !== undefined && !returnVal) {
                        continue;
                    }
                }

                if (settings.beforeEach !== defaults.beforeEach) {
                    const returnVal = settings.beforeEach({
                        srcVal: mergeVal,
                        targetVal,
                        key,
                        srcObj,
                        targetObj,
                        depth: mergeDepth
                    });

                    mergeVal = returnVal !== undefined ? returnVal : mergeVal;
                }

                if (Array.isArray(mergeVal)) {
                    mergeVal = [...mergeVal];

                    if (Array.isArray(targetVal)) {
                        if (settings.appendArrays) {
                            mergeVal = [...targetVal, ...mergeVal];
                        }
                        else if (settings.prependArrays) {
                            mergeVal = [...mergeVal, ...targetVal];
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
                            const keyArray = dedupArrayMap.get(targetObj);

                            if (keyArray && !keyArray.includes(key)) {
                                keyArray.push(key);
                            }
                            else {
                                dedupArrayMap.set(targetObj, [key]);
                            }
                        }
                    }

                    if (settings.sortArrays) {
                        // If a user-defined afterEach callback exists, sort the
                        // array so the expected value is returned (slower)
                        if (settings.afterEach !== defaults.afterEach) {
                            mergeVal = mergeVal.sort(sortArrayFn);
                        }
                        // If not, store a reference to the array so duplicates
                        // can be removed after merge is complete (faster)
                        else {
                            const keyArray = sortArrayMap.get(targetObj);

                            if (keyArray && !keyArray.includes(key)) {
                                keyArray.push(key);
                            }
                            else {
                                sortArrayMap.set(targetObj, [key]);
                            }
                        }
                    }
                }
                else if (isObject(mergeVal) && !isPropDescriptor(mergeVal)) {
                    mergeDepth++;

                    if (isObject(targetVal)) {
                        mergeVal = _mergeDeep(targetVal, mergeVal);
                    }
                    else {
                        mergeVal = _mergeDeep(mergeVal);
                    }

                    mergeDepth--;
                }

                if (settings.afterEach !== defaults.afterEach) {
                    const returnVal = settings.afterEach({
                        mergeVal,
                        key,
                        targetObj,
                        depth: mergeDepth
                    });

                    mergeVal = returnVal !== undefined ? returnVal : mergeVal;
                }

                // New descriptor returned via callback
                if (isPropDescriptor(mergeVal)) {
                    // Defining properties using Object.defineProperty() works
                    // different than using the assignment operator (obj.a = 1).
                    // Specifically, the descriptor properties 'configurable',
                    // 'enumerable', and 'writable' default to 'false' when
                    // using Object.defineProperty() but to 'true' when using
                    // the assignment operator. The code below ensures that
                    // descriptors returned from callbacks are treated as if
                    // they were assigned using the assignment operator unless
                    // those properties are explicitly defined in the
                    // descriptor. This allow merging properties that may
                    // otherwise fail due to 'configurable' or 'writable' being
                    // set to 'false'.

                    // Accessor and data descriptor
                    mergeVal.configurable = !('configurable' in mergeVal) ? true : mergeVal.configurable;
                    mergeVal.enumerable = !('enumerable' in mergeVal) ? true : mergeVal.enumerable;

                    // Data descriptor
                    if ('value' in mergeVal && !('writable' in mergeVal)) {
                        mergeVal.writable = true;
                    }

                    Object.defineProperty(targetObj, key, mergeVal);
                }
                else {
                    const mergeDescriptor = Object.getOwnPropertyDescriptor(srcObj, key);

                    // Accessors (getter/setter)
                    if ('get' in mergeDescriptor) {
                        Object.defineProperty(targetObj, key, mergeDescriptor);
                    }
                    // Standard values
                    else {
                        targetObj[key] = mergeVal;
                    }
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

        // Sort arrays
        for (const [obj, keyArray] of sortArrayMap.entries()) {
            for (const key of keyArray) {
                obj[key].sort(sortArrayFn);
            }
        }

        return result;
    }

    // With options
    // Ex: mergeDeep({...})
    if (arguments.length === 1) {
        return function (...objects) {
            // Options passed to custom merge function
            if (arguments.length === 1) {
                return mergeDeep({ ...settings, ...objects[0] });
            }
            else {
                return _mergeDeep(...objects);
            }
        };
    }
    // Without options
    // Ex: mergeDeep(obj1, obj2);
    else {
        return _mergeDeep(...arguments);
    }
}

module.exports = mergeDeep;
