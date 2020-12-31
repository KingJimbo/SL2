let structureModule = {
	checkStructure: (structure) => {
		//
		if (structure.hits < structure.hitsMax) {
			resourceModule.addStructureRepairRequest(structure);
		}
	},

	runExtension: (extension) => {
		const { resourceModule } = global.App;

		const freeCapacity = extension.store.getFreeCapacity(RESOURCE_ENERGY);
		resourceModule.addStructureResourceRequest(extension, RESOURCE_ENERGY, freeCapacity);
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
		if (tower.room.memory.isUnderAttack) {
			const freeCapacity = tower.store.getFreeCapacity(RESOURCE_ENERGY);

			if (freeCapacity) {
				resourceModule.addStructureResourceRequest(tower, RESOURCE_ENERGY, freeCapacity);
			}

			return;
		}

		const usedCapacity = tower.store.getUsedCapacity(RESOURCE_ENERGY);

		if (usedCapacity < MIN_TOWER_ENERGY_CAPACITY) {
			const requiredEnergy = MIN_TOWER_ENERGY_CAPACITY - usedCapacity;

			resourceModule.addStructureResourceRequest(tower, RESOURCE_ENERGY, requiredEnergy);
		}
	},

	runContainer: (container) => {
		// do nothing for now
		//const usedCapacity = container.store.getUsedCapacity(RESOURCE_ENERGY);)
	},
};

global.App.structureModule = structureModule;

module.exports = global.App.structureModule;
