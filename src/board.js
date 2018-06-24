import Position from './position';
import { Man } from './piece';
import Move from './move';
import { SIDES } from './constants';

export default class Board {
	constructor(size) {
		this.size = size;
		this.grid = new Array(size * size);
	}

	exists = pos => (pos.x >= 0 && pos.x <= this.size - 1
		&& pos.y >= 0 && pos.y <= this.size - 1)

	at = (pos) => {
		if (!this.exists(pos)) {
			throw new Error(`Invalid position ${pos.toString()} with board size ${this.size}`);
		}
		return this.grid[pos.x + (this.size * pos.y)];
	}

	setAt = (pos, piece) => {
		if (!this.exists(pos)) {
			throw new Error(`Invalid position ${pos.toString()} with board size ${this.size}`);
		}
		this.grid[pos.x + (this.size * pos.y)] = piece;
		piece.position = pos;
	}

	removeAt = (pos) => {
		if (!this.exists(pos)) {
			throw new Error(`Invalid position ${pos.toString()} with board size ${this.size}`);
		}
		delete this.grid[pos.x + (this.size * pos.y)];
	}

	/* eslint-disable prefer-template */
	toString = () => (
		[...Array(this.size)].reduce((row, _, y) => (
			row + [...Array(this.size)].reduce((col, __, x) => {
				const cell = this.at(new Position(x, y));
				return col + (cell ? cell.toString() : '_') + '|';
			}, '|') + '\n'
		), '')
	)
	/* eslint-enable prefer-template */

	// Add pieces to each player and to the board
	init = (player1, player2) => {
		const numberOfOccupiedRows = (this.size / 2) - 1; // Always 2 empty lines in the middle

		for (let y = 0; y < numberOfOccupiedRows; y += 1) {
			for (let x = 1 - (y % 2); x < this.size; x += 2) {
				const position1 = new Position(
					player1.side === SIDES.NORTH ? x : this.size - x - 1,
					player1.side === SIDES.NORTH ? y : this.size - y - 1,
				);
				const piece1 = new Man(position1, player1);
				player1.pieces.push(piece1);
				this.setAt(position1, piece1);

				const position2 = new Position(
					player2.side === SIDES.NORTH ? x : this.size - x - 1,
					player2.side === SIDES.NORTH ? y : this.size - y - 1,
				);
				const piece2 = new Man(position2, player2);
				player2.pieces.push(piece2);
				this.setAt(position2, piece2);
			}
		}
	}

	get2ClosestPiecesAlongDir = (position, direction) => {
		const pieces = [];
		let nextPosition = position.add(direction);
		while (this.exists(nextPosition) && pieces.length < 2) {
			const nextPiece = this.at(nextPosition);
			if (nextPiece) {
				pieces.push(nextPiece);
			}
			nextPosition = nextPosition.add(direction);
		}
		return pieces;
	}

	getMovesAlongDir = (
		piecePosition, direction, startPosition,
		endPosition = false, takenPiece = false,
	) => {
		const moves = [];

		let nextPosition = startPosition.add(direction);
		while (this.exists(nextPosition) && (!endPosition || !nextPosition.equals(endPosition))) {
			moves.push(new Move(piecePosition, nextPosition, takenPiece));
			nextPosition = nextPosition.add(direction);
		}
		return moves;
	}

	getMoves = (player) => {
		const movesWithoutTake = [];
		const movesWithTake = [];

		player.pieces.forEach((piece) => {
			if (!piece.active) {
				return;
			}

			const moves = piece.getMoves(this);
			if (moves.movesWithoutTake) {
				if (movesWithTake.length === 0) {
					movesWithoutTake.push(...moves.movesWithoutTake);
				}
			} else if (moves.movesWithTake) {
				movesWithTake.push(...moves.movesWithTake);
			}
		});

		if (movesWithTake.length === 0) {
			return movesWithoutTake;
		}

		return movesWithTake;
	}

	applyMove = (move) => {
		console.log(`[applyMove] Move ${move.toString()}`);
		const piece = this.at(move.startPosition);
		this.setAt(move.endPosition, piece);
		this.removeAt(move.startPosition);

		// Promote piece if possible
		const promottedPiece = piece.getPromottedPiece(this);
		if (promottedPiece) {
			this.setAt(move.endPosition, promottedPiece);
			piece.player.pieces.push(promottedPiece);
			move.pieceBeforePromotion = piece;
			piece.active = false;
		}

		if (move.takenPiece) {
			this.removeAt(move.takenPiece.position);
			move.takenPiece.active = false;
		}
	}

	revertMove = (move) => {
		console.log(`[revertMove] Move ${move.toString()}`);
		let piece = this.at(move.endPosition);

		// Reverse promotion if possible
		if (move.pieceBeforePromotion) {
			piece.active = false;
			piece = move.pieceBeforePromotion;
			this.setAt(move.endPosition, piece);
			piece.active = true;
		}

		this.setAt(move.startPosition, piece);
		this.removeAt(move.endPosition);

		if (move.takenPiece) {
			this.setAt(move.takenPiece.position, move.takenPiece);
			move.takenPiece.takenPiece = false;
		}
	}
}
