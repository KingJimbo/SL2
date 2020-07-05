// resource-manager.js

module.exports = function ({ memoryManager, game }) {
	this.memoryManager = memoryManager;
	this.game = game;

	/**
	 * Function: Assign Colony Resources
	 * Description: Function that checks Source and Mineral in a colony room after a certain amount of time.
	 */
	this.assignColonyResources = function (colony) {
		// verify last resource check
		if (!colony.lastResourceCheck || colony.lastResourceCheck.level < this.game.rooms[colony.mainRoom].controller.level) {
			// find rooms for colony
			this.assignColonySources(colony);

			// TODO
			// not a problem until later levels
			this.assignColonyMinerals(colony);

			colony.lastResourceCheck = this.game.time;
		}
	};

	// Function will assign sources to colony
	this.assignColonySources = function (colony) {
		const room = this.game.rooms[colony.roomName];

		const sources = room.find(FIND_SOURCES);

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			// add sources to colony
			if (!this.addSourceToColony(colony, source)) {
				logger.warning('colonyManager.assignColonySources(colony) - Failed to add source to colony.');
			}
		}
	};

	this.assignColonyMinerals = function (colony) {
		if (colony) {
			const room = this.game.rooms[colony.roomName];

			const minerals = room.find(FIND_MINERALS);

			for (let i = 0; i < minerals.length; i++) {
				const mineral = minerals[i];
				// add sources to colony
				if (!this.addMineralToColony(colony, mineral)) {
					logger.warning(
						'colonyManager.assignColonyMinerals(colony) - Failed to assign mineral ' +
							mineral.id +
							' of type ' +
							mineral.mineralType +
							' to colony ' +
							colony.id
					);
				}
			}
		} else {
			logger.warning('colonyManager.assignColonyMinerals(colony) - Invalid parameters passsed.');
			logger.log('colony - ' + JSON.stringify(colony));
		}
	};

	//TODO
	this.addMineralToColony = function (colony, mineral) {
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
		// 			logger.warning("colonyManager.addMineralToColony(colony, mineral) - Failed to assign Source Operation to source " + source.id);
		// 		}
		// 	}
		// 	else{
		// 		logger.warning("colonyManager.addMineralToColony(colony, mineral) - Failed to create source memory for source " + source.id);
		// 	}
		// }
		// else{
		// 	logger.warning("colonyManager.addMineralToColony(colony, mineral) - Invalid parameters given.");
		// 	logger.log("colony - " + JSON.stringify(colony));
		// 	logger.log("mineral - " + JSON.stringify(mineral));
		// }

		return false;
	};

	this.addSourceToColony = function (colony, source) {
		if (colony && source) {
			if (!colony.sources) {
				colony.sources = {};
			}

			var sourceMemory = this.createResourceMemory(source);

			if (sourceMemory) {
				colony.sources[source.id] = { id: source.id };
				this.memory.save(colony);
				var sourceOperation = this.assignSourceOperation(sourceMemory);
				if (sourceOperation) {
					if (!helper.objExists(colony.operations.resourceOperations[RESOURCE_ENERGY])) {
						colony.operations.resourceOperations[RESOURCE_ENERGY] = [];
					}
					colony.operations.resourceOperations[RESOURCE_ENERGY].push(sourceOperation.id);
					return this.memory.save(colony);
				} else {
					logger.warning('colonyManager.addSourceToColony(colony, source) - Failed to assign Source Operation to source ' + source.id);
				}
			} else {
				logger.warning('colonyManager.addSourceToColony(colony, source) - Failed to create source memory for source ' + source.id);
			}
		} else {
			logger.warning('colonyManager.addSourceToColony(colony, source) - Invalid parameters given.');
			logger.log('colony - ' + JSON.stringify(colony));
			logger.log('source - ' + JSON.stringify(source));
		}

		return false;
	};

	this.createResourceMemory = function (resource) {
		if (resource.room.memory.colonyId) {
			var resourceType = RESOURCE_ENERGY;
			if (resource.mineralType) {
				resourceType = resource.mineralType;
			}

			return this.memory.save({
				id: resource.id,
				objectType: OBJECT_TYPE_RESOURCE,
				resourceType: resourceType,
				operationId: 0,
				colonyId: resource.room.memory.colonyId,
			});
		}

		return false;
	};

	this.checkColonyResourceRequirements = function (colony) {
		// add check if cpu is limited
		//if (!colony.lastResourceCheck || colony.lastResourceCheck) {
		//}
		// check buildings in colony
		if (!colony.structureMap) {
			this.generateColonyStructureMap(colony);
		}

		this.resourceManager.checkColonyResourceRequirements(colony);
	};

	this.createResourceRequest = function (args) {
		//colonyId, pos, amount, type, priority) {
		// validate parameters
		if (args.colonyId && args.pos && args.type && args.priority) {
			let colony = this.memoryManager.getById(OBJECT_TYPE_COLONY, args.colonyId);
			if (!args.priority) {
				args.priority = PRIORITY_LOW;
			}
			this.checkColonyResourceRequests(colony, args.type, args.priority);

			colony.resourceRequests[args.type][args.priority].push({
				destinationPos: args.pos,
				amount: args.amount,
			});

			return this.memoryManager.save(colony);
		} else {
			logger.warning('Invalid parameters passed');
			logger.log('args: ' + JSON.stringify(args));
		}
	};

	// this.assignCreepsToResourceRequests = function(colony, creepNames) {
	// 	//TODO
	// 	let resourceRequests;

	// 	while (creepNames.length > 0) {}
	// };

	this.checkColonyResourceRequests = function (colony, type, priority) {
		if (!colony.resourceRequests) {
			colony.resourceRequests = {};
		}

		if (!colony.resourceRequests[type]) {
			colony.resourceRequests[type] = {};
		}

		if (!colony.resourceRequests[type][priority]) {
			colony.resourceRequests[type][priority] = [];
		}
	};

	this.getColonyResourceRequests = function (colony, type, priority) {
		this.checkColonyResourceRequests(colony, type, priority);
		return colony.resourceRequests[type][priority];
	};

	// search structure map to find all structures and check what resources they need
	this.checkColonyResourceRequirements = function (colony) {
		if (colony.structureMap) {
			for (const i in colony.structureMap) {
				const structureMapItem = colony.structureMap[i];
				for (const id in structureMapItem) {
					const structure = this.game.getObjectById(id);
					let resourceRequest = null;
					switch (structure.structureType) {
						case STRUCTURE_SPAWN:
							resourceRequest = this.determineSpawnRequirements(structure);
							break;
						case STRUCTURE_CONTROLLER:
							resourceRequest = this.determineControllerRequirements(structure);
							break;
					}

					if (!resourceRequest) {
						logger.warning('Failed to determine resource requirements for.');
						logger.log('structure: ' + JSON.stringify(structure));
					}
				}
			}
		}
		// save all changes to colony
		this.memoryManager.save(colony);
	};

	this.determineSpawnRequirements = function (spawn) {
		// check if a creep is scheduled to be spawned & hasn't made a request yet
		if (spawn.memory.creepToSpawn && !spawn.memory.requestId) {
			let amount = spawn.energyCapacity - spawn.energy;
			return this.createResourceRequest(spawn.room.colonyId, spawn.pos, amount, RESOURCE_ENERGY, spawn.memory.creepToSpawn.priority);
		}
	};

	this.determineControllerRequirements = function (controller) {
		// check if controller is max level
		if (controller.level < 8) {
			return this.createResourceRequest(controller.room.colonyId, controller.pos, 0, RESOURCE_ENERGY, PRIORITY_LOW);
		}
		//
	};
};
