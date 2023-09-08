const createHarvestJob = require("./createHarvestJob");

const createHarvestJobs = (numberOfJobs, operationId, harvestableObjectId) => {
	let harvestJobIds = [];

	for (let i = 0; i < numberOfJobs; i++) {
		const harvestJob = createHarvestJob(harvestableObjectId, operationId);
		harvestJobIds.push(harvestJob.id);
	}

	return harvestJobIds;
};

module.exports = createHarvestJobs;
