const getMemory = require("./getMemory");
const getNextId = require("./getNextId");

const saveObjectMemory = (obj) => {
	if (!obj.objectType) {
		throw new Error("Invalid object Type provided");
	}

	let memory = getMemory();

	if (!memory[obj.objectType]) {
		memory[obj.objectType] = {};
	}

	// assign if if one doesn't already exist
	if (!obj.id) obj.id = getNextId(obj.objectType);

	memory[obj.objectType][obj.id] = obj;

	return obj;
};

module.exports = saveObjectMemory;
