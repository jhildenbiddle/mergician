const getDifference = require('../src/get-difference');

const arr1 = ['a', 'b', 'c'];
const arr2 = ['b', 'c', 'd'];
const arr3 = ['c', 'd', 'e'];

test('gets difference between two arrays', () => {
    const result = getDifference(arr1, arr2);

    expect(result).toMatchSnapshot();
});

test('gets difference between more than two arrays', () => {
    const result = getDifference(arr1, arr2, arr3);

    expect(result).toMatchSnapshot();
});
