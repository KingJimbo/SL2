let structureModule = {
	checkStructure: (structure) => {
		//
		if (structure.hits < structure.hitsMax) {
			resourceModule.addRepairRequest(structure);
		}
	},

	runExtension: (extension) => {
		const { resourceModule } = global.App;

		const freeCapacity = extension.store.getFreeCapacity(RESOURCE_ENERGY);
		resourceModule.addTransferRequest(extension, RESOURCE_ENERGY, freeCapacity);
	}, // runExtension END

	runRoad: (road) => {
		// do nothing for now
	},

	runWall: (wall) => {
		// do nothing for now
	},

	runRampart: (rampart) => {
		// do nothing for now
	},

	runTower: (tower) => {
		const freeCapacity = tower.store.getFreeCapacity(RESOURCE_ENERGY);
		let actionResult = null;

		if (freeCapacity) {
			resourceModule.addTransferRequest(tower, RESOURCE_ENERGY, freeCapacity);
		}

		if (tower.room.memory.isUnderAttack) {
			for (const creepId in room.memory.threats.creeps) {
				const hostileCreep = Game.getObjectById(creepId);

				if (hostileCreep) {
					actionResult = tower.attack(hostileCreep);
					break;
				}
			}
		} else {
			//....first heal any damaged creeps
			for (let name in Game.creeps) {
				// get the creep object
				var creep = Game.creeps[name];
				if (creep.hits < creep.hitsMax) {
					actionResult = tower.heal(creep);
					break;
				}
			}

			// if no action taken yet repair
			if (!actionResult) {
				let towerMemory = resourceModule.getStructureMemory(tower),
					structure = null;

				if (towerMemory.structureId) {
					structure = Game.getObjectById(towerMemory.structureId);

					if (structure && structure.hitsMax !== structure.hits) {
						actionResult = tower.repair(structure);
					} else {
						towerMemory.structureId = null;
					}
				}

				if (!towerMemory.structureId) {
					structure = resourceModule.assignRepairerToNextRequest(tower);

					if (structure) {
						towerMemory.structureId = structure.id;
						actionResult = tower.repair(structure);
					}
				}
			}
		}

		switch (actionResult) {
			default:
				// if (process.env.NODE_ENV === "development") {
				// 	global.logger.log(`tower action result ${actionResult}`);
				// }
				break;
		}

		return actionResult;
	},

	runContainer: (container) => {
		// do nothing for now
		//const usedCapacity = container.store.getUsedCapacity(RESOURCE_ENERGY);)
		const usedCapacity = container.store.getUsedCapacity(),
			{ resourceModule } = global.App;

		if (usedCapacity > 0) {
			for (const resourceType in container.store) {
				resourceModule.addWithdrawRequest(container, resourceType, container.store.getUsedCapacity(resourceType));
			}
		}
	},

	runController: (controller) => {
		const { resourceModule } = global.App;

		if (controller.progress < controller.progressTotal) {
			resourceModule.addUpgradeControllerRequest(controller);
		}
	},

	runSpawn: (spawn) => {
		// do nothing for now
		const { resourceModule } = global.App;

		if (spawn.room.memory.creepsToSpawn && spawn.room.memory.creepsToSpawn.length > 0) {
			const freeCapacity = spawn.store.getFreeCapacity(RESOURCE_ENERGY);
			resourceModule.addTransferRequest(spawn, RESOURCE_ENERGY, freeCapacity);
		}
	},
};

global.App.structureModule = structureModule;

module.exports = global.App.structureModule;
