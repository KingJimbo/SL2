const createNewMemoryObject = require("./createNewMemoryObject");

const initialiseMemory = (memory, game, config) => {
	if (!memory.app) {
		memory.app = createNewMemoryObject(game.time, config);
		return;
	}

	// wipe app memory if a different version is used or clean memory as been set to true
	if ((memory.app.version !== config.version) | config.cleanMemory) {
		memory.app = createNewMemoryObject(game.time, config);
	}
};

module.exports = initialiseMemory;
