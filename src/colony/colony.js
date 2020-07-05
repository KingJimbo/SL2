// colony-manager.js

module.exports = function ({ game, memoryManager, operationManager, resourceManager, spawnManager, commandManager, roomManager }) {
	this.game = game;
	this.memory = memoryManager;
	this.operationManager = operationManager;
	this.resourceManager = resourceManager;
	this.spawnManager = spawnManager;
	this.commandManager = commandManager;
	this.roomManager = roomManager;
	// this.structureMapper = structureMapper;
	// this.creepManager = creepManager;

	/**
	 * Function: Process Colonies
	 * Description: Gets all colonies in memory and runs them
	 */
	this.processColonies = function () {
		let colonies = this.memory.getAll(OBJECT_TYPE_COLONY);

		// if no colonies map existing owned rooms
		if (!colonies) {
			colonies = this.mapColonies();
		}

		for (const i in colonies) {
			let colony = colonies[i];
			var result = this.runColony(colony);
		}
	};

	/**
	 * Function: Map Colonies
	 * Description: Function that cycles all rooms in game and generates a colony in memory.
	 */
	this.mapColonies = function () {
		for (const i in this.game.rooms) {
			const room = this.game.rooms[i];

			this.roomManager.mapRoomToColony(room);
		}

		return this.memory.getAll(OBJECT_TYPE_COLONY);
	};

	this.runColony = function (colony) {
		// start run colony
		// Resource check
		this.roomManager.checkColonyResourceRequirements(colony);

		// check spawn queues and spawn creeps
		this.processSpawning(colony);

		this.processResourceRequestsType(colony);
	};

	this.getColonyRooms = function (colony) {
		if (!colony.rooms) {
			let rooms = [];
			for (let i = 0; i < colony.rooms.length; i++) {
				const roomName = colony.rooms[i];
				rooms.push(this.game.rooms[roomName]);
			}
			return rooms;
		}
	};

	this.processSpawning = function (colony) {
		// get all available spawns
		let spawns = [];
		for (const i in colony.structureMap[STRUCTURE_SPAWN]) {
			let spawn = this.game.getObjectById(colony.structureMap[STRUCTURE_SPAWN][i].id);

			// Check spawn is not currently spawning and is not already assigned a creep to spawn
			if (spawn.spawning === null && !spawn.memory.creepToSpawn) {
				spawns.push(spawn);
			}
		}

		if (spawns.length > 0) {
			// check colony spawn queues
			let areCreepsToSpawn = true;
			for (let j = 0; j < spawns.length && areCreepsToSpawn; j++) {
				let spawn = spawns[j];
				let creepToSpawn = this.getNextCreepFromSpawnQueue(colony);
				// assign to spawn
				if (creepToSpawn) {
					spawn.memory.creepToSpawn = creepToSpawn;
					this.spawnManager.spawnCreep(spawn);
				} else {
					// ran out of creeps to spawn so bail
					areCreepsToSpawn = false;
				}
			}
		} else {
			logger.warning('no spawns to process');
		}
	};

	this.getNextCreepFromSpawnQueue = function (colony) {
		if (colony) {
			// get spawn queues
			// high
			let highQueue = colony.spawnQueue[PRIORITY_HIGH];
			if (highQueue) {
				return highQueue.shift();
			}

			// medium
			let medQueue = colony.spawnQueue[PRIORITY_MEDIUM];
			if (medQueue) {
				return medQueue.shift();
			}

			// low
			let lowQueue = colony.spawnQueue[PRIORITY_LOW];
			if (lowQueue) {
				return lowQueue.shift();
			}
		} else {
			logger.warning('Invalid parameter Colony:');
			logger.log(JSON.stringify(colony));
		}
	};

	this.processSourceOperations = function (colony) {
		// cycle sources
		for (const id in colony.sources) {
			let sourceMemory = this.memory.getById(OBJECT_TYPE_SOURCE_MEMORY, id);
			if (sourceMemory.operationId) {
				let sourceOperation = this.memory.getById(OBJECT_TYPE_SOURCE_OPERATION, sourceMemory.operationId);
				this.operationManager.processSourceOperation(sourceOperation);
			}
		}
	};

	// function that will check all resource requests and assign any available creeps
	this.processResourceRequestsType = function (colony) {
		for (var type in colony.resourceRequests) {
			var resourceRequestType = colony.resourceRequests[type];

			var highPriorityRequests = resourceRequestType[PRIORITY_HIGH];
			this.processResourceRequests(highPriorityRequests);
			var mediumPriorityRequests = resourceRequestType[PRIORITY_MEDIUM];
			this.processResourceRequests(mediumPriorityRequests);
			var lowPriorityRequests = resourceRequestType[PRIORITY_LOW];
			this.processResourceRequests(lowPriorityRequests);
		}
	};

	this.processResourceRequests = function (resourceRequests) {
		if (resourceRequests) {
			for (const i in resourceRequests) {
				var resourceRequest = resourceRequests[i];

				// prefer a transporter over utility
				var creep = this.getNextAvailableCreep(colony, CREEP_TYPE_TRANSPORTER);

				if (!creep) {
					creep = this.getNextAvailableCreep(colony, CREEP_TYPE_UTILITY);
				}

				if (creep) {
					this.assignResourceRequestToCreep(resourceRequest, creep);
				} else {
					// TODO no creeps so create a spawning request
				}

				throw new Error('TODO');
			}
		} else {
			logger.warning('Invalid parameter resourceRequests');
			logger.log(JSON.stringify(resourceRequests));
		}
	};

	this.getNextAvailableCreep = function (colony, creepType) {
		if (colony) {
			let creepFound = false,
				noCreeps = false;
			while (!creepFound) {
				var creepName = this.getNextFreeCreepFrom(colony, creepType);

				// creepName found in queue
				if (creepName) {
					var creep = this.game.creeps[creepName];
					if (creep) {
						return creep;
					} else {
						logger.warning('Missing Creep detected name: ' + creepName);
						// TODO need a missing creep handler
					}
				} else {
					// no creep name found so queue empty
					return;
				}
			}
		} else {
			logger.warning('Invalid parameter colony');
			logger.log(JSON.stringify(colony));
		}
	};

	this.assignResourceRequestToCreep = function (resourceRequest, creep) {
		throw new Error('TODO');
	};

	// function to check if there are any available creeps in the free queue
	this.areAnyCreepsFree = function (colony, creepType) {
		// initialise creepQueues
		if (!colony.creepQueues) {
			colony.creepQueues = {};
		}

		if (!colony.creepQueues[creepType]) {
			colony.creepQueues[creepType] = {
				COLONY_CREEP_QUEUE_FREE: [],
				COLONY_CREEP_QUEUE_BUSY: [],
			};
		}

		return colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].length > 0;
	};

	this.getNextFreeCreepFrom = function (colony, creepType) {
		// initialise creepQueues
		if (!colony.creepQueues) {
			colony.creepQueues = {};
		}

		if (!colony.creepQueues[creepType]) {
			colony.creepQueues[creepType] = {
				COLONY_CREEP_QUEUE_FREE: [],
				COLONY_CREEP_QUEUE_BUSY: [],
			};
		}

		if (colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE]) {
			var creep = colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].shift();
			colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].push(creep);
			this.memory.save(colony);
			return creep;
		}

		return;
	};
};
