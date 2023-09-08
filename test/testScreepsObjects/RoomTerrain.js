class RoomTerrain {
	constructor(_terrain) {
		this.terrain = _terrain;
	}

	get = (x, y) => {
		const xs = this.terrain[`${x}`];

		if (xs) {
			return xs[`${y}`];
		}

		return null;
	};
}

module.exports = RoomTerrain;
