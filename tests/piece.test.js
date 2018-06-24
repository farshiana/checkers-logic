import { King, Man, Piece } from '../src/piece';
import Position from '../src/position';
import Player from '../src/player';
import Board from '../src/board';
import { SIDES } from '../src/constants';

describe('Piece', () => {
	test('sameSide', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const player2 = new Player('player2', SIDES.SOUTH);

		const position = new Position(2, 4);
		const man1 = new Man(position, player1);
		const man2 = new Man(position, player1);
		const man3 = new Man(position, player2);
		expect(man1.sameSide(man2)).toEqual(true);
		expect(man1.sameSide(man3)).toEqual(false);
	});

	test('toString', () => {
		const king = new King();
		expect(king.toString()).toEqual('K');

		const man = new Man();
		expect(man.toString()).toEqual('o');
	});

	test('getDirections', () => {
		const king = new King(new Position(2, 4), new Player());
		expect(king.getDirections().length).toEqual(4);

		const man = new Man(new Position(2, 4), new Player());
		expect(man.getDirections().length).toEqual(2);
	});

	test('getMoves', () => {
		let board = new Board(8);
		const player1 = new Player('player1', SIDES.NORTH);
		const player2 = new Player('player2', SIDES.SOUTH);
		const position = new Position(1, 1);
		const king = new King(position, player1);
		const man = new Man(position, player1);

		// --- KING --- //
		// With no piece
		board.setAt(position, king);
		let moves = king.getMoves(board);
		expect(moves.movesWithoutTake.length).toEqual(9);

		// With piece of same side
		let firstPiecePosition = new Position(3, 3);
		board.setAt(firstPiecePosition, new Man(firstPiecePosition, player1));
		moves = king.getMoves(board);
		expect(moves.movesWithoutTake.length).toEqual(4);

		// With piece on opponent side
		board.setAt(firstPiecePosition, new King(firstPiecePosition, player2));
		moves = king.getMoves(board);
		expect(moves.movesWithTake.length).toEqual(4);

		// With two pieces on opponent side
		let secondPiecePosition = new Position(6, 2);
		board.setAt(secondPiecePosition, new King(secondPiecePosition, player2));
		moves = king.getMoves(board);
		expect(moves.movesWithTake.length).toEqual(1);

		// --- MAN --- //
		// With no piece
		board = new Board(8);
		board.setAt(position, man);
		moves = man.getMoves(board);
		expect(moves.movesWithoutTake.length).toEqual(2);

		// With piece of same side
		firstPiecePosition = new Position(2, 2);
		board.setAt(firstPiecePosition, new Man(firstPiecePosition, player1));
		moves = man.getMoves(board);
		expect(moves.movesWithoutTake.length).toEqual(1);

		// With piece on opponent side
		board.setAt(firstPiecePosition, new Man(firstPiecePosition, player2));
		moves = man.getMoves(board);
		expect(moves.movesWithTake.length).toEqual(1);

		// With two pieces on opponent side
		secondPiecePosition = new Position(4, 2);
		board.setAt(secondPiecePosition, new Man(secondPiecePosition, player2));
		moves = man.getMoves(board);
		expect(moves.movesWithTake.length).toEqual(1);
	});

	test('toJSON', () => {
		const player = new Player('player', SIDES.NORTH);
		const position = new Position(1, 2);
		const king = new King(position, player);

		expect(king.toJSON()).toEqual({
			king: true,
			player: 'player',
			x: 1,
			y: 2,
		});
	});
});
