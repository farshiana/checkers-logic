export default class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add = pos => new Position(this.x + pos.x, this.y + pos.y)

	mul = l => new Position(l * this.x, l * this.y)

	toString = () => `(${this.x}, ${this.y})`

	equals = pos => this.x === pos.x && this.y === pos.y
}
