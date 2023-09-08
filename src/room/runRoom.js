const runMyRoom = require("./runMyRoom");

const runRoom = (room) => {
	// if (process.env.NODE_ENV === "development") {
	// 	console.log(`Start runRoom ${room.name}`);
	// }

	// do tasks common to both neutral and claimed rooms
	// survey threats

	if (room.controller.my) {
		runMyRoom(room);
		return;
	}

	// determine if claimed
	// runEnemyRoom
};

module.exports = runRoom;
