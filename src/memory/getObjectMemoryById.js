const getObjectMemory = require("./getObjectMemory");

const getObjectMemoryById = (objectType, id) => {
	const objectMemory = getObjectMemory(objectType);

	if (!objectMemory[id]) {
		throw new Error(`can't find object memory belonging to ${objectType} ${id}`);
	}

	return objectMemory[id];
};

module.exports = getObjectMemoryById;
