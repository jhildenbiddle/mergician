const getIntersection = require('../src/get-intersection');

const arr1 = ['a', 'b', 'c'];
const arr2 = ['b', 'c', 'd'];
const arr3 = ['c', 'd', 'e'];

test('gets intersection of two arrays', () => {
    const result = getIntersection(arr1, arr2);

    expect(result).toMatchSnapshot();
});

test('gets intersection of more than two arrays', () => {
    const result = getIntersection(arr1, arr2, arr3);

    expect(result).toMatchSnapshot();
});
