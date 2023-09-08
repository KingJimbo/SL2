const getMemoryById = require("../../memory/getMemoryById");
const createSourceOperation = require("../../operation/source/createSourceOperation");

const surveyRoomSource = (source) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`surveyRoomSource room:${source.room.name} | sourceId: ${source.id}`);
	}

	var sourceMemory = getMemoryById(source.id);

	// has no currently assigned operation
	if (!sourceMemory.operationId) {
		createSourceOperation(source);
		return;
	}
};

module.exports = surveyRoomSource;
