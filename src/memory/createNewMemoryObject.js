const createNewMemoryObject = (memoryIntialisedTime, config) => {
	return {
		settings: { version: config.version, memoryIntialisedTime },
		objectIds: {},
		objectMemory: {},
		structures: {},
		rooms: {},
		creeps: {},
	};
};

module.exports = createNewMemoryObject;
