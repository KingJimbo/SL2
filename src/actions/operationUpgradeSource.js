const { CONDITIONS } = require("../common/constants");
const { getAccessiblePositions } = require("./common");
const { saveObject } = require("./memory");

module.exports = {
	upgradeToLevelOne: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameter operation");
		}

		let source = Game.getObjectById(operation.sourceId);

		const accessPos = getAccessiblePositions(source.pos);

		operation.creepRoles = {};

		operation.creepRoles[CREEP_ROLES.HARVESTER] = {
			operationId: operation.id,
			noCreepsRequired: accessPos.length,
			creepType: CREEP_TYPES.UTILITY,
			conditions: [{ condition: CONDITIONS.LESS_THAN_OR_EQUAL, valueType: CONDITION_VALUES.ROOM_TOTAL_ENERGY_CAPACITY, value: 300 }],
			creepData: {},
		};

		operation.creepRoles[CREEP_ROLES.MINER] = {
			operationId: operation.id,
			noCreepsRequired: 1,
			creepType: CREEP_TYPES.MINER,
			conditions: [{ condition: CONDITIONS.GREATER_THAN_OR_EQUAL, valueType: CONDITION_VALUES.ROOM_TOTAL_ENERGY_CAPACITY, value: 550 }],
			creepData: {},
		};

		return saveObject(operation);
	},
};
