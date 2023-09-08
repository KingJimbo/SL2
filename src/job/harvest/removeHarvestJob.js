const removeObjectMemory = require("../../memory/removeObjectMemory");
const getCreepMemory = require("../../memory/getCreepMemory");

const removeHarvestJob = (harvestJob) => {
	if (!harvestJob) {
		return;
	}

	const creepMemory = getCreepMemory(harvestJob.creepId);

	// check if it's the same job as it might not be
	if (creepMemory.jobId === harvestJob.id) {
		creepMemory.jobId = null;
	}

	removeObjectMemory(harvestJob);
};

module.exports = removeHarvestJob;
