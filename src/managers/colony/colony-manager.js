// colony-manager.js

module.exports = function(game, resourceManager, memoryManager, operationManager, structureMapper, creepManager) {
	this.game = game;
	this.resourceManager = resourceManager;
	this.memoryManager = memoryManager;
	this.operationManager = operationManager;
	this.structureMapper = structureMapper;
	this.creepManager = creepManager;

	// Use this method to create a colony object json object from a room
	this.createColony = function(room) {
		console.log("create colony");
		console.log(JSON.stringify(room));
		let colony = {
			id: 0,
			objectType: OBJECT_TYPE_COLONY,
			structureMap: this.createNewStructureMap(),
			mainRoom: room.name,
			rooms: [],
			resourceRequests: {},
			spawnQueues: {
				PRIORITY_HIGH: [],
				PRIORITY_MEDIUM: [],
				PRIORITY_LOW: []
			}
		};

		// save colony to get colony id
		colony = this.memoryManager.save(colony);
		this.addRoomToColony(colony, room);

		return colony;
	};

	this.addRoomToColony = function(colony, room) {
		// add if it doesn't exist
		//this.memoryManager(OBJECT_TYPE_ROOMS, this.room.name)
		if (!room.memory.colonyId) {
			room.memory.colonyId = colony.id;
			colony.rooms.push(room);
			this.memoryManager.save(colony);
		} else {
			console.log("Warning: this room is already assigned to a colony " + room.memory.colonyId + " cannot assign to " + colony.id);
			//TODO: Add logic to handle room transfer
			// check colony still exists
			// check room is actually part of colony
		}
	};

	this.addSourceToColony = function(colony, source) {
		if (colony && source) {
			if (!colony.sources) {
				colony.sources = {};
			}

			if (!colony.sources[source.id]) {
				colony.sources[source.id] = { id: source.id };
			}

			this.memoryManager.save(colony);

			return this.createSourceMemory(source);
		}
	};

	// this function performs all colony activities
	this.run = function(colony) {
		// start run colony
		// Resource check
		this.checkColonyResourceRequirements(colony);

		//process resources
		this.processColonyResources(colony);

		// check spawn queues and spawn creeps
		this.processSpawning(colony);
		// resource requests
		this.processResourceRequests(colony);
		// priorities
		// resource out
	};

	this.processColonyResources = function(colony) {
		// verify last resource check
		if (!colony.lastResourceCheck || colony.lastResourceCheck.level < this.game.rooms[colony.mainRoom].controller.level) {
			// find rooms for colony
			this.addColonySources(colony);

			// TODO
			// not a problem until later levels
			this.checkColonyMinerals(colony);

			// assign operations to resources
			this.addSourceOperations(colony);

			//TODO
			//this.addMineralOperations(colony);

			colony.lastResourceCheck = this.game.time;
		}

		//TODO
		// process sources for operations
		this.processSourceOperations(colony);

		// save colony
		this.memoryManager.save();
	};

	// Function will assign sources to colony
	this.addColonySources = function(colony) {
		const rooms = this.getColonyRooms(colony);

		for (let i = 0; i < rooms.length; i++) {
			// find all resources in room
			const room = rooms[i];
			const sources = room.find(FIND_SOURCES);

			for (let i = 0; i < sources.length; i++) {
				const source = sources[i];
				// add sources to colony
				this.addSourceToColony(colony, source);
			}
		}
	};

	// Function will assign minerals to colony
	this.checkColonyMinerals = function(colony) {
		//TODO: add minderal logic
		//const minerals = room.find(FIND_MINERALS);
	};

	this.addSourceOperations = function(colony) {
		// cycle through all the sources and determine if they have an operation. If not create one.
		for (const sourceId in colony.sources) {
			let sourceMemory = this.memoryManager.getById(OBJECT_TYPE_SOURCE_MEMORY, sourceId);

			// check source memory exists
			if (!sourceMemory) {
				const source = this.game.getObjectById(sourceId);
				if (source) {
					sourceMemory = this.createSourceMemory(source);
				}
			}

			// if no operation assigned
			if (sourceMemory && !sourceMemory.operationId) {
				//create operation
				const source = this.game.getObjectById(sourceId);
				let sourceOperation = this.operationManager.createSourceOperation(source);

				// save source memory with operation id
				sourceMemory.operationId = sourceOperation.id;
				memoryManager.save(sourceMemory);
			}
		}
	};

	this.createSourceMemory = function(source) {
		if (source.room.memory.colonyId) {
			return this.memoryManager.save({
				id: source.id,
				objectType: OBJECT_TYPE_SOURCE_MEMORY,
				operationId: 0,
				colonyId: source.room.memory.colonyId
			});
		}

		return null;
	};

	this.getColonyRooms = function(colony) {
		if (!colony.rooms) {
			let rooms = [];
			for (let i = 0; i < colony.rooms.length; i++) {
				const roomName = colony.rooms[i];
				rooms.push(this.game.rooms[roomName]);
			}
			return rooms;
		}
	};

	this.checkColonyResourceRequirements = function(colony) {
		// add check if cpu is limited
		//if (!colony.lastResourceCheck || colony.lastResourceCheck) {
		//}
		// check buildings in colony
		if (!colony.structureMap) {
			this.generateColonyStructureMap(colony);
		}

		this.resourceManager.checkColonyResourceRequirements(colony);
	};

	this.processSpawning = function(colony) {
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
			for (let j = 0; j < spawns.length; j++) {
				let spawn = spawns[j];

				for (const i in colony.spawnQueues) {
					let spawnQueue = colony.spawnQueues[i];
					// check if any creeps are to be spawned.
					if (spawnQueue.length > 0) {
						spawn.memory.creepToSpawn = spawnQueue.shift();
					}
				}
			}
		}
	};

	this.processSourceOperations = function(colony) {
		// cycle sources
		for (const id in colony.sources) {
			let sourceMemory = this.memoryManager.getById(OBJECT_TYPE_SOURCE_MEMORY, id);
			if (sourceMemory.operationId) {
				let sourceOperation = this.memoryManager.getById(OBJECT_TYPE_SOURCE_OPERATION, sourceMemory.operationId);
				this.operationManager.processSourceOperation(sourceOperation);
			}
		}
	};

	/* STRUCTURE MAP FUNCTIONS */

	this.generateColonyStructureMap = function(colony) {
		colony.structureMap = this.createNewStructureMap();
		// find all buildings and assign to memory
		if (!colony.rooms) {
			// no rooms have been added to the colony yet so find original
			const room = this.game.rooms[colony.id];
			// add room to colony rooms
			colony.rooms.push(room.name);
			this.addRoomStructuresToColonyStructureMap(room, colony);
		} else {
			// check all rooms
			for (let i = 0; i < colony.rooms.length; i++) {
				const room = colony.rooms[i];
				this.addRoomStructuresToColonyStructureMap(room, colony);
			}
		}
	};

	this.addRoomStructuresToColonyStructureMap = function(room, colony) {
		const structures = room.find(FIND_MY_STRUCTURES);
		//add each structure to structure map
		for (const i in structures) {
			const structure = structures[i];
			colony.structureMap[structure.structureType][structure.id] = this.generateStructureMapItemFromStructure(structure);
		}
	};

	this.createNewStructureMap = function() {
		return {
			spawn: {},
			extension: {},
			road: {},
			constructedWall: {},
			rampart: {},
			keeperLair: {},
			portal: {},
			controller: {},
			link: {},
			storage: {},
			tower: {},
			observer: {},
			powerBank: {},
			powerSpawn: {},
			extractor: {},
			lab: {},
			terminal: {},
			container: {},
			nuker: {}
		};
	};

	// method will create a structure map item object from structure.
	this.generateStructureMapItemFromStructure = function(structure) {
		return {
			id: structure.id,
			pos: structure.pos
		};
	};

	// function that will check all resource requests and assign any available creeps
	this.processResourceRequests = function(colony) {
		// find any available creeps
		// prioritise transport creeps then utility creeps
		let creepType = null;
		//TODO
		if (this.areAnyCreepsFree(colony, CREEP_TYPE_TRANSPORTER) === true) {
			creepType = CREEP_TYPE_TRANSPORTER;
		} else if (this.areAnyCreepsFree(colony, CREEP_TYPE_UTILITY) === true) {
			creepType = CREEP_TYPE_UTILITY;
		}

		if (creepType) {
		}

		// find all resource requests
		// assign available creeps to resource requests
	};
	// function to check if there are any available creeps in the free queue
	this.areAnyCreepsFree = function(colony, creepType) {
		// initialise creepQueues
		if (!colony.creepQueues) {
			colony.creepQueues = {};
		}

		if (!colony.creepQueues[creepType]) {
			colony.creepQueues[creepType] = {
				COLONY_CREEP_QUEUE_FREE: [],
				COLONY_CREEP_QUEUE_BUSY: []
			};
		}

		return colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].length > 0;
	};
};
