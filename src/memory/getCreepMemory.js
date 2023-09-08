const getMemory = require("./getMemory");

const getCreepMemory = (creepId) => {
	var appMemory = getMemory();

	if (!appMemory.creeps[creepId]) {
		appMemory.creeps[creepId] = {};
	}

	return appMemory.creeps[creepId];
};

module.exports = getCreepMemory;
