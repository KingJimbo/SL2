let memoryModule = {
	initialiseMemory: () => {
		// initialise memory start

		if (!Memory.memoryIntialisedTime) {
			if (process.env.NODE_ENV === "development") {
				console.log(`initialiseMemory initiated`);
			}

			Memory.objectIds = {};
			Memory.resourceOrders = {};
			Memory.resourceOrderItems = {};
			Memory.structureMemory = {};
			Memory.memoryIntialisedTime = Game.time;

			//Memory = { ...Memory, resourceOrders: {}, resourceOrderItems: {}, objectIds: {}, memoryIntialisedTime: Game.time };
		}
	}, // initialiseMemory END

	getNextId: (objectType) => {
		if (!Memory.objectIds[objectType]) {
			Memory.objectIds[objectType] = 0;
		}
		Memory.objectIds[objectType]++;
		return Memory.objectIds[objectType];
	}, // getNextId END

	getNextCreepName: () => {
		return "Creep_" + memoryModule.getNextId(OBJECT_TYPE.CREEP);
	}, // getNextCreepName END
};

global.App.memoryModule = memoryModule;

module.exports = global.App.memoryModule;
