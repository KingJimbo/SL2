const { isANumber, getPosName, getRoom, isValidStructureBuildStatus } = require("../actions/common");
const { getObject } = require("../actions/memory");
const { STRUCTURE_BUILD_STATUS, OBJECT_TYPE } = require("../common/constants");
const { LOOK_STRUCTURES, LOOK_CONSTRUCTION_SITES } = require("../testing/constants");

module.exports = {
	isRoomStructureInitialised: (structureType, x, y, roomName) => {
		console.log(`isRoomStructureInitialised start`);
		console.log(`structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		if (!roomName || !isANumber(x) || !isANumber(y) || !structureType) {
			throw new Error(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		}
		console.log(`isRoomStructureInitialised isvalid`);

		let room = getRoom(roomName);

		console.log(`room: ${JSON.stringify(room)}`);

		if (!room) {
			throw new Error(`Couldn't find room ${roomName}`);
		}

		if (!room.memory.positionInformation) {
			console.log(`No room positionInformation found`);
			return false;
		}

		const objects = room.lookAt(x, y);
		var foundObject = null;

		if (objects) {
			objects.forEach((object) => {
				if (object.structureType && object.structureType === structureType) {
					foundObject = object;
				}
			});
		}

		return foundObject ? true : false;
	},
};
