const { isANumber, getPosName, getObject, deleteObject } = require("../actions/common");
const { STRUCTURE_BUILD_STATUS, OBJECT_TYPE } = require("../common/constants");
const { createBuildOperation } = require("./operation");

module.exports = {
	isRoomStructureInitialised: (structureType, x, y, roomName) => {
		if (!roomName || !isANumber(x) || !isANumber(y) || !structureType) {
			console.log(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
			return false;
		}

		let room = this.getRoom(roomName);

		if (!room) {
			console.log(`Couldn't find room ${roomName}`);
			return false;
		}

		if (!room.memory.positionInformation) {
			console.log(`Couldn't find room positionInformation object ${roomName}`);
			return false;
		}

		const posName = getPosName(x, y);

		let positionInformation = room.memory.positionInformation[posName];

		if (!positionInformation) {
			console.log(`Couldn't find room positionInformation ${roomName}`);
			return false;
		}

		if (!this.isValidStructureBuildStatus(positionInformation.status)) {
			console.log(`Invalid StructureBuildStatus! ${roomName} ${positionInformation.status}`);
			return false;
		}

		if (positionInformation.buildOperationId) {
			let buildOperation = getObject(OBJECT_TYPE.OPERATION, positionInformation.buildOperationId);

			// should exist if not delete and initialise
			if (buildOperation) {
				if (positionInformation.status === STRUCTURE_BUILD_STATUS.CONSTRUCTED) {
					//delete buildOperation
					deleteObject(OBJECT_TYPE.OPERATION, positionInformation.buildOperationId);
				}

				return true;
			}

			return false;
		} else {
			if (positionInformation.status === STRUCTURE_BUILD_STATUS.CONSTRUCTED) {
				return true;
			}
		}

		// if (positionInformation.status !== STRUCTURE_BUILD_STATUS.CONSTRUCTED && !hasValidBuildOperation) {
		// 	// doesn't exist! should do so initialise it
		// 	console.log(`build operation doesn't exist for room:${roomName} posName: ${posName}`);
		// 	positionInformation.buildOperationId = null;
		// 	if (!createBuildOperation(structureType, x, y, roomName)) {
		// 		console.log("failed to create build operation!");
		// 		return false;
		// 	}
		// }

		return false;
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
