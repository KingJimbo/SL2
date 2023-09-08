const determineRoomPossibleCreepCarryAmount = require("./determineRoomPossibleCreepCarryAmount");
const surveyRoomResources = require("./survey/surveyRoomResources");

const runMyRoom = (room) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`Start runMyRoom ${room.name}`);
	}

	// find room possibleUtilityCarryAmount
	determineRoomPossibleCreepCarryAmount(room);

	surveyRoomResources(room);

	//surveyRoomForStructures(room);

	// delete requests and start fresh every time
	//delete room.memory.resourceRequests;

	//cleanUpRequestMemory(room);

	//checkResourceObjects(room);

	//roomModule.createRoomCreepRoles(room);

	//roomModule.checkCreeps(room);

	//roomModule.checkRoomSites(room);

	//roomModule.checkRoomStructures(room);

	// if (!room.memory.exits) {
	// 	roomModule.getRoomExits(room);
	// }

	//roomModule.addScoutRequests(room);

	// remove scout requests when in sim
	// if (process.env.NODE_ENV === "development") {
	// 	if (room.name === "sim") {
	// 		room.memory.requests.scout = {};
	// 	}
	// }
};

module.exports = runMyRoom;
