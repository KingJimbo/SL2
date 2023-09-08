const getObjectMemory = require("../memory/getObjectMemory");
const runOperation = require("./runOperation");

const runOperations = () => {
	const operations = getObjectMemory(OBJECT_TYPE.OPERATION);

	for (const operationId in operations) {
		const operation = operations[operationId];

		runOperation(operation);
	}
};

module.exports = runOperations;
