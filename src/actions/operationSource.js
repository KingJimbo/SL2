const { OPERATION_TYPE } = require("../common/constants");
const { saveObject } = require("./memory");
const { upgradeToLevelOne } = require("./operationUpgradeSource");

module.exports = {
	createSourceOperation: (source) => {
		if (!source) {
			console.log(`Invalid paramters: source`);
			return null;
		}

		let operation = saveObject({
			objectType: OBJECT_TYPE.OPERATION,
			operationType: OPERATION_TYPE.SOURCE,
			sourceId: source.id,
			room: source.room.name,
		});

		if (!operation) {
			console.log(`Failed to create build operation`);
			return null;
		}

		source.room.memory.sources[source.id] = {
			operationId: operation.id,
		};

		return operation;
	},
	upgradeSourceOperation: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameters operation!");
		}

		let source = Game.getObjectById(operation.sourceId);

		if (!operation.level || source.room.controller.level > operation.level) {
			switch (source.room.controller.level) {
				case 1:
					upgradeToLevelOne(operation);
					break;
				case 2:
					break;
				case 3:
					break;
				case 4:
					break;
				case 5:
					break;
				case 6:
					break;
				case 7:
					break;
				case 8:
					break;
			}
		}
	},
};
