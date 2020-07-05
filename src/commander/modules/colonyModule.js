// colony-manager.js

module.exports = function () {
	this.runColonies = () => {
		let colonies = _Modules.memory.getAll(OBJECT_TYPE_COLONY);

		if (!colonies) {
			_Modules.command.pushDataToQueue(COMMANDS.INITIALISE_COLONIES);

			return false;
		} else {
			for (const i in colonies) {
				let colony = colonies[i];

				if (!colony) {
					// need to add a command to investigate or clean it from memory
				}

				_Modules.command.pushDataToQueue(COMMANDS.RUN_COLONY, { colony });
			}

			return true;
		}
	};

	/**
	 * Function: Map Colonies
	 * Description: Function that cycles all rooms in game and generates a colony in memory.
	 */
	this.initialiseColonies = () => {
		for (const i in _Modules.game.rooms) {
			let room = _Modules.game.rooms[i];
			_Modules.command.pushDataToQueue(COMMANDS.INITIALISE_COLONY, { room });

			//this.roomManager.mapRoomToColony(room);
		}

		//return this.memory.getAll(OBJECT_TYPE_COLONY);
	};

	this.initialiseColony = ({ room }) => {
		if (_Modules.room.isRoomColony(room)) {
			var colony = _Modules.room.createColony(room);
			if (colony) {
				colony.roomName = room.name;
				room.memory.colonyId = colony.id;
				colony = _Modules.memory.save(colony);

				logger.debug(`ColonyModule.initialiseColony: colonyId ${colony.id}`);
				_Modules.command.pushDataToQueue(COMMANDS.INITIALISE_COLONY_OPERATIONS, { colonyId: colony.id });

				return colony;
			} else {
				logger.warning('Failed to create colony for room ' + room.name);
			}
		} else {
			logger.warning('Room ' + room.name + ' is not a colony.');
		}
	};

	this.initialiseColonyOperations = ({ colonyId }) => {
		if (!colonyId) {
			logger.warning('Invalid Colony Id!');
			return;
		}

		//get colony
		var colony = _Modules.memory.getById(OBJECT_TYPE_COLONY, colonyId);

		if (!colony) {
			logger.warning(`No colony found with id: ${colonyId}!`);
			return;
		}

		// TODO add all different types of operations here
		_Modules.command.pushDataToQueue(COMMANDS.INITIALISE_COLONY_SOURCE_OPERATIONS, { colonyId: colony.id });
	};

	this.initialiseColonySourceOperations = ({ colonyId }) => {
		let colony = _Modules.memory.getById(OBJECT_TYPE_COLONY, colonyId);

		if (!colony) return;

		const room = _Modules.game.rooms[colony.roomName];

		const sources = room.find(FIND_SOURCES);

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			// add sources to colony
			_Modules.command.pushDataToQueue(COMMANDS.INITIALISE_SOURCE_OPERATION, { colonyId: colony.id, sourceId: source.id });
		}
	};

	this.runColony = function ({ colony }) {
		// // start run colony
		// // Resource check
		// this.roomManager.checkColonyResourceRequirements(colony);
		// // check spawn queues and spawn creeps
		// this.processSpawning(colony);
		// this.processResourceRequestsType(colony);
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
