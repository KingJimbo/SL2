const initialiseScreepsResources = require("./common/initialiseScreepsResources");
const initialiseMemory = require("./memory/initialiseMemory");
const runRooms = require("./room/runRooms");
const runOperations = require("./operation/runOperations");

class App {
	runApp(memory, game, config) {
		// if (process.env.NODE_ENV === "development") {
		// 	console.log(`Start runApp`);
		// }
		initialiseScreepsResources(memory, game);
		initialiseMemory(memory, game, config);

		runRooms(game);
		runOperations();
		// const { memoryModule, roomModule, creepModule, spawnModule } = global.App;
		// memoryModule.initialiseMemory();
		// roomModule.runRooms();
		// creepModule.runCreeps();
		// spawnModule.runSpawns();
	}
}

module.exports = App;
