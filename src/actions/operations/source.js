const { OPERATION_TYPE } = require("../../common/constants");

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
};
