(() => {
	let App = {
		runApp: () => {
			const { memoryModule, roomModule, creepModule, spawnModule } = global.App;

			if (process.env.NODE_ENV === "development") {
				global.logger.log("runApp Start");
			}

			memoryModule.initialiseMemory();

			roomModule.runRooms();

			creepModule.runCreeps();

			spawnModule.runSpawns();
		},
	};

	global.App = App;
})();

module.exports = global.App;
