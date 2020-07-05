module.exports = function () {
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
			room.memory.idleCreeps[creep.memory.type].push(creep.name);
			creep.memory.role = 'idle';
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

		this.addCreepToRoomSpawnQueue(room, type, memory);
		return 1;
	};

	this.getIdleCreep = (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log('getIdleCreep: invalid parameters!');
			return false;
		}

		if (!room.memory.idleCreeps) {
			room.memory.idleCreeps = {};
		}

		let idleCreeps = room.memory.idleCreeps[type]
			? room.memory.idleCreeps[type]
			: room.memory.idleCreeps['unknown']
			? room.memory.idleCreeps['unknown']
			: false;

		if (!idleCreeps) {
			return false;
		}

		let idleIndex = 0,
			idleLength = idleCreeps.length;

		while (idleIndex < idleLength) {
			let idleCreep = idleCreeps.shift();

			let creep = Game.creeps[idleCreep];
			if (creep) {
				creep.memory = memory;

				return creep;
			}

			idleIndex++;
		}

		return false;
	};

	this.addCreepToRoomSpawnQueue = (room, type, memory) => {
		if (!room.memory.spawnQueue) {
			room.memory.spawnQueue = [];
		}

		room.memory.spawnQueue.push({
			bodyType: type,
			memory,
		});

		return true;
	};
};
