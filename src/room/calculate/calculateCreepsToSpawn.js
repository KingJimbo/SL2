const getRoomMemory = require("../../memory/getRoomMemory");

const calculateCreepsToSpawn = (room) => {
	let roomMemory = getRoomMemory(room.name);

	roomMemory.creepsToSpawnTypes = {};

	var creepsToSpawn = [],
		minerCount = 0,
		resourceCount = 0;

	// if (room.controller.level > 1 && room.energyCapacityAvailable >= 550) {
	// 	const miners = room.find(FIND_MY_CREEPS, {
	// 		filter: (creep) => {
	// 			return creep.memory.type === CREEP_TYPES.MINER;
	// 		},
	// 	});

	// 	if (miners) {
	// 		minerCount += miners.length;
	// 	}

	// 	let sources = room.find(FIND_SOURCES);

	// 	if (sources) {
	// 		sources = sources.filter((source) => {
	// 			var hasContainer = false;
	// 			var objects = room.lookAtSurroundingArea(source.pos.x, source.pos.y, true);

	// 			if (objects) {
	// 				objects = objects.forEach((object) => {
	// 					if (object.type === "structure" && object.structure && object.structure.structureType === STRUCTURE_CONTAINER) {
	// 						hasContainer = true;
	// 					}
	// 				});
	// 			}

	// 			return hasContainer;
	// 		});

	// 		if (sources) {
	// 			resourceCount += sources.length;
	// 		}
	// 	}

	// 	const essentialCreeps = room.find(FIND_MY_CREEPS, {
	// 		filter: (creep) => {
	// 			return ESSENTIAL_MINER_TYPES.includes(creep.memory.type);
	// 		},
	// 	});

	// 	if (process.env.NODE_ENV === "development") {
	// 		global.logger.log(
	// 			`minerCount: ${minerCount},
	//                 resourceCount: ${resourceCount},
	//                 essentialCreeps: ${JSON.stringify(essentialCreeps)}`,
	// 			LOG_GROUPS.SPAWN
	// 		);
	// 	}

	// 	if (minerCount < resourceCount && essentialCreeps && essentialCreeps.length > 0) {
	// 		for (var i = 0; i < resourceCount - minerCount; i++) {
	// 			const creepToSpawn = spawnModule.getMinerCreepToSpawn(room);
	// 			room.memory.creepsToSpawnTypes.miner = creepToSpawn;
	// 			creepsToSpawn.push(creepToSpawn);
	// 		}
	// 	}
	// }

	// const harvestRequests = resourceModule.getAllHarvestRequests(room);

	// if (harvestRequests) {
	// 	harvestRequests.forEach((harvestId) => {
	// 		// get harvest creepToSpawn using harvestId & add to array
	// 		const creepToSpawn = spawnModule.getHarvestCreepToSpawn(room, harvestId);
	// 		room.memory.creepsToSpawnTypes.harvest = creepToSpawn;
	// 		creepsToSpawn.push(creepToSpawn);
	// 	});
	// }

	// if (creepsToSpawn.length > 3) {
	// 	return creepsToSpawn;
	// }

	// const pickupRequests = resourceModule.getAllPickupRequests(room);

	// if (pickupRequests) {
	// 	pickupRequests.forEach((pos) => {
	// 		// get harvest creepToSpawn using harvestId & add to array
	// 		const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
	// 		room.memory.creepsToSpawnTypes.pickup = creepToSpawn;
	// 		creepsToSpawn.push(creepToSpawn);
	// 	});
	// }

	// if (creepsToSpawn.length > 3) {
	// 	return creepsToSpawn;
	// }

	// const withdrawRequests = resourceModule.getAllWithdrawRequests(room);

	// if (withdrawRequests) {
	// 	withdrawRequests.forEach((structureId) => {
	// 		// get harvest creepToSpawn using harvestId & add to array
	// 		const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
	// 		room.memory.creepsToSpawnTypes.withdraw = creepToSpawn;
	// 		creepsToSpawn.push(creepToSpawn);
	// 	});
	// }

	// if (creepsToSpawn.length > 3) {
	// 	return creepsToSpawn;
	// }

	// if (room.controller.level > 3) {
	// 	const transferRequests = resourceModule.getAllTransferRequests(room);

	// 	if (transferRequests) {
	// 		transferRequests.forEach((structureId) => {
	// 			// get harvest creepToSpawn using harvestId & add to array
	// 			const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
	// 			room.memory.creepsToSpawnTypes.transfer = creepToSpawn;
	// 			creepsToSpawn.push(creepToSpawn);
	// 		});
	// 	}

	// 	if (creepsToSpawn.length > 3) {
	// 		return creepsToSpawn;
	// 	}

	// 	const repairRequests = resourceModule.getAllRepairRequests(room);

	// 	if (repairRequests) {
	// 		repairRequests.forEach((structureId) => {
	// 			// get harvest creepToSpawn using harvestId & add to array
	// 			const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
	// 			room.memory.creepsToSpawnTypes.repair = creepToSpawn;
	// 			creepsToSpawn.push(creepToSpawn);
	// 		});
	// 	}

	// 	if (creepsToSpawn.length > 3) {
	// 		return creepsToSpawn;
	// 	}

	// 	const buildRequests = resourceModule.getAllBuildRequests(room);

	// 	if (buildRequests) {
	// 		buildRequests.forEach((siteId) => {
	// 			// get harvest creepToSpawn using harvestId & add to array
	// 			const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
	// 			room.memory.creepsToSpawnTypes.build = creepToSpawn;
	// 			creepsToSpawn.push(creepToSpawn);
	// 		});
	// 	}

	// 	if (creepsToSpawn.length > 3) {
	// 		return creepsToSpawn;
	// 	}

	// 	const upgradeControllerRequest = resourceModule.getUpgradeControllerRequest(room);

	// 	if (upgradeControllerRequest) {
	// 		// get upgrade controller creepToSpawn
	// 		const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
	// 		room.memory.creepsToSpawnTypes.upgrade = creepToSpawn;
	// 		creepsToSpawn.push(creepToSpawn);
	// 	}
	// }

	// const localScoutRequests = roomModule.getLocalScoutRequests(room);

	// if (localScoutRequests && localScoutRequests.length > 0) {
	// 	localScoutRequests.forEach((direction) => {
	// 		const creepToSpawn = spawnModule.getScoutCreepToSpawn(room, direction);
	// 		room.memory.creepsToSpawnTypes.scout = creepToSpawn;
	// 		creepsToSpawn.push(creepToSpawn);
	// 	});
	// }

	return creepsToSpawn;
};

module.exports = calculateCreepsToSpawn;
