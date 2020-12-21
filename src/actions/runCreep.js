const { goToSource, harvest, fullEnergyFillOrder } = require("./creep");
const { findNextFreeSource, positionHasNearbyThreat } = require("./room");
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
		var source = null;

		if (!creep.memory.sourceId) {
			source = findNextFreeSource(creep.room);

			if (!source) {
				addCreepToIdlePool(creep.room, creep);
			}

			creep.memory.sourceId = source.id;
		}

		source = Game.getObjectById(creep.memory.sourceId);

		if (!source) {
			addCreepToIdlePool(creep.room, creep);
		}

		if (positionHasNearbyThreat(source.pos)) {
			addCreepToIdlePool(creep.room, creep);
		}

		if (!creep.room.memory.sources[creep.memory.sourceId]) {
			creep.room.memory.sources[creep.memory.sourceId] = {};
		}

		if (!creep.room.memory.sources[creep.memory.sourceId].currentCreeps) {
			creep.room.memory.sources[creep.memory.sourceId].currentCreeps = {};
		}

		if (!creep.room.memory.sources[creep.memory.sourceId].currentCreeps[creep.name]) {
			creep.room.memory.sources[creep.memory.sourceId].currentCreeps[creep.name] = creep.name;
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
