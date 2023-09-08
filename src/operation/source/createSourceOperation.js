const saveObject = require("../../memory/saveObject");
const getMemoryById = require("../../memory/getMemoryById");
const initialiseSourceOperation = require("./initialiseSourceOperation");

const createSourceOperation = (source) => {
	if (!source) {
		throw new Error("Invalid target for source operation");
	}

	var sourceMemory = getMemoryById(source.id);

	console.log(JSON.stringify(global.COORDINATES_MAX_SIZE));

	console.log(JSON.stringify(global.COORDINATES_MAX_SIZE));

	var sourceOperation = initialiseSourceOperation(source.id);

	// save operation, id will be assigned
	sourceOperation = saveObject(sourceOperation);

	// assign operation id to source memory
	sourceMemory.operationId = sourceOperation.id;
};

module.exports = createSourceOperation;
