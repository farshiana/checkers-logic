import { SIDES } from './constants';
import Position from './position';
import Move from './move';

export class Piece {
	constructor(position, player) {
		this.position = position;
		this.player = player;
		this.active = true;
	}

	sameSide = piece => piece.player.sameSide(this.player)
}

export class King extends Piece {
	toString = () => 'K'

	getDirections = () => (
		[new Position(-1, 1), new Position(1, 1), new Position(-1, -1), new Position(1, -1)]
	)

	getPromottedPiece = () => false

	getMoves = (board, checkDoubleTake = true) => {
		console.log(`[getMoves] For piece ${this.toString()} on position ${this.position.toString()}`);
		const directions = this.getDirections();
		const movesWithoutTake = [];
		const movesWithTake = [];

		// Check available moves in all directions
		directions.forEach((direction) => {
			console.log(`[getMoves] Studying direction ${direction.toString()}`);

			const [piece1, piece2] = board.get2ClosestPiecesAlongDir(this.position, direction);
			if (!piece1) {
				console.log('[getMoves] No piece in this direction');
				// Add all moves until board limit
				movesWithoutTake.push(...board.getMovesAlongDir(this.position, direction, this.position));
				return;
			}

			if (this.sameSide(piece1)) {
				console.log(`[getMoves] Piece ${piece1.position.toString()} on the same side in this direction`);
				// Add all moves until piece1
				movesWithoutTake.push(...board.getMovesAlongDir(
					this.position,
					direction,
					this.position,
					piece1.position,
				));
			} else {
				console.log(`[getMoves] Piece ${piece1.position.toString()} on the opposite side in this direction - yummy`);
				// Add all moves from piece1 to piece2 if it exists or to board limit
				movesWithTake.push(...board.getMovesAlongDir(
					this.position,
					direction,
					piece1.position,
					piece2 ? piece2.position : false,
					piece1,
				));
			}
		});

		if (movesWithTake.length === 0) {
			console.log(`[getMoves] No movesWithTake. Returning ${movesWithoutTake.length} movesWithoutTake`);
			return { movesWithoutTake };
		}

		if (checkDoubleTake && movesWithTake.length >= 2) {
			console.log(`[getMoves] ${movesWithTake.length} movesWithTake - will look for retake`);
			const movesWithRetake = [];

			movesWithTake.forEach((moveWithTake) => {
				const { takenPiece } = moveWithTake;
				console.log(`[getMoves] Execute move ${moveWithTake} with ${takenPiece.position.toString()}`);
				// Execute move: move this from start to end, remove takenPiece
				board.applyMove(moveWithTake);

				// Check if we can take again with another move
				const movesWithTakeAgain = this.getMoves(board, false).movesWithTake;
				if (movesWithTakeAgain) {
					console.log(`[getMoves] Can retake after move ${moveWithTake}`);
					movesWithRetake.push(moveWithTake);
				}

				console.log(`[getMoves] Reverse move ${moveWithTake}`);
				// Reverse move: move this from end to start, add takenPiece
				board.revertMove(moveWithTake);
			});

			if (movesWithRetake.length > 0) {
				console.log(`[getMoves] Returning ${movesWithRetake.length} movesWithRetake`);
				return { movesWithTake: movesWithRetake };
			}
		}

		console.log(`[getMoves] Returning ${movesWithTake.length} movesWithTake`);
		return { movesWithTake };
	}

	toJSON = () => ({
		x: this.position.x,
		y: this.position.y,
		player: this.player.id,
		king: true,
	})
}

export class Man extends Piece {
	toString = () => 'o'

	getDirections = () => {
		if (this.player.side === SIDES.NORTH) {
			return [new Position(-1, 1), new Position(1, 1)];
		}
		return [new Position(1, -1), new Position(-1, -1)];
	}

	getPromottedPiece = (board) => {
		const side = this.player.side;
		if ((side === SIDES.SOUTH && this.position.y === 0)
		|| (side === SIDES.NORTH && this.position.y === board.size - 1)) {
			return new King(this.position, this.player);
		}
		return false;
	}

	getMoves = (board) => {
		console.log(`[getMoves] For piece ${this.toString()} on position ${this.position.toString()}`);
		const directions = this.getDirections();
		const movesWithoutTake = [];
		const movesWithTake = [];

		// Check available moves in all directions
		directions.forEach((direction) => {
			console.log(`[getMoves] Studying direction ${direction.toString()}`);

			const nextPosition = this.position.add(direction);
			if (board.exists(nextPosition)) {
				const piece = board.at(nextPosition);
				if (piece) {
					if (!this.sameSide(piece)) {
						console.log(`[getMoves] Piece ${piece.position.toString()} on the opposite side in this direction`);
						const secondNextPosition = nextPosition.add(direction);
						if (board.exists(secondNextPosition) && !board.at(secondNextPosition)) {
							movesWithTake.push(new Move(this.position, secondNextPosition, piece));
						}
					}
				} else {
					console.log('[getMoves] No piece in this direction');
					movesWithoutTake.push(new Move(this.position, nextPosition));
				}
			}
		});

		if (movesWithTake.length === 0) {
			console.log(`[getMoves] No movesWithTake. Returning ${movesWithoutTake.length} movesWithoutTake`);
			return { movesWithoutTake };
		}

		return { movesWithTake };
	}

	toJSON = () => ({
		x: this.position.x,
		y: this.position.y,
		player: this.player.id,
		man: true,
	})
}
