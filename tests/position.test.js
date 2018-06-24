import Position from '../src/position';

describe('Position', () => {
	test('add', () => {
		const position1 = new Position(1, 2);
		const position2 = new Position(2, 3);
		const sum = position1.add(position2);
		expect(sum.x).toEqual(3);
		expect(sum.y).toEqual(5);
	});

	test('mul', () => {
		const position = new Position(1, 2);
		const mul = position.mul(3);
		expect(mul.x).toEqual(3);
		expect(mul.y).toEqual(6);
	});

	test('toString', () => {
		const position = new Position(1, 2);
		expect(position.toString()).toEqual('(1, 2)');
	});

	test('equals', () => {
	});
});
