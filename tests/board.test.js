import Board from '../src/board';
import Player from '../src/player';
import Position from '../src/position';
import { Piece, Man, King } from '../src/piece';
import { SIDES } from '../src/constants';

describe('Board', () => {
	test('exists', () => {
		const board = new Board(8);
		expect(board.exists(new Position(4, 4))).toEqual(true);
		expect(board.exists(new Position(9, 4))).toEqual(false);
	});

	test('at', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const player2 = new Player('player2', SIDES.SOUTH);
		const board = new Board(8);

		board.init(player1, player2);
		const piece = board.at(new Position(1, 0));
		expect(piece.player).toEqual(player1);
	});

	test('setAt', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const board = new Board(8);
		const position = new Position(2, 4);

		board.setAt(position, new Piece(position, player1));
		const piece = board.at(position);
		expect(piece.player).toEqual(player1);
	});

	test('removeAt', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const board = new Board(8);
		const position = new Position(2, 4);

		board.setAt(position, new Piece(position, player1));
		board.removeAt(position);
		const piece = board.at(position);
		expect(piece).toEqual(undefined);
	});

	test('toString', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const board = new Board(8);

		const position = new Position(2, 4);
		board.setAt(position, new Man(position, player1));

		const position2 = new Position(4, 4);
		board.setAt(position2, new King(position2, player1));

		const str = '|_|_|_|_|_|_|_|_|\n|_|_|_|_|_|_|_|_|\n|_|_|_|_|_|_|_|_|\n|_|_|_|_|_|_|_|_|\n|_|_|o|_|K|_|_|_|\n|_|_|_|_|_|_|_|_|\n|_|_|_|_|_|_|_|_|\n|_|_|_|_|_|_|_|_|\n';
		expect(board.toString()).toEqual(str);
	});

	test('init', () => {
		const player1 = new Player('player1', SIDES.NORTH);
		const player2 = new Player('player2', SIDES.SOUTH);

		const board = new Board(8);
		board.init(player1, player2);
		expect(board.toString()).toEqual('|_|o|_|o|_|o|_|o|\n|o|_|o|_|o|_|o|_|\n|_|o|_|o|_|o|_|o|\n|_|_|_|_|_|_|_|_|\n|_|_|_|_|_|_|_|_|\n|o|_|o|_|o|_|o|_|\n|_|o|_|o|_|o|_|o|\n|o|_|o|_|o|_|o|_|\n');
	});

	test('get2ClosestPiecesAlongDir', () => {
		const board = new Board(8);
		const player = new Player();
		const position = new Position(1, 1);

		const position1 = new Position(3, 3);
		const piece1 = new Piece(position1, player);
		board.setAt(position1, piece1);

		const [nextPiece1, nextPiece2] = board.get2ClosestPiecesAlongDir(position, position);
		expect(nextPiece1).toEqual(piece1);
		expect(nextPiece2).toEqual(undefined);
	});

	test('getMovesAlongDir', () => {
		const board = new Board(8);
		const position = new Position(1, 1);
		const endPosition = new Position(5, 5);

		let moves = board.getMovesAlongDir(position, position, position);
		expect(moves.length).toEqual(6);

		moves = board.getMovesAlongDir(position, position, position, endPosition);
		expect(moves.length).toEqual(3);
	});
});
