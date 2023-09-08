const doesRoomMeetRequirementsForMining = require("../../room/doesRoomMeetRequirementsForMining");
const checkSourceOperationForContainerOrBuildJob = require("./checkSourceOperationForContainerOrBuildJob");
const checkSourceOperationForMinerJobAndMiner = require("./checkSourceOperationForMinerJobAndMiner");
const runHarvestSourceOperation = require("./runHarvestSourceOperation");

const runSourceOperation = (sourceOperation) => {
	const source = Game.getObjectById(sourceOperation.sourceId);

	if (!source) {
		// no source so should delete operation
		// should never happen
		if (process.env.NODE_ENV === "development") {
			console.log(JSON.stringify(sourceOperation));
		}

		throw new Error(`Can't find source belonging to sourceOperation ${sourceOperation.id}`);
	}

	// is room suitable for mining
	const isRoomSuitableForMining = doesRoomMeetRequirementsForMining(source.room);

	if (!isRoomSuitableForMining) {
		runHarvestSourceOperation(sourceOperation, source);
		return;
	}

	const hasContainerOrJob = checkSourceOperationForContainerOrBuildJob(sourceOperation, source);

	if (!hasContainerOrJob) {
		runHarvestSourceOperation(sourceOperation, source);
		return;
	}

	const hasMiner = checkSourceOperationForMinerJobAndMiner();

	if (!hasMiner) {
		runHarvestSourceOperation(sourceOperation, source);
		return;
	}

	// managed to get to the end so must have all resources
	// get rid of all harvester jobs
	unassignHarvesterJobsFromSourceOperation(sourceOperation);
};

module.exports = runSourceOperation;
