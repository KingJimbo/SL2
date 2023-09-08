const getCreepBodyTotalCost = require("../creep/body/getCreepBodyTotalCost");

const doesRoomMeetRequirementsForMining = (room) => {
	// current energy level
	const minerCost = getCreepBodyTotalCost(CREEP_TYPE_MINER);

	console.log(`minerCost ${minerCost}`);

	return minerCost <= room.energyCapacityAvailable;
};

module.exports = doesRoomMeetRequirementsForMining;
