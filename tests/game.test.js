import Game from '../src/game';

describe('Game', () => {
	test('inits turn', () => {
		const game = new Game(8, 'player1', 'player2');

		expect(game.movesCandidates.length).toEqual(7);
	});
});
