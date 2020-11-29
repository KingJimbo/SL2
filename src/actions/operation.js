const { OPERATION_TYPE, OBJECT_TYPE } = require("../common/constants");
const { saveObject, getPosName, isANumber } = require("../actions/common");

module.exports = {
	createBuildOperation: function (structureType, x, y, roomName) {
		if (roomName && isANumber(x) && isANumber(y) && structureType) {
			let room = Game.rooms[roomName];

			if (room) {
				let buildOperation = saveObject({
					objectType: OBJECT_TYPE.OPERATION,
					operationType: OPERATION_TYPE.BUILD,
					details: structureType,
					x,
					y,
					roomName,
				});

				if (buildOperation) {
					if (!room.memory.structures) {
						room.memory.structures = {};
					}

					room.memory.structures;
					return buildOperation;
				} else {
					console.log(`Failed to create build operation`);
				}
			} else {
				console.log(`Couldn't find room: ${roomName}`);
			}
		} else {
			console.log(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		}

		return null;
	},
};
