module.exports = {
	getIdleCreep: (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log("getIdleCreep: invalid parameters!");
			return false;
		}

		if (!room.memory.idleCreeps) {
			room.memory.idleCreeps = {};
			return false;
		}

		let idleCreeps = room.memory.idleCreeps[type];

		if (!idleCreeps) {
			console.log(`can not find idleCreeps type in room memory. type ${type} roomMemory: ${JSON.stringify(room.memory.idleCreeps)}`);
			return false;
		}

		let idleIndex = 0,
			idleLength = idleCreeps.length;

		while (idleIndex < idleLength) {
			let idleCreep = idleCreeps.shift();

			let creep = Game.creeps[idleCreep];
			if (creep) {
				console.log(`idle creep found. creep: ${creep.name} type:${type}`);
				creep.memory = memory;
				room.memory.idleCreeps[type] = idleCreeps;

				if (Memory.idleCreeps[creep.name]) {
					delete Memory.idleCreeps[creep.name];
				}

				return creep;
			}

			idleIndex++;
		}
		room.memory.idleCreeps[type] = idleCreeps;

		console.log(`no idle creep found in idleCreep Queue of type: ${type}`);

		return false;
	},
	addCreepToRoomSpawnQueue: (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log("addCreepToRoomSpawnQueue: Invalid parameters!");
		}

		let spawnQueueItem = {
			id: `sqi${Memory.counts.spawnQueueItems++}`,
			roomName: room.name,
			type,
			memory,
			spawnId: null,
		};

		// reference for the creep
		spawnQueueItem.memory.spawnQueueItemId = spawnQueueItem.id;

		Memory.spawnQueueItems[spawnQueueItem.id] = spawnQueueItem;

		if (!room.memory.spawnQueue) {
			room.memory.spawnQueue = [];
		}

		room.memory.spawnQueue.push(spawnQueueItem.id);

		return spawnQueueItem;
	},
};
