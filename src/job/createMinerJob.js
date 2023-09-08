const saveObject = require("../memory/saveObject");

const createMinerJob = (minableObjectId, operationId) => {
	let minerJob = {
		minableObjectId,
		operationId,
		creepId: null,
		jobType: JOB_TYPE.MINE,
		creepType: CREEP_TYPE_MINER,
	};

	return saveObject(OBJECT_TYPE.JOB, minerJob);
};

module.exports = createMinerJob;
