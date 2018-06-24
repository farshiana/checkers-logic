import Player from '../src/player';
import { SIDES } from '../src/constants';

describe('Player', () => {
	test('sameSide', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const player2 = new Player('player2', SIDES.SOUTH);

		expect(player1.sameSide(player1)).toEqual(true);
		expect(player1.sameSide(player2)).toEqual(false);
	});
});
