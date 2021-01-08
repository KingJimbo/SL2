(() => {
	let App = {
		runApp: () => {
			const { memoryModule, roomModule, creepModule, spawnModule } = global.App;

			memoryModule.initialiseMemory();

			roomModule.runRooms();

			creepModule.runCreeps();

			spawnModule.runSpawns();
		},
	};

	global.App = App;
})();

module.exports = global.App;
