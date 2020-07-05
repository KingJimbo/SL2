// modules.js

module.exports = function (game, _memory) {
	const MemoryModule = require('../../common/memory.js');
	let memory = new MemoryModule(_memory);

	const CommandModule = require('./commandModule.js');
	let command = new CommandModule({ memory });

	const ColonyModule = require('./colonyModule.js');
	let colony = new ColonyModule();

	const RoomModule = require('./roomModule.js');
	let room = new RoomModule();

	const MoveModule = require('./moveModule.js');
	let move = new MoveModule();

	const SpawnModule = require('./spawnModule.js');
	let spawn = new SpawnModule();

	// const CommandManager = require('../colony/services/command.js');
	// let commandManager = new CommandManager({ memoryManager });

	// const ResourceManager = require('../colony/services/resource.js');
	// let resourceManager = new ResourceManager({ memoryManager, game });

	const OperationManager = require('./operationModule.js');
	let operation = new OperationManager();

	// const RoomManager = require('../colony/services/room.js');
	// let roomManager = new RoomManager({ memoryManager, game, resourceManager, operationManager });

	// const SpawnManager = require('../colony/services/resource.js');
	// let spawnManager = new SpawnManager({ game, memoryManager, resourceManager });

	// const ColonyManager = require('../colony/colony.js');
	// let colonyManager = new ColonyManager({
	// 	game,
	// 	resourceManager,
	// 	memoryManager,
	// 	operationManager,
	// 	spawnManager,
	// 	commandManager,
	// 	roomManager,
	// });

	return {
		colony,
		command,
		game,
		memory,
		move,
		operation,
		room,
		spawn,
	};
};
