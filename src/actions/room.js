const { isANumber, getRoom } = require("../actions/common");
const { getIdleCreep, addCreepToRoomSpawnQueue } = require("./roomCreepRequisition");

module.exports = {
	isRoomStructureInitialised: (structureType, x, y, roomName) => {
		console.log(`isRoomStructureInitialised start`);
		console.log(`structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		if (!roomName || !isANumber(x) || !isANumber(y) || !structureType) {
			throw new Error(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		}
		console.log(`isRoomStructureInitialised isvalid`);

		let room = getRoom(roomName);

		console.log(`room: ${JSON.stringify(room)}`);

		if (!room) {
			throw new Error(`Couldn't find room ${roomName}`);
		}

		if (!room.memory.positionInformation) {
			console.log(`No room positionInformation found`);
			return false;
		}

		const objects = room.lookAt(x, y);
		var foundObject = null;

		if (objects) {
			objects.forEach((object) => {
				if (object.structureType && object.structureType === structureType) {
					foundObject = object;
				}
			});
		}

		return foundObject ? true : false;
	},
	requestCreep: (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log("requestCreep: invalid parameters!");
			return false;
		}

		let creep = getIdleCreep(room, type, memory);

		if (creep) {
			return creep;
		}

		return addCreepToRoomSpawnQueue(room, type, memory);
	},

	hasRoomThreats: (room) => {
		if (!room) {
			throw new Error("Invalid parameters!");
		}

		// reset every time
		room.memory.threats = {
			hasThreats: false,
			threatPositions: [],
			threatLevel: 0,
			creeps: {},
			powerCreeps: {},
		};

		// TODO make more advanced threat detection and response
		// some sort of player segregation
		// global threat level
		// manage global response

		const creepThreatFilter = (creep) => {
			if (!creep) {
				return false;
			}

			// probably need to track creep strength (i.e. threat level)
			const threatValue = creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK);
			const isHostile = threatValue > 0;

			if (isHostile) {
				creep.room.memory.threats.creeps[creep.id] = creep.id;

				creep.room.memory.threats.threatPositions.push(creep.pos);

				creep.room.memory.threats.threatLevel += threatValue;
			}

			return isHostile;
		};

		const hostileCreeps = room.find(FIND_HOSTILE_CREEPS, {
			filter: creepThreatFilter,
		});

		const hostilePowerCreeps = room.find(FIND_POWER_CREEPS, {
			filter: creepThreatFilter,
		});

		if (hostileCreeps || hostilePowerCreeps) {
			room.memory.threats.hasThreats = true;
		}

		return room.memory.threats.hasThreats;
	},

	positionHasNearbyThreat: (pos) => {
		if (!pos || !pos.x || !pos.y || !pos.roomName) {
			throw new Error(`Invalid parameters pos ${JSON.stringify(pos)}`);
		}

		let room = Game.rooms[pos.roomName];

		if (!room) {
			throw new Error(`Can't find room ${pos.roomName}`);
		}

		if (!room.memory.threats.hasThreats) {
			return false;
		}

		var roomPosition = new RoomPosition(pos.x, pos.y, pos.roomName);

		for (const i in room.memory.threats.threatPositions) {
			const threatPos = room.memory.threats.threatPositions;
			const threatPosition = new RoomPosition(pos.x, pos.y, pos.roomName);
			const pathFinderResponse = PathFinder.search(threatPosition, roomPosition);

			if (
				pathFinderResponse &&
				!pathFinderResponse.inComplete &&
				pathFinderResponse.path &&
				pathFinderResponse.path.length < HOSTILE_CREEP_PROXIMITY_DISTANCE
			) {
				return true;
			}
		}

		return false;
	},
};
