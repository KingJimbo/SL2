module.exports = function () {
	if (!Memory.counts.spawnQueueItems) {
		Memory.counts.spawnQueueItems = 0;
	}

	if (!Memory.spawnQueueItems) {
		Memory.spawnQueueItems = {};
	}

	if (!Memory.idleCreeps) {
		Memory.idleCreeps = {};
	}

	this.addCreepToIdlePool = (room, creep) => {
		if (!room || !creep) {
			console.log('addCreepToIdlePool: invalid parameters!');
			return;
		}

		if (!room.memory.idleCreeps) {
			room.memory.idleCreeps = {};
		}

		if (!creep.memory.type) {
			console.log('addCreepToIdlePool: unknown creep type');
			creep.memory.type = CREEP_TYPES.UTILITY;
		}

		if (!room.memory.idleCreeps[creep.memory.type]) {
			room.memory.idleCreeps[creep.memory.type] = [];
		}

		if (!room.memory.idleCreeps[creep.memory.type].includes(creep.name)) {
			//console.log('adding creep to idle pool');
			room.memory.idleCreeps[creep.memory.type].push(creep.name);
			Memory.idleCreeps[creep.name] = creep.name;
			creep.memory.role = 'idle';
		} else {
			Memory.idleCreeps[creep.name] = creep.name;
			//console.log('creep already in idle pool');
		}
	};

	this.requestCreep = (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log('requestCreep: invalid parameters!');
			return false;
		}

		let creep = this.getIdleCreep(room, type, memory);

		if (creep) {
			return creep;
		}

		return this.addCreepToRoomSpawnQueue(room, type, memory);
	};

	this.getIdleCreep = (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log('getIdleCreep: invalid parameters!');
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
	};

	this.addCreepToRoomSpawnQueue = (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log('addCreepToRoomSpawnQueue: Invalid parameters!');
		}

		let spawnQueueItem = {
			id: this.getNextSpawnQueueItemId(),
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
	};

	this.getNextSpawnQueueItemId = () => {
		return `sqi${Memory.counts.spawnQueueItems++}`;
	};
};
