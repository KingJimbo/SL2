const getMemory = require("./getMemory");
const initialiseRoomMemory = require("./intialisers/initialiseRoomMemory");

const getRoomMemory = (roomName) => {
	let memory = getMemory();

	if (!memory.rooms[roomName]) {
		memory.rooms[roomName] = initialiseRoomMemory();
	}

	return memory.rooms[roomName];
};

module.exports = getRoomMemory;
