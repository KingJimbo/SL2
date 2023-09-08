const position = {
	getPosName: (x, y) => {
		return `${x}-${y}`;
	},

	isPosNearEdge: (x, y) => {
		return x === 0 || x === COORDINATES_MAX_SIZE || y === 0 || y === COORDINATES_MAX_SIZE;
	},
};

module.exports = position;
