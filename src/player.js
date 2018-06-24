export default class Player {
	constructor(id, side) {
		this.id = id;
		this.side = side;
		this.pieces = [];
	}

	sameSide = player => this.id === player.id
}
