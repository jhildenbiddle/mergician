/**
 * Finds and returns values found in one array but not the other(s)
 *
 * @example
 * getDifference([1, 2], [2, 3]); // [1, 3]
 * getDifference([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [1, 5]
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {array} List of values
 */
function getDifference(...arrays) {
    const map = {};

    arrays.forEach(array => {
        array.forEach(v => {
            map[v] = v in map !== false;
        });
    });

    return Object.keys(map).filter(v => !map[v]);
}


module.exports = getDifference;
