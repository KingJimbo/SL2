// resource-manager.js

module.exports = function(memoryManager, game) {
	this.memoryManager = memoryManager;
	this.game = game;

	this.createResourceRequest = function(colonyId, pos, amount, type, priority) {
		// validate parameters
		if ((colonyId, pos, amount, type, priority)) {
			let colony = this.memoryManager.getById(OBJECT_TYPE_COLONY, colonyId);
			if (!priority) {
				priority = PRIORITY_LOW;
			}
			this.checkColonyResourceRequests(colony, type, priority);

			colony.resourceRequests[type][priority].push({
				destinationPos: pos,
				amount: amount
			});

			return this.memoryManager.save(colony);
		} else {
			return ERR_INVALID_ARGS;
		}
	};

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

					// if resource request exists add request
					if (resourceRequest) {
						resourceRequest = this.addResourceRequest(resourceRequest);

						// null check
						if (!colony.resourceRequests[resourceRequest.priority]) {
							colony.resourceRequests[resourceRequest.priority] = [];
						}
						colony.resourceRequests[resourceRequest.priority].push(resourceRequest.id);
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
			return this.createResourceRequest(controller.room.colonyId, controller.pos, 0, RESOURCE_ENERGY, "low");
		}
		//
	};
};
