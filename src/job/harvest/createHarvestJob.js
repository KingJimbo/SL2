const saveObject = require("../../memory/saveObject");

const createHarvestJob = (harvestableObjectId, operationId) => {
	let harvestJob = {
		harvestableObjectId,
		operationId,
		creepId: null,
		jobType: JOB_TYPE.HARVEST,
		creepType: CREEP_TYPE_UTILITY,
		objectType: OBJECT_TYPE.JOB,
	};

	return saveObject(harvestJob);
};

module.exports = createHarvestJob;
