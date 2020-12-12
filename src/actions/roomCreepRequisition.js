const { OBJECT_TYPE } = require("../common/constants");

module.exports = {
	getIdleCreep: (room, type, memory) => {
		if (!room || !type) {
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

				if (memory) {
					creep.memory = memory;
				}

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
	addCreepToIdlePool: (room, creep) => {
		if (!room || !creep) {
			console.log("addCreepToIdlePool: invalid parameters!");
			return;
		}

		if (!room.memory.idleCreeps) {
			room.memory.idleCreeps = {};
		}

		if (!creep.memory.type) {
			console.log("addCreepToIdlePool: unknown creep type");
			creep.memory.type = CREEP_TYPES.UTILITY;
		}

		if (!room.memory.idleCreeps[creep.memory.type]) {
			room.memory.idleCreeps[creep.memory.type] = [];
		}

		if (!room.memory.idleCreeps[creep.memory.type].includes(creep.name)) {
			//console.log('adding creep to idle pool');
			room.memory.idleCreeps[creep.memory.type].push(creep.name);
			Memory.idleCreeps[creep.name] = creep.name;
			creep.memory.role = "idle";
		} else {
			Memory.idleCreeps[creep.name] = creep.name;
			//console.log('creep already in idle pool');
		}
	},
	isCreepInIdlePool: (creep) => {},
	addCreepToSpawn: (roomName, type, memory) => {
		if (!roomName || !type || !memory) {
			console.log("addCreepToRoomSpawnQueue: Invalid parameters!");
		}

		let room = Game.rooms[roomName];

		if (!room) {
			console.log(`Could not find room of name ${room}`);
		}

		// already tried or already creep to spawn
		if (room.memory.spawnsCheckedTime && room.memory.spawnsCheckedTime === Game.time) {
			return false;
		}

		let spawns = room.find(STRUCTURE_SPAWN);

		var noSpawnsChecked = 0;
		creepAddedToSpawn = false;
		while (!creepAddedToSpawn && noSpawnsChecked < spawns.length) {
			let spawn = spawns[noSpawnsChecked];
			if (!spawn.memory.creepToSpawn) {
				spawn.memory.creepToSpawn = { type, memory };
				creepAddedToSpawn = true;
			}

			noSpawnsChecked++;
		}

		// add quick time check for early validation to terminate running
		if (noSpawnsChecked == spawns.length) {
			room.memory.spawnsCheckedTime = Game.time;
		}

		return creepAddedToSpawn;
	},
};
