// colony-manager.js

module.exports = function(args){//game, memoryManager, operationManager, resourceManager, structureMapper, creepManager) {
	this.game = args.game;	
	this.memory = args.memoryManager;
	this.operationManager = args.operationManager;
	this.resourceManager = args.resourceManager;
	this.spawnManager = args.spawnManager;
	// this.structureMapper = args.structureMapper;
	// this.creepManager = args.creepManager;

	this.processColonies = function(){
		let colonies = this.memory.getAll(OBJECT_TYPE_COLONY);

		// if no colonies map existing owned rooms
        if (!colonies) {
            colonies = this.mapColonies();
        }

        for (const i in colonies) {
			let colony = colonies[i];
			var result = this.runColony(colony);
        }
	}

	this.mapColonies = function() {
        for (const i in this.game.rooms) {
			const room = this.game.rooms[i];
			
            if (this.isRoomColony(room)) {
				var colony = this.createColony(room)
				if(colony){
					colony.roomName = room.name;
					room.memory.colonyId = colony.id;
					this.memory.save(colony);
					this.assignColonyResources(colony);
				}
				else{
					logger.logWarning("Failed to create colony for room " + room.name)
				}
			}
			else{
				logger.logWarning("Room " + room.name + " is not a colony.");
			}
        }

        return this.memory.getAll(OBJECT_TYPE_COLONY);
	};

	this.assignColonyResources = function(colony) {
		// verify last resource check
		if (!colony.lastResourceCheck || 
			colony.lastResourceCheck.level < this.game.rooms[colony.mainRoom].controller.level) {
			// find rooms for colony
			this.assignColonySources(colony);

			// TODO
			// not a problem until later levels
			this.assignColonyMinerals(colony);

			colony.lastResourceCheck = this.game.time;
		}

	}

	// Function will assign sources to colony
	this.assignColonySources = function(colony) {
		const room = this.game.rooms[colony.roomName];

		const sources = room.find(FIND_SOURCES);

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			// add sources to colony
			if(!this.addSourceToColony(colony, source)){
				logger.logWarning("colonyManager.assignColonySources(colony) - Failed to add source to colony.")
			}
		}
	};

	this.assignColonyMinerals = function(colony){
		if(colony){
			const room = this.game.rooms[colony.roomName];

			const minerals = room.find(FIND_MINERALS);
	
			for (let i = 0; i < minerals.length; i++) {
				const mineral = minerals[i];
				// add sources to colony
				if(!this.addMineralToColony(colony, mineral)){
					logger.logWarning("colonyManager.assignColonyMinerals(colony) - Failed to assign mineral " + mineral.id + 
					" of type " + mineral.mineralType + " to colony " + colony.id);
				}
			}
		}
		else{
			logger.logWarning("colonyManager.assignColonyMinerals(colony) - Invalid parameters passsed.");
			logger.log("colony - " + JSON.stringify(colony));
		}

	}

	//TODO
	this.addMineralToColony = function(colony, mineral) {
		// if (colony && mineral) {
			

		// 	var mineralMemory = this.createMineralMemory(source);

		// 	if(mineralMemory){
		// 		if (!colony.minerals) {
		// 			colony.minerals = {};
		// 		}
	
		// 		if(!colony.minerals[mineral.mineralType]){
		// 			colony.minerals[mineral.mineralType] = [];
		// 		}

		// 		colony.minerals[mineral.mineralType].push(mineral.id);

		// 		this.memory.save(colony);

		// 		var mineralOperation = this.assignSourceOperation(sourceMemory);
		// 		if(sourceOperation){
		// 			if(!helper.objExists(colony.operations.resourceOperations[RESOURCE_ENERGY])){
		// 				colony.operations.resourceOperations[RESOURCE_ENERGY] = [];
		// 			}
		// 			colony.operations.resourceOperations[RESOURCE_ENERGY].push(sourceOperation.id);
		// 			return memory.save(colony);
		// 		}
		// 		else{
		// 			logger.logWarning("colonyManager.addMineralToColony(colony, mineral) - Failed to assign Source Operation to source " + source.id);
		// 		}
		// 	}
		// 	else{
		// 		logger.logWarning("colonyManager.addMineralToColony(colony, mineral) - Failed to create source memory for source " + source.id);
		// 	}
		// }
		// else{
		// 	logger.logWarning("colonyManager.addMineralToColony(colony, mineral) - Invalid parameters given.");
		// 	logger.log("colony - " + JSON.stringify(colony));
		// 	logger.log("mineral - " + JSON.stringify(mineral));
		// }

		return false;
	};



	// Use this method to create a colony object json object from a room
	this.createColony = function(room) {
		let colony = {
			id: 0,
			objectType: OBJECT_TYPE_COLONY,
			operations: { resourceOperations: {} },
			structureMap: this.createNewStructureMap(),
			roomName: room.name,
			remoteRoomNames: [],
			resourceRequests: {},
			spawnQueues: {
				PRIORITY_HIGH: [],
				PRIORITY_MEDIUM: [],
				PRIORITY_LOW: []
			}
		};

		// save colony to get colony id
		return this.memory.save(colony);
	};

	this.isRoomColony = function(room){

		if ((helper.objExists(room.controller) &&
		room.controller.my)){
			return true;
		}
		else{
			const spawns = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_SPAWN }
			});

			for(var i in spawns){
				var spawn = spawns[i];
				if(spawn.my){
					return true;
				}
			}
		}
		return false;
	}

	this.addRoomToColony = function(colony, room) {
		// add if it doesn't exist
		//this.memory(OBJECT_TYPE_ROOMS, this.room.name)
		if (!room.memory.colonyId) {
			room.memory.colonyId = colony.id;
			colony.rooms.push(room);
			this.memory.save(colony);
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

			var sourceMemory = this.createResourceMemory(source);

			if(sourceMemory){
				colony.sources[source.id] = { id: source.id };
				this.memory.save(colony);
				var sourceOperation = this.assignSourceOperation(sourceMemory);
				if(sourceOperation){
					if(!helper.objExists(colony.operations.resourceOperations[RESOURCE_ENERGY])){
						colony.operations.resourceOperations[RESOURCE_ENERGY] = [];
					}
					colony.operations.resourceOperations[RESOURCE_ENERGY].push(sourceOperation.id);
					return this.memory.save(colony);
				}
				else{
					logger.logWarning("colonyManager.addSourceToColony(colony, source) - Failed to assign Source Operation to source " + source.id);
				}
			}
			else{
				logger.logWarning("colonyManager.addSourceToColony(colony, source) - Failed to create source memory for source " + source.id);
			}
		}
		else{
			logger.logWarning("colonyManager.addSourceToColony(colony, source) - Invalid parameters given.");
			logger.log("colony - " + JSON.stringify(colony));
			logger.log("source - " + JSON.stringify(source));
		}

		return false;
	};


	this.assignSourceOperation = function (sourceMemory){
		// if no operation assigned
		if (sourceMemory && !sourceMemory.operationId) {
			//create operation
			const source = this.game.getObjectById(sourceMemory.id);
			if(source){
				let colony = this.memory.getById(OBJECT_TYPE_COLONY, sourceMemory.colonyId);
				let sourceOperation = this.operationManager.createSourceOperation(source);

				if(sourceOperation){
					// save source memory with operation id
					sourceMemory.operationId = sourceOperation.id;
					this.memory.save(sourceMemory);
					
					return sourceMemory;
				}
				else{
					log.logWarning("Failed to create source operation.");
				}
			}
			else{
				log.logWarning("Couldn't find source with id " + sourceMemory.id);
			}
			
		}
		else{
			log.logWarning("Invalid parameters passed.");
			log.log("sourceMemory - " + JSON.stringify(sourceMemory));
		}

		return false;
	}

	this.runColony = function(colony){
		// start run colony
		// Resource check
		this.checkColonyResourceRequirements(colony);

		// check spawn queues and spawn creeps
		this.processSpawning(colony);

		this.processResourceRequestsType(colony);
	}

	// // this function performs all colony activities
	// this.run = function(colony) {
	// 	// start run colony
	// 	// Resource check
	// 	this.checkColonyResourceRequirements(colony);

	// 	//process resources
	// 	//this.processColonyResources(colony);

	// 	// check spawn queues and spawn creeps
	// 	this.processSpawning(colony);
	// 	// resource requests
	// 	this.processResourceRequests(colony);
	// 	// priorities
	// 	// resource out
	// };	

	// // Function will assign minerals to colony
	// this.checkColonyMinerals = function(colony) {
	// 	//TODO: add minderal logic
	// 	//const minerals = room.find(FIND_MINERALS);
	// };

	// this.addSourceOperations = function(colony) {
	// 	// cycle through all the sources and determine if they have an operation. If not create one.
	// 	for (const sourceId in colony.sources) {
	// 		let sourceMemory = this.memory.getById(OBJECT_TYPE_SOURCE_MEMORY, sourceId);

	// 		// check source memory exists
	// 		if (!sourceMemory) {
	// 			const source = this.game.getObjectById(sourceId);
	// 			if (source) {
	// 				sourceMemory = this.createSourceMemory(source);
	// 			}
	// 		}

	// 		// if no operation assigned
	// 		if (sourceMemory && !sourceMemory.operationId) {
	// 			//create operation
	// 			const source = this.game.getObjectById(sourceId);
	// 			let sourceOperation = this.operationManager.createSourceOperation(source);

	// 			// save source memory with operation id
	// 			sourceMemory.operationId = sourceOperation.id;
	// 			memory.save(sourceMemory);
	// 		}
	// 	}
	// };

	this.createResourceMemory = function(resource){
		if (resource.room.memory.colonyId) {
			var resourceType = RESOURCE_ENERGY;
			if(resource.mineralType){
				resourceType = resource.mineralType;
			}

			return this.memory.save({
				id: resource.id,
				objectType: OBJECT_TYPE_RESOURCE,
				resourceType: resourceType,
				operationId: 0,
				colonyId: resource.room.memory.colonyId
			});
		}

		return false;
	}

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
			let areCreepsToSpawn = true;
			for (let j = 0; j < spawns.length && areCreepsToSpawn; j++) {
				let spawn = spawns[j];
				let creepToSpawn = this.getNextCreepFromSpawnQueue(colony);
				// assign to spawn
				if(creepToSpawn){
					spawn.memory.creepToSpawn = creepToSpawn;
					this.spawnManager.spawnCreep(spawn);
				}
				else{
					// ran out of creeps to spawn so bail
					areCreepsToSpawn = false;
				}
			}
		}
	};

	this.getNextCreepFromSpawnQueue = function(colony){
		if(colony){
			// get spawn queues
			// high
			let highQueue = colony.spawnQueue[PRIORITY_HIGH];
			if(highQueue){
				return highQueue.shift();
			}
			
			// medium
			let medQueue = colony.spawnQueue[PRIORITY_MEDIUM];
			if(medQueue){
				return medQueue.shift();
			}
			
			// low
			let lowQueue = colony.spawnQueue[PRIORITY_LOW];
			if(lowQueue){
				return lowQueue.shift();
			}
		}
		else{
			logger.logWarning("Invalid parameter Colony:");
			logger.log(JSON.stringify(colony));
		}
	}

	this.processSourceOperations = function(colony) {
		// cycle sources
		for (const id in colony.sources) {
			let sourceMemory = this.memory.getById(OBJECT_TYPE_SOURCE_MEMORY, id);
			if (sourceMemory.operationId) {
				let sourceOperation = this.memory.getById(OBJECT_TYPE_SOURCE_OPERATION, sourceMemory.operationId);
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
	this.processResourceRequestsType = function(colony) {
		
		for(var type in colony.resourceRequests){
			var resourceRequestType = colony.resourceRequests[type];
			
			var highPriorityRequests = resourceRequestType[PRIORITY_HIGH];
			this.processResourceRequests(highPriorityRequests);
			var mediumPriorityRequests = resourceRequestType[PRIORITY_MEDIUM];
			this.processResourceRequests(mediumPriorityRequests);
			var lowPriorityRequests = resourceRequestType[PRIORITY_LOW];
			this.processResourceRequests(lowPriorityRequests);
		}
	};

	this.processResourceRequests = function(resourceRequests){
		if(resourceRequests){
			for(const i in resourceRequests){
				var resourceRequest = resourceRequests[i];

				// prefer a transporter over utility
				var creep = this.getNextAvailableCreep(colony, CREEP_TYPE_TRANSPORTER);

				if(!creep){
					creep = this.getNextAvailableCreep(colony, CREEP_TYPE_UTILITY);
				}

				if(creep){
					this.assignResourceRequestToCreep(resourceRequest, creep);
				}
				else{
					// TODO no creeps so create a spawning request
				}
				
				throw new Error("TODO");
			}
		}
		else{
			logger.logWarning("Invalid parameter resourceRequests");
			logger.log(JSON.stringify(resourceRequests));
		}
	}

	this.getNextAvailableCreep = function(colony, creepType){
		if(colony){
			let creepFound = false,
				noCreeps = false;
			while(!creepFound){
				var creepName = this.getNextFreeCreepFrom(colony, creepType);

				// creepName found in queue
				if(creepName){
					var creep = this.game.creeps[creepName];
					if(creep){
						return creep;
					}
					else{
						logger.logWarning("Missing Creep detected name: " + creepName);
						// TODO need a missing creep handler
					}
				}
				else{
					// no creep name found so queue empty
					return;
				}
			}
		}
		else{
			logger.logWarning("Invalid parameter colony");
			logger.log(JSON.stringify(colony));
		}
	}



	this.assignResourceRequestToCreep= function(resourceRequest, creep){

		throw new Error("TODO")
	}

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

	this.getNextFreeCreepFrom = function(colony, creepType){
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

		if(colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE]){
			var creep = colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].shift();
			colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].push(creep);
			this.memory.save(colony);
			return creep;
		}

		return;
	}
};
