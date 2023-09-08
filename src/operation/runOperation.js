const runSourceOperation = require("./source/runSourceOperation");

const runOperation = (operation) => {
	switch (operation.operationType) {
		case OPERATION_TYPE.SOURCE:
			runSourceOperation(operation);
			break;
	}
};

module.exports = runOperation;
