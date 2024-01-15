import {
    getInMultiple,
    getInAll,
    getNotInMultiple,
    getNotInAll,
    getObjectKeys,
    isObject,
    isPropDescriptor
} from './util.js';

const defaults = {
    // Keys
    onlyKeys: [],
    skipKeys: [],
    onlyCommonKeys: false,
    onlyUniversalKeys: false,
    skipCommonKeys: false,
    skipUniversalKeys: false,
    // Values
    invokeGetters: false,
    skipSetters: false,
    // Arrays
    appendArrays: false,
    prependArrays: false,
    dedupArrays: false,
    sortArrays: false,
    // Prototype
    hoistEnumerable: false,
    hoistProto: false,
    skipProto: false,
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
 *   invokeGetters: false,
 *   skipSetters: false,
 *   // Arrays
 *   appendArrays: false,
 *   prependArrays: false,
 *   dedupArrays: false,
 *   sortArrays: false,
 *   // Prototype
 *   hoistEnumerable: false,
 *   hoistProto: false,
 *   skipProto: false,
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
 * @param {boolean} [options.invokeGetters = false] - Invoke "getter" methods
 * and merge returned values
 * @param {boolean} [options.skipSetters = false] - Skip "setter" methods during
 * merge
 * @param {boolean} [options.appendArrays = false] - Merge array values at the
 * end of existing arrays
 * @param {boolean} [options.prependArrays = false] - Merge array values at the
 * beginning of existing arrays
 * @param {boolean} [options.dedupArrays = false] - Remove duplicate array
 * values in new merged object
 * @param {boolean|function} [options.sortArrays = false] - Sort array values in
 * new merged object
 * @param {boolean} [options.hoistEnumerable = false] - Merge enumerable
 * prototype properties as direct properties of merged object
 * @param {boolean} [options.hoistProto = false] - Merge custom prototype
 * properties as direct properties of merged object
 * @param {boolean} [options.skipProto = false] - Skip merging of custom
 * prototype properties
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
export default function mergician(...optionsOrObjects) {
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
        return getObjectKeys(obj, settings.hoistEnumerable);
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

        const newObjProps = objects.reduce((targetObj, srcObj) => {
            circularRefs.set(srcObj, targetObj);

            let keys = mergeKeyList || _getObjectKeys(srcObj);

            if (settings.skipKeys.length) {
                keys = keys.filter(key => settings.skipKeys.indexOf(key) === -1);
            }

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const targetVal = targetObj[key];

                if (key in srcObj === false) {
                    continue;
                }

                let isReturnVal = false;
                let mergeVal = srcObj[key];

                const srcDescriptor = Object.getOwnPropertyDescriptor(srcObj, key);
                const isSetterOnly = srcDescriptor && typeof srcDescriptor.set === 'function' && typeof srcDescriptor.get !== 'function';

                if (isSetterOnly) {
                    if (!settings.skipSetters) {
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

                let mergeDescriptor;

                if (isReturnVal) {
                    mergeDescriptor = isPropDescriptor(mergeVal) ? mergeVal : {
                        configurable: true,
                        enumerable: true,
                        value: mergeVal,
                        writable: true,
                    };

                    Object.defineProperty(targetObj, key, mergeDescriptor);
                    continue;
                }

                if (isPropDescriptor(mergeVal)) {
                    mergeDescriptor = { ...mergeVal };
                    mergeVal = mergeDescriptor.get ? srcObj[key] : mergeDescriptor.value;
                }
                else {
                    mergeDescriptor = {
                        configurable: true,
                        enumerable: true,
                    };
                }

                if (srcDescriptor) {
                    // eslint-disable-next-line no-unused-vars
                    const { configurable, enumerable, get, set, writable} = srcDescriptor;

                    Object.assign(mergeDescriptor, {
                        configurable,
                        enumerable,
                    });

                    // Invoke getters
                    if (typeof get === 'function') {
                        if (settings.invokeGetters) {
                            mergeDescriptor.value = mergeVal;
                        }
                        else {
                            mergeDescriptor.get = get;
                        }
                    }

                    // Skip setters
                    if (!settings.skipSetters && typeof set === 'function' && !Object.hasOwnProperty.call(mergeDescriptor, 'value')) {
                        mergeDescriptor.set = set;
                    }

                    // Set writable property if not accessors are defined
                    if (!mergeDescriptor.get && !mergeDescriptor.set) {
                        mergeDescriptor.writable = Boolean(writable);
                    }
                }

                if (!mergeDescriptor.get && !mergeDescriptor.set && !('value' in mergeDescriptor)) {
                    mergeDescriptor.value = mergeVal;
                    mergeDescriptor.writable = srcDescriptor && 'writable' in srcDescriptor ? srcDescriptor.writable : true;
                }

                Object.defineProperty(targetObj, key, mergeDescriptor);
            }

            return targetObj;
        }, {});

        // Remove duplicate
        for (const [obj, keyArray] of dedupArrayMap.entries()) {
            for (const key of keyArray) {
                const propDescriptor = Object.getOwnPropertyDescriptor(obj, key);
                const { configurable, enumerable, writable } = propDescriptor;

                // Set static value to handle arrays received from srcObj getter
                Object.defineProperty(obj, key, {
                    configurable,
                    enumerable,
                    value: [...new Set(obj[key])],
                    writable: writable !== undefined ? writable : true,
                });
            }
        }

        // Sort arrays
        for (const [obj, keyArray] of sortArrayMap.entries()) {
            for (const key of keyArray) {
                obj[key].sort(sortArrayFn);
            }
        }

        let newObj = newObjProps;

        // Detect and merge custom prototype properties if available
        if (!settings.skipProto) {
            const customProtos = objects.reduce((protosArr, obj) => {
                const proto = Object.getPrototypeOf(obj);

                if (proto && proto !== Object.prototype) {
                    protosArr.push(proto);
                }

                return protosArr;
            }, []);

            if (customProtos.length) {
                const newObjProto = _mergician(...customProtos);

                if (settings.hoistProto) {
                    newObj = _mergician(newObjProto, newObjProps);
                }
                else {
                    newObj = Object.create(newObjProto, Object.getOwnPropertyDescriptors(newObjProps));
                }
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
