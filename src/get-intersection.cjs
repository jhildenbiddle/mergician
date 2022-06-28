/**
 * Finds and returns values found in all arrays
 *
 * @example
 * getIntersection([1, 2], [2, 3]); // [2]
 * getIntersection([1, 2, 3], [2, 3, 4], [3, 4, 5]); // [3]
 *
 * @param {...array} arrays - Arrays to be compared
 * @return {array} List of values
 */
function getIntersection(...arrays) {
    return arrays.reduce((acc, curr) =>
        acc.filter(Set.prototype.has, new Set(curr))
    );
}

module.exports = getIntersection;
