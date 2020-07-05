module.exports = () => {
	this.addCreepToColonySpawnQueue = (colonyId, memory, body, priority = PRIORITY_LOW) => {
		if (!colonyId || !memory || !body) {
			return { success: false, message: 'Invalid Parameters.' };
		}

		let colony = _Modules.memory.getById(OBJECT_TYPE_COLONY, colonyId);

		if (!colony) {
			return { success: false, message: `Could not find colony for colonId ${colonyId}.` };
		}

		if (!colony.spawnQueue[priority]) {
			logger.log(`spawnQueue.addCreepToColonySpawnQueue: initialising queue colonyId:${colonyId} | priority: ${priority}`);

			colony.spawnQueue[priority] = [];
		}

		colony.spawnQueue[priority].push({ memory, body });
	};

	this.getNextCreepFromSpawnQueue = (colonyId) => {
		if (colony) {
			// get spawn queues
			// high
			let highQueue = colony.spawnQueue[PRIORITY_HIGH];
			if (highQueue) {
				return highQueue.shift();
			}

			// medium
			let medQueue = colony.spawnQueue[PRIORITY_MEDIUM];
			if (medQueue) {
				return medQueue.shift();
			}

			// low
			let lowQueue = colony.spawnQueue[PRIORITY_LOW];
			if (lowQueue) {
				return lowQueue.shift();
			}
		} else {
			logger.warning('Invalid parameter Colony:');
			logger.log(JSON.stringify(colony));
		}
	};
};
