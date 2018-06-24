export default class Move {
	constructor(startPosition, endPosition, takenPiece = false) {
		this.startPosition = startPosition;
		this.endPosition = endPosition;
		this.takenPiece = takenPiece;
		this.pieceBeforePromotion = false;
	}

	toString = () => (
		`${this.startPosition.toString()} -> ${this.endPosition.toString()}`
	)

	toJSON = () => ({
		start: { x: this.startPosition.x, y: this.startPosition.y },
		end: { x: this.endPosition.x, y: this.endPosition.y },
		piece: this.takenPiece ? this.takenPiece.toJSON() : false,
		pieceBeforePromotion: this.pieceBeforePromotion ? this.pieceBeforePromotion.toJSON()
			: false,
	})
}
