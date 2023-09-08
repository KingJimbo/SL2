const getNextId = (objectType) => {
	if (!Memory.objectIds) {
		Memory.objectIds = {};
	}

	if (!Memory.objectIds[objectType]) {
		Memory.objectIds[objectType] = 0;
	}
	Memory.objectIds[objectType]++;
	return `${objectType}${Memory.objectIds[objectType]}`;
};

module.exports = getNextId;
