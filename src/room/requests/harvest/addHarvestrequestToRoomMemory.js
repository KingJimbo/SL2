const getRoomMemory = require("../../../memory/getRoomMemory");

const addHarvestToRoomMemory = (room, request) => {
	var roomMemory = getRoomMemory(room.name);

	roomMemory.requests.harvest[request.id] = request;
};

module.exports = addHarvestToRoomMemory;
