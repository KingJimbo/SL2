const { OBJECT_TYPE } = require("../../common/constants");
const { isANumber, getAccessiblePositions } = require("../common");
const { saveObject } = require("../memory");
const { checkOperationCreeps } = require("./creeps");

module.exports = {
	runSourceOperation: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameter source operation");
		}

		let source = Game.getObjectById(operation.sourceId);

		if (!operation.level || source.room.controller.level > operation.level) {
			upgradeSourceOperation(operation);
		}

		checkOperationCreeps(operation);
	},
};
