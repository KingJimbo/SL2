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
};
