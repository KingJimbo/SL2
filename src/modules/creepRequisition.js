(() => {
	let creepRequisitionModule = {
		getIdleCreep: (room, type, memory) => {
			if (!room || !type) {
				global.logger.log("getIdleCreep: invalid parameters!");
				return false;
			}

			if (process.env.NODE_ENV === "development") {
				global.logger.log(`get idle creep of type ${type}`);
			}

			let idleRoom = null;

			var roomType = typeof room;

			if (roomType === "string") {
				idleRoom = Game.rooms[room];
			} else if (roomType == "object") {
				idleRoom = room;
			}

			if (!idleRoom.memory.idleCreeps) {
				idleRoom.memory.idleCreeps = {};
				return false;
			}

			let idleCreeps = idleRoom.memory.idleCreeps[type];

			if (!idleCreeps) {
				if (process.env.NODE_ENV === "development") {
					global.logger.log(
						`can not find idleCreeps type in room memory. type ${type} roomMemory: ${JSON.stringify(idleRoom.memory.idleCreeps)}`
					);
				}

				return false;
			}

			let idleIndex = 0,
				idleLength = idleCreeps.length;

			while (idleIndex < idleLength) {
				let idleCreep = idleCreeps.shift();

				let creep = Game.creeps[idleCreep];
				if (creep) {
					//global.logger.log(`idle creep found. creep: ${creep.name} type:${type}`);

					if (memory) {
						creep.memory = memory;
					}

					idleRoom.memory.idleCreeps[type] = idleCreeps;

					if (Memory.idleCreeps[creep.name]) {
						delete Memory.idleCreeps[creep.name];
					}

					return creep;
				}

				idleIndex++;
			}
			idleRoom.memory.idleCreeps[type] = idleCreeps;

			//global.logger.log(`no idle creep found in idleCreep Queue of type: ${type}`);

			return false;
		},
		addCreepToIdlePool: (room, creep) => {
			if (!Memory.idleCreeps) {
				Memory.idleCreeps = {};
			}

			if (!room || !creep) {
				global.logger.log("addCreepToIdlePool: invalid parameters!");
				return;
			}

			if (!room.memory.idleCreeps) {
				room.memory.idleCreeps = {};
			}

			if (!creep.memory.type) {
				global.logger.log("addCreepToIdlePool: unknown creep type");
				creep.memory.type = CREEP_TYPES.UTILITY;
			}

			creep.memory.operationId = null;

			if (!room.memory.idleCreeps[creep.memory.type]) {
				room.memory.idleCreeps[creep.memory.type] = [];
			}

			if (!room.memory.idleCreeps[creep.memory.type].includes(creep.name)) {
				//global.logger.log('adding creep to idle pool');
				room.memory.idleCreeps[creep.memory.type].push(creep.name);
				Memory.idleCreeps[creep.name] = creep.name;
				creep.memory.role = "idle";
			} else {
				Memory.idleCreeps[creep.name] = creep.name;
				//global.logger.log('creep already in idle pool');
			}
		},
		isCreepIdle: (creep) => {
			if (Memory.idleCreeps[creep.name]) {
				return true;
			}
			return false;
		},
		addCreepToSpawn: (roomName, type, memory) => {
			if (!roomName || !type || !memory) {
				global.logger.log("addCreepToRoomSpawnQueue: Invalid parameters!");
			}

			let room = Game.rooms[roomName];

			if (!room) {
				global.logger.log(`Could not find room of name ${room}`);
			}

			// already tried or already creep to spawn
			if (room.memory.spawnsCheckedTime && room.memory.spawnsCheckedTime === Game.time) {
				if (process.env.NODE_ENV === "development") {
					global.logger.log(`checked spawns already time ${Game.time}`);
				}

				return false;
			}

			let spawns = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_SPAWN },
			});

			if (process.env.NODE_ENV === "development") {
				global.logger.log(`spawns ${JSON.stringify(spawns)}`);
			}

			var noSpawnsChecked = 0;
			let creepAddedToSpawn = false;
			while (!creepAddedToSpawn && noSpawnsChecked < spawns.length) {
				let spawn = spawns[noSpawnsChecked];

				if (!spawn.memory.creepToSpawn) {
					if (process.env.NODE_ENV === "development") {
						global.logger.log(`adding memory to spawn ${JSON.stringify(memory)}`);
					}

					memory.type = type;
					spawn.memory.creepToSpawn = { memory };
					creepAddedToSpawn = true;
				}

				if (process.env.NODE_ENV === "development") {
					global.logger.log(`checking spawn ${JSON.stringify(spawn)}`);
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

	global.App.creepRequisitionModule = creepRequisitionModule;
})();

module.exports = global.App.creepRequisitionModule;
