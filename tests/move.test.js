import Position from '../src/position';
import Move from '../src/move';

describe('Move', () => {
	test('toString', () => {
		const move = new Move(new Position(1, 2), new Position(3, 4));
		expect(move.toString()).toEqual('(1, 2) -> (3, 4)');
	});

	test('toJSON', () => {
		const move = new Move(new Position(1, 2), new Position(3, 4));
		expect(move.toJSON()).toEqual({
			end: { x: 3, y: 4 },
			piece: false,
			pieceBeforePromotion: false,
			start: {x: 1, y: 2},
		});
	});
});
