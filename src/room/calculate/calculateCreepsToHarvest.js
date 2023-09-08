const getRoomMemory = require("../../memory/getRoomMemory");

const calculateCreepsToHarvest = (room) => {
	const roomMemory = getRoomMemory(room.name);
	const harvestRequests = roomMemory.requests.harvest;
	var creepsToSpawn = [];

	if (harvestRequests) {
		for (const id in harvestRequests) {
			// get harvest creepToSpawn using harvestId & add to array
			const creepToSpawn = spawnModule.getHarvestCreepToSpawn(room, harvestId);
			room.memory.creepsToSpawnTypes.harvest = creepToSpawn;
			creepsToSpawn.push(creepToSpawn);
		}
	}

	return creepsToSpawn;
};

module.exports = calculateCreepsToHarvest;
