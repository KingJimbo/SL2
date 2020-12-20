const { goToSource, harvest, fullEnergyFillOrder } = require("./creep");
const { findNextFreeSource } = require("./room");
const { isCreepIdle, addCreepToIdlePool } = require("./roomCreepRequisition");

module.exports = {
	runIdleCreep: (creep) => {
		if (!isCreepIdle(creep)) {
			//console.log("No creep name found idle creep memory adding to idle pool");
			addCreepToIdlePool(creep.room, creep);
		}
		creep.moveTo(0, 0);
	},
	runHarvesterCreep: (creep) => {
		if (!creep.memory.sourceId) {
			var source = findNextFreeSource(creep.room);
		}

		if (!creep.memory.currentAction) {
			creep.store.getFreeCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY)
				? (creep.memory.currentAction = CREEP_ACTIONS.GO_TO_SOURCE)
				: (creep.memory.currentAction = CREEP_ACTIONS.FULLFILL_ENERGY_ORDER);
		}

		switch (creep.memory.currentAction) {
			case CREEP_ACTIONS.GO_TO_SOURCE:
				goToSource(creep);
				break;
			case CREEP_ACTIONS.HARVEST:
				harvest(creep);
				break;
			case CREEP_ACTIONS.FULLFILL_ENERGY_ORDER:
				fullEnergyFillOrder(creep);
				break;
		}
	},
};
