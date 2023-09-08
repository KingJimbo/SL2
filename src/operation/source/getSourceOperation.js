const getObjectMemoryById = require("../../memory/getObjectMemoryById");
const getMemoryById = require("../../memory/getMemoryById");

const getSourceOperation = (source) => {
	const sourceMemory = getMemoryById(source.id);

	const operationId = sourceMemory.operationId;

	return getObjectMemory(OBJECT_TYPE.OPERATION, operationId);
};

module.exports = getSourceOperation;
