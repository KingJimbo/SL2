const createMinerJob = require("../../job/createMinerJob");
const getCreep = require("../../creep/getCreep");
const getObjectMemoryById = require("../../memory/getObjectMemoryById");

const checkSourceOperationForMinerJobAndMiner = (sourceOperation) => {
	// yes container exists
	if (!sourceOperation.minerJobId) {
		// no miner job so create job
		sourceOperation.minerJobId = createMinerJob(sourceOperation.sourceId, sourceOperation.id);
		return false;
	}

	const minerJob = getObjectMemoryById(OBJECT_TYPE.JOB, sourceOperation.minerJobId);

	if (!minerJob) {
		// miner job doesn't exist so create it
		const minerJobId = createMinerJob(sourceOperation.sourceId, sourceOperation.id);

		sourceOperation.minerJobId = minerJobId;
		return false;
	}

	if (!minerJob.creepId) {
		// job exists but creep hasn't been spawned yet so nothing else we can do
		// creep spawning is handled by job
		return false;
	}

	const minerCreep = getCreep(minerJob.creepId);

	if (!minerCreep) {
		// creep doesn't exist anymore so remove
		minerJob.creepId = null;
		return false;
	}

	return true; // has both job and miner attached
};

module.exports = checkSourceOperationForMinerJobAndMiner;
