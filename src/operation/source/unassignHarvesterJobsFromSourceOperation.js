const removeHarvestJob = require("../../job/harvest/removeHarvestJob");

const unassignHarvesterJobsFromSourceOperation = (sourceOperation) => {
	for (const harvesterJobId in sourceOperation.harvestJobIds) {
		removeHarvestJob(harvesterJobId);
	}

	sourceOperation.harvestJobIds = null;
};

module.exports = unassignHarvesterJobsFromSourceOperation;
