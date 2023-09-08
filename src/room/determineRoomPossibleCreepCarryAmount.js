const determineRoomPossibleCreepCarryAmount = (room) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`determineRoomPossibleCreepCarryAmount ${room.name} TODO`);
	}

	// const creepBodyResponse = spawnModule.getCreepBody(CREEP_TYPES.UTILITY, room.energyCapacityAvailable);
	// room.memory.possiblyUtilityCarryAmount = 0;

	// if (creepBodyResponse && creepBodyResponse.creepBody) {
	// 	const carryParts = creepBodyResponse.creepBody.filter((bodyPart) => {
	// 		return bodyPart === CARRY;
	// 	});

	// 	room.memory.possiblyUtilityCarryAmount = carryParts ? carryParts.length * CARRY_CAPACITY : 0;
	// }
};

module.exports = determineRoomPossibleCreepCarryAmount;
