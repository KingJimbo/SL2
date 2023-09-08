const createHarvestJobs = require("../../job/harvest/createHarvestJobs");
const getAccessiblePositions = require("../../position/getAccessiblePositions");
const getMemoryById = require("../../memory/getMemoryById");

const runHarvestSourceOperation = (sourceOperation, source) => {
	const sourceMemory = getMemoryById(source.id);

	if (!sourceMemory.openSpaces) {
		sourceMemory.openSpaces = getAccessiblePositions(source.pos);
	}

	const numberOfOpenSpaces = sourceMemory.openSpaces.length;
	let numberOfJobs = 0;

	// no current jobs so create some
	if (!sourceOperation.harvestJobIds) {
		numberOfJobs = numberOfOpenSpaces;
		sourceOperation.harvestJobIds = [];
	} else {
		numberOfJobs = numberOfOpenSpaces - sourceOperation.harvestJobIds.length;
	}

	console.log(`numberOfOpenSpaces ${numberOfOpenSpaces} | sourceOperation.harvestJobIds.length ${sourceOperation.harvestJobIds.length}`);

	if (numberOfJobs > 0) {
		const newHarvestJobs = createHarvestJobs(numberOfJobs, sourceOperation.id, sourceOperation.sourceId);
		sourceOperation.harvestJobIds = sourceOperation.harvestJobIds.concat(newHarvestJobs);
	}
};

module.exports = runHarvestSourceOperation;
