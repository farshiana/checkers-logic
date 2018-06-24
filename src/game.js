import Board from './board';
import Player from './player';
import { SIDES } from './constants';

export default class Game {
	constructor(size, player1, player2) {
		this.player1 = new Player(player1, SIDES.SOUTH);
		this.player2 = new Player(player2, SIDES.NORTH);
		this.currentPlayer = this.player1;
		this.board = new Board(size);
		this.board.init(this.player1, this.player2);
		this.movesHistory = [];
		this.movesCandidates = [];
		this.initTurn();
	}

	initTurn = () => {
		this.movesCandidates = this.board.getMoves(this.currentPlayer);
	}

	applyMove = (moveIndex) => {
		if (moveIndex < 0 || moveIndex > this.movesCandidates.length - 1) {
			throw new Error(`[applyMove] Invalid moveIndex ${moveIndex}`);
		}

		// Apply move
		const move = this.movesCandidates[moveIndex];
		this.board.applyMove(move);
		this.movesHistory.push(move);

		const piece = this.board.at(move.endPosition);
		const movesWithTake = piece.getMoves(this.board).movesWithTake;
		if (movesWithTake) {
			// Player can take another piece
			this.movesCandidates = movesWithTake;
		} else {
			// Player's turn is over
			this.currentPlayer = this.currentPlayer.sameSide(this.player1) ? this.player2 : this.player1;
			this.initTurn();
		}
	}
}
