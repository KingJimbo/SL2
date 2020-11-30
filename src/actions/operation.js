const { OPERATION_TYPE, OBJECT_TYPE, STRUCTURE_BUILD_STATUS } = require("../common/constants");
const { getPosName, isANumber } = require("../actions/common");
const { saveObject, getObjects } = require("../actions/memory");

module.exports = {
	createBuildOperation: (structureType, x, y, roomName) => {
		if (!roomName || !isANumber(x) || !isANumber(y) || !structureType) {
			console.log(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
			return null;
		}

		let room = Game.rooms[roomName];

		if (!room) {
			console.log(`Couldn't find room: ${roomName}`);
			return null;
		}

		let buildOperation = saveObject({
			objectType: OBJECT_TYPE.OPERATION,
			operationType: OPERATION_TYPE.BUILD,
			structureType,
			x,
			y,
			roomName,
		});

		if (!buildOperation) {
			console.log(`Failed to create build operation`);
			return null;
		}

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
	},

	checkOperationCreeps: () => {},

	runBuildOperation: (operation) => {
		if (!operation || !operation.id || !operation.room || !operation.structureType || !isANumber(operation.x) || !isANumber(operation.y)) {
			throw new Error(`invalid parameters operation: ${JSON.stringify(operation)}`);
		}

		let room = Game.rooms[operation.room];

		// determine if structure is under construction
		// if not start construction
		// once construction started requisision energy
		//
	},
};
