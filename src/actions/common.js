const { COORDINATES_MAX_SIZE } = require("../common/constants");

module.exports = {
	isANumber: (number) => {
		return typeof number == "number";
	},

	getPosName: (x, y) => {
		return `${x}-${y}`;
	},

	getNextId: (type) => {
		if (!Memory.ids) {
			Memory.ids = {};
		}

		let id = Memory.ids[type];

		if (!id) {
			id = 0;
		}
		id++;
		Memory.ids[type] = id;
		return `${type}-${id}`;
	},

	getRoom: (roomName) => {
		if (roomName) {
			let room = Game.rooms[roomName];

			if (room) {
				return room;
			}
		}

		console.log(`Invalid roomName: ${roomName}`);
		return null;
	},

	isValidStructureBuildStatus: (status) => {
		switch (status) {
			case STRUCTURE_BUILD_STATUS.CONSTRUCTED:
				return true;
			case STRUCTURE_BUILD_STATUS.IN_CONSTRUCTION:
				return true;
			case STRUCTURE_BUILD_STATUS.INITIALISED:
				return true;
			default:
				return false;
		}
	},
	getAccessiblePositions: (pos) => {
		if (!pos) {
			console.log("getAccessiblePositions invalid parameter");
		}

		var room = Game.rooms[pos.roomName];
		var terrain = room.getTerrain();
		var accessiblePositions = [];

		let surroundingPositions = [
			{ x: pos.x - 1, y: pos.y - 1 },
			{ x: pos.x - 1, y: pos.y },
			{ x: pos.x - 1, y: pos.y + 1 },
			{ x: pos.x, y: pos.y - 1 },
			{ x: pos.x, y: pos.y + 1 },
			{ x: pos.x + 1, y: pos.y - 1 },
			{ x: pos.x + 1, y: pos.y },
			{ x: pos.x + 1, y: pos.y + 1 },
		];

		surroundingPositions.forEach((pos) => {
			const terrainGet = terrain.get(pos.x, pos.y);
			const isAccessible = pos.x >= 0 && pos.x <= COORDINATES_MAX_SIZE && pos.y >= 0 && pos.y <= COORDINATES_MAX_SIZE && terrainGet === 0;

			if (isAccessible) {
				accessiblePositions.push(pos);
			}
		});

		return accessiblePositions;
	},
};
