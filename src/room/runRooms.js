const runRoom = require("./runRoom");

const runRooms = (game) => {
	// if (process.env.NODE_ENV === "development") {
	// 	console.log(`Start runRooms`);
	// }

	for (const i in game.rooms) {
		let room = game.rooms[i];

		runRoom(room);
	}
};

module.exports = runRooms;
