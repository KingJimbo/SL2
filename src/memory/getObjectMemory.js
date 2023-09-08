const getMemory = require("./getMemory");

const getObjectMemory = (objectType) => {
	const memory = getMemory();

	if (!memory[objectType]) {
		memory[objectType] = {};
	}

	return memory[objectType];
};

module.exports = getObjectMemory;
