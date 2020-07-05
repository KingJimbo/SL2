// colony-dependancies.js

module.exports = function ({ game, memory }) {
	const MemoryManager = require('../common/memory.js');
	let memoryManager = new MemoryManager({ memory });

	const CommandManager = require('../colony/services/command.js');
	let commandManager = new CommandManager({ memoryManager });

	const ResourceManager = require('../colony/services/resource.js');
	let resourceManager = new ResourceManager({ memoryManager, game });

	const OperationManager = require('../colony/services/operation.js');
	let operationManager = new OperationManager({ memoryManager, game });

	const RoomManager = require('../colony/services/room.js');
	let roomManager = new RoomManager({ memoryManager, game, resourceManager, operationManager });

	const SpawnManager = require('../colony/services/resource.js');
	let spawnManager = new SpawnManager({ game, memoryManager, resourceManager });

	const ColonyManager = require('../colony/colony.js');
	let colonyManager = new ColonyManager({
		game,
		resourceManager,
		memoryManager,
		operationManager,
		spawnManager,
		commandManager,
		roomManager,
	});

	return {
		game,
		resourceManager,
		memoryManager,
		operationManager,
		spawnManager,
		commandManager,
		roomManager,
		colonyManager,
	};
};
