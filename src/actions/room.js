const { isANumber, getRoom } = require("../actions/common");
const { getIdleCreep, addCreepToRoomSpawnQueue } = require("./roomCreepRequisition");

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
	requestCreep: (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log("requestCreep: invalid parameters!");
			return false;
		}

		let creep = getIdleCreep(room, type, memory);

		if (creep) {
			return creep;
		}

		return addCreepToRoomSpawnQueue(room, type, memory);
	},
};
