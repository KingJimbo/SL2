const getMemory = require("./getMemory");

const getMemoryById = (id) => {
	var appMemory = getMemory();

	if (!appMemory.objectMemory[id]) {
		appMemory.objectMemory[id] = {};
	}

	return appMemory.objectMemory[id];
};

module.exports = getMemoryById;
