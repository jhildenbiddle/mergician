/**
 * Test mergician typedef
 */
import mergician from 'mergician';

const obj1 = { a: [1, 1], b: { c: 1, d: 1 } };
const obj2 = { a: [2, 2], b: { c: 2 } };
const obj3 = { e: 3 };

const clonedObj = mergician({}, obj1);
console.log('Typescript clonedObj', clonedObj);

const mergedObj = mergician({
	skipKeys: ['d'],
	appendArrays: true,
	dedupArrays: true,
	filter({ depth, key, srcObj, srcVal, targetObj, targetVal }) {
		if (key === 'e') {
			targetObj['hello'] = 'world';
			return false;
		}
	}
})(obj1, obj2, obj3);
console.log('Typescript mergedObj', mergedObj);

console.info('OK! 🚀')
