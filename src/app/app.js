// app.js

module.exports = function(memory, game) {
	if (!memory || !game) {
		throw "invalid arguements passed to app.js!";
	}
	this.game = game;
	console.log("import managers");
	const MemoryManager = require("../managers/memory/memory-manager.js");
	this.memoryManager = new MemoryManager(memory);

	const ResourceManager = require("../managers/resource/resource-manager.js");
	this.resourceManager = new ResourceManager(this.memoryManager, this.game);

	const ColonyManager = require("../managers/colony/colony-manager.js");
	this.colonyManager = new ColonyManager(this.game, this.resourceManager, this.memoryManager);

	console.log("import managers end");
	// run function will activate every loop
	this.run = function() {
		console.log("run start");

		let colonies = this.memoryManager.getAll(OBJECT_TYPE_COLONY);
		if (!colonies) {
			colonies = this.mapColonies();
		}

		for (const i in colonies) {
			let colony = colonies[i];
			colonyManager.run(colony);
		}
	};

	this.mapColonies = function() {
		console.log("map colonies");
		for (const i in this.game.rooms) {
			const room = this.game.rooms[i];
			if (typeof room.controller !== "undefined" && room.controller !== null && room.controller.my) {
				this.memoryManager.save(this.colonyManager.createColony(room));
			}
		}

		return this.memoryManager.getAll(OBJECT_TYPE_COLONY);
	};
};
