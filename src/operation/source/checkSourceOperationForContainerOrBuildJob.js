const getStuffNearByPosition = require("../../position/getStuffNearByPosition");

const checkSourceOperationForContainerOrBuildJob = (sourceOperation, source) => {
	// Is there a container in place at source?
	if (sourceOperation.containerId) {
		const container = Game.getObjectById(sourceOperation.containerId);

		if (container) {
			return true;
		}

		// doesn't exist anymore delete from sourceMemory
		sourceOperation.containerId = null;
	}

	// check for surrounding unassigned container
	const nearByContainers = getStuffNearByPosition(source.pos, 1, { structure: STRUCTURE_CONTAINER });

	if (nearByContainers) {
		const container = nearByContainers[0];
		// assign container
		sourceMemory.containerId = container.id;
		return true;
	}

	if (!sourceOperation.containerBuildJobId) {
		// assign build job id
		sourceOperation.containerBuildJobId = createBuildJob(pos, STRUCTURE_CONTAINER);
		return false;
	}

	const containerBuildJob = getObjectMemoryById(OBJECT_TYPE.JOB, sourceOperation.containerBuildJobId);

	if (!containerBuildJob) {
		sourceOperation.containerBuildJobId = createBuildJob(pos, STRUCTURE_CONTAINER);
		return false;
	}

	// container build job exists but still no container so return false
	return false;
};

module.exports = checkSourceOperationForContainerOrBuildJob;
