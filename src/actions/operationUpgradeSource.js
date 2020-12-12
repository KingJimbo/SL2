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
		};

		return saveObject(operation);
	},
};
