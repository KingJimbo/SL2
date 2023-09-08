const getMemory = () => {
	if (!global.Memory.app) throw new Error("can't find memory!");

	return global.Memory.app;
};

module.exports = getMemory;
