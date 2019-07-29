// resource-manager.js

module.exports = function(memoryManager, game) {
	this.memoryManager = memoryManager;
	this.game = game;

	this.createResourceRequest = function(args){//colonyId, pos, amount, type, priority) {
		// validate parameters
		if (args.colonyId && args.pos && args.type && args.priority) {
			let colony = this.memoryManager.getById(OBJECT_TYPE_COLONY, args.colonyId);
			if (!args.priority) {
				args.priority = PRIORITY_LOW;
			}
			this.checkColonyResourceRequests(colony, args.type, args.priority);

			colony.resourceRequests[args.type][args.priority].push({
				destinationPos: args.pos,
				amount: args.amount
			});

			return this.memoryManager.save(colony);
		} else {
			logger.logWarning("Invalid parameters passed");
			logger.log("args: " + JSON.stringify(args));
		}
	};

	
	// this.assignCreepsToResourceRequests = function(colony, creepNames) {
	// 	//TODO
	// 	let resourceRequests;

	// 	while (creepNames.length > 0) {}
	// };

	this.checkColonyResourceRequests = function(colony, type, priority) {
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

	this.getColonyResourceRequests = function(colony, type, priority) {
		this.checkColonyResourceRequests(colony, type, priority);
		return colony.resourceRequests[type][priority];
	};

	// search structure map to find all structures and check what resources they need
	this.checkColonyResourceRequirements = function(colony) {
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

					if(!resourceRequest){
						logger.logWarning("Failed to determine resource requirements for.")
						logger.log("structure: " + JSON.stringify(structure));
					}
				}
			}
		}
		// save all changes to colony
		this.memoryManager.save(colony);
	};

	this.determineSpawnRequirements = function(spawn) {
		// check if a creep is scheduled to be spawned & hasn't made a request yet
		if (spawn.memory.creepToSpawn && !spawn.memory.requestId) {
			let amount = spawn.energyCapacity - spawn.energy;
			return this.createResourceRequest(spawn.room.colonyId, spawn.pos, amount, RESOURCE_ENERGY, spawn.memory.creepToSpawn.priority);
		}
	};

	this.determineControllerRequirements = function(controller) {
		// check if controller is max level
		if (controller.level < 8) {
			return this.createResourceRequest(controller.room.colonyId, controller.pos, 0, RESOURCE_ENERGY, PRIORITY_LOW);
		}
		//
	};
};
