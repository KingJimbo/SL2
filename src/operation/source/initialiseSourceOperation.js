const initialiseSourceOperation = (sourceId) => {
	return {
		id: null,
		sourceId: sourceId,
		sourceAvailableSpaces: 0,
		assignedCreeps: {},
		requiredCreeps: {},
		harvestJobIds: [],
		objectType: OBJECT_TYPE.OPERATION,
		operationType: OPERATION_TYPE.SOURCE,
	};
};

module.exports = initialiseSourceOperation;
