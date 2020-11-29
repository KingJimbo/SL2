const { OPERATION_TYPE, OBJECT_TYPE, STRUCTURE_BUILD_STATUS } = require("../common/constants");
const { saveObject, getPosName, isANumber } = require("../actions/common");

module.exports = {
	createBuildOperation: (structureType, x, y, roomName) => {
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
					if (!room.memory.positionInformation) {
						room.memory.positionInformation = {};
					}

					let posName = getPosName(x, y);

					room.memory.positionInformation[posName] = {
						x,
						y,
						structureType,
						status: STRUCTURE_BUILD_STATUS.INITIALISED,
						buildOperationId: buildOperation.id,
					};

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
