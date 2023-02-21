const {
    getInMultiple,
    getInAll,
    getNotInMultiple,
    getNotInAll,
    getObjectKeys,
    isObject,
    isPropDescriptor
} = require('./util.cjs');

const defaults = {
    // Keys
    onlyKeys: [],
    skipKeys: [],
    onlyCommonKeys: false,
    onlyUniversalKeys: false,
    skipCommonKeys: false,
    skipUniversalKeys: false,
    // Values
    mergeGetterValues: false,
    skipSetters: false,
    // Arrays
    appendArrays: false,
    prependArrays: false,
    dedupArrays: false,
    sortArrays: false,
    // Prototype
    hoistProto: false,
    // Callbacks
    filter: Function.prototype,
    beforeEach: Function.prototype,
    afterEach: Function.prototype,
    onCircular: Function.prototype,
};

/**
 * Deep recursive object merging with options to inspect, modify, and filter
 * keys/values, merge arrays (append/prepend), and remove duplicate values from
 * merged arrays. Returns new object without modifying sources (immutable).
 *
 * @preserve
 *
 * @example
 * // Without options (use default option values)
 * mergician(obj1, obj2, obj3, ...);
 *
 * @example
 * // With options (defaults shown)
 * mergician({
 *   // Keys
 *   onlyKeys: [],
 *   skipKeys: [],
 *   onlyCommonKeys: false,
 *   onlyUniversalKeys: false,
 *   skipCommonKeys: false,
 *   skipUniversalKeys: false,
 *   // Values
 *   mergeGetterValues: false,
 *   skipSetters: false,
 *   // Arrays
 *   appendArrays: false,
 *   prependArrays: false,
 *   dedupArrays: false,
 *   sortArrays: false,
 *   // Prototype
 *   hoistProto: false,
 *   // Callbacks
 *   filter({ depth, key, srcObj, srcVal, targetObj, targetVal }) {},
 *   beforeEach({ depth, key, srcObj, srcVal, targetObj, targetVal }) {},
 *   afterEach({ depth, key, mergeVal, srcObj, targetObj }) {},
 *   onCircular({ depth, key, srcObj, srcVal, targetObj, targetVal }) {}
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
 * @param {boolean} [options.mergeGetterValues = false] - Merge "getter" values
 * instead of methods
 * @param {boolean} [options.skipSetters = false] - Do not merge "setter"
 * methods
 * @param {boolean} [options.appendArrays = false] - Merge array values at the
 * end of existing arrays
 * @param {boolean} [options.prependArrays = false] - Merge array values at the
 * beginning of existing arrays
 * @param {boolean} [options.dedupArrays = false] - Remove duplicate array
 * values in new merged object
 * @param {boolean|function} [options.sortArrays = false] - Sort array values in
 * new merged object
 * @param {boolean} [options.hoistProto = false] - Clone prototype properties as
 * direct properties of merged/cloned object
 * @param {function} [options.filter] - Callback used to conditionally merge or
 * skip a property. Return a "truthy" value to merge or a "falsy" value to skip.
 * Return no value to proceed according to other option values.
 * @param {function} [options.beforeEach] - Callback used for
 * inspecting/modifying properties before merge. Return value is used as value
 * to merge.
 * @param {function} [options.afterEach] - Callback used for
 * inspecting/modifying properties after merge. Return value is used as merged
 * value.
 * @param {function} [options.onCircular] - Callback used for handling circular
 * object references during merge
 * @returns {function|object} Merge function with options applied or new merged
 * object
 * @param {...object} [objects] - Objects to merge
 * @returns {object} New merged object
 */
function mergician(...optionsOrObjects) {
    const options = arguments.length === 1 ? arguments[0] : {};
    const settings = { ...defaults, ...options };
    const dedupArrayMap = new Map();
    const sortArrayMap = new Map();
    const sortArrayFn = typeof settings.sortArrays === 'function' ? settings.sortArrays : undefined;

    // Store circular references from source and reassign to target
    // Key = original source reference
    // Value = cloned/merged target reference
    const circularRefs = new WeakMap();

    let mergeDepth = 0;

    function _getObjectKeys(obj) {
        return getObjectKeys(obj, settings.hoistProto);
    }

    function _mergician(...objects) {
        let mergeKeyList;

        if (objects.length > 1) {
            if (settings.onlyCommonKeys) {
                mergeKeyList = getInMultiple(...objects.map(obj => _getObjectKeys(obj)));
            }
            else if (settings.onlyUniversalKeys) {
                mergeKeyList = getInAll(...objects.map(obj => _getObjectKeys(obj)));
            }
            else if (settings.skipCommonKeys) {
                mergeKeyList = getNotInMultiple(...objects.map(obj => _getObjectKeys(obj)));
            }
            else if (settings.skipUniversalKeys) {
                mergeKeyList = getNotInAll(...objects.map(obj => _getObjectKeys(obj)));
            }
        }

        if (!mergeKeyList && settings.onlyKeys.length) {
            mergeKeyList = settings.onlyKeys;
        }

        if (mergeKeyList && mergeKeyList !== settings.onlyKeys && settings.onlyKeys.length) {
            mergeKeyList = mergeKeyList.filter(key => settings.onlyKeys.includes(key));
        }

        const newObj = objects.reduce((targetObj, srcObj) => {
            circularRefs.set(srcObj, targetObj);

            let keys = mergeKeyList || _getObjectKeys(srcObj);

            if (settings.skipKeys.length) {
                keys = keys.filter(key => settings.skipKeys.indexOf(key) === -1);
            }

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const targetVal = targetObj[key];

                let isReturnVal = false;
                let mergeVal;

                if (key in srcObj === false) {
                    continue;
                }

                try {
                    mergeVal = srcObj[key];
                }
                catch(err) {
                    console.error(err);
                    continue;
                }

                const srcDescriptor = Object.getOwnPropertyDescriptor(srcObj, key);
                const isSetterOnly = srcDescriptor && typeof srcDescriptor.set === 'function' && typeof srcDescriptor.get !== 'function';

                if (isSetterOnly) {
                    if (!settings.skipSetters) {
                        srcDescriptor.configurable = true;
                        Object.defineProperty(targetObj, key, srcDescriptor);
                    }

                    continue;
                }

                if (settings.filter !== defaults.filter) {
                    const returnVal = settings.filter({
                        depth: mergeDepth,
                        key,
                        srcObj,
                        srcVal: mergeVal,
                        targetObj,
                        targetVal
                    });

                    if (returnVal !== undefined && !returnVal) {
                        continue;
                    }
                }

                if (settings.beforeEach !== defaults.beforeEach) {
                    const returnVal = settings.beforeEach({
                        depth: mergeDepth,
                        key,
                        srcObj,
                        srcVal: mergeVal,
                        targetObj,
                        targetVal
                    });

                    if (returnVal !== undefined) {
                        isReturnVal = true;
                        mergeVal = returnVal;
                    }
                }

                // Circular references
                if (typeof mergeVal === 'object' && mergeVal !== null) {
                    if (circularRefs.has(srcObj[key])) {
                        const returnVal = settings.onCircular({
                            depth: mergeDepth,
                            key,
                            srcObj,
                            srcVal: srcObj[key],
                            targetObj,
                            targetVal
                        });

                        if (returnVal === undefined) {
                            mergeVal = circularRefs.get(srcObj[key]);
                            targetObj[key] = mergeVal;
                            continue;
                        }

                        isReturnVal = true;
                        mergeVal = returnVal;
                    }
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
                else if (isObject(mergeVal) && (!isReturnVal || !isPropDescriptor(mergeVal))) {
                    mergeDepth++;

                    if (isObject(targetVal)) {
                        mergeVal = _mergician(targetVal, mergeVal);
                    }
                    else {
                        mergeVal = _mergician(mergeVal);
                    }

                    mergeDepth--;
                }

                if (settings.afterEach !== defaults.afterEach) {
                    const returnVal = settings.afterEach({
                        depth: mergeDepth,
                        key,
                        mergeVal,
                        srcObj,
                        targetObj
                    });

                    if (returnVal !== undefined) {
                        isReturnVal = true;
                        mergeVal = returnVal;
                    }
                }

                if (isReturnVal) {
                    if (isPropDescriptor(mergeVal)) {
                        // Descriptor properties 'configurable', 'enumerable',
                        // and 'writable' default to 'false' when using
                        // Object.defineProperty() but to 'true' when using the
                        // assignment operator (obj.a = 1). It is therefore
                        // necessary to set 'configurable' and 'writable'
                        // properties to 'true' to ensure subsequent merge tasks
                        // complete successfully.
                        mergeVal.configurable = true;
                        mergeVal.enumerable = !('enumerable' in mergeVal) ? true : mergeVal.enumerable;

                        if ('value' in mergeVal && !('writable' in mergeVal)) {
                            mergeVal.writable = true;
                        }

                        Object.defineProperty(targetObj, key, mergeVal);
                    }
                    else {
                        targetObj[key] = mergeVal;
                    }
                }
                else {
                    const mergeDescriptor = Object.getOwnPropertyDescriptor(srcObj, key);

                    if (mergeDescriptor && typeof mergeDescriptor.get === 'function' && !settings.mergeGetterValues) {
                        if (settings.skipSetters) {
                            mergeDescriptor.set = undefined;
                        }

                        // Set as configurable for subsequent merges
                        mergeDescriptor.configurable = true;
                        Object.defineProperty(targetObj, key, mergeDescriptor);
                    }
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

        return newObj;
    }

    // With options
    // Ex: mergician({...})
    if (arguments.length === 1) {
        return function (...objects) {
            // Options passed to custom merge function
            if (arguments.length === 1) {
                return mergician({ ...settings, ...objects[0] });
            }
            else {
                return _mergician(...objects);
            }
        };
    }
    // Without options
    // Ex: mergician(obj1, obj2);
    else {
        return _mergician(...arguments);
    }
}

module.exports = mergician;
