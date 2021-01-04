(() => {
	let App = {
		runApp: () => {
			const { memoryModule, roomModule, creepModule } = global.App;

			if (process.env.NODE_ENV === "development") {
				console.log("runApp Start");
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
