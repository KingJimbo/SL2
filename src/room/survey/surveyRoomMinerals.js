const surveyRoomMinerals = (room) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`surveyRoomMinerals ${room.name} TODO`);
	}
	// if (room.controller.level > 3) {
	// 	const storages = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });
	// 	if (storages && storages.length > 0) {
	// 		const minerals = room.find(FIND_MINERALS);
	// 		if (minerals) {
	// 			minerals.forEach((mineral) => {
	// 				resourceModule.addHarvestRequest(mineral, mineral.mineralAmount);
	// 			});
	// 		}
	// 	}
	// }
};

module.exports = surveyRoomMinerals;
