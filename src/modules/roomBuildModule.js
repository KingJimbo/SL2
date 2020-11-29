const { createBuildOperation } = require("../actions/operation");
const { isRoomStructureInitialised } = require("../actions/room");

module.exports = function () {
	this.createBuildOperations = (room) => {
		if (!room) {
			console.log(`Invalid parameters! room ${JSON.stringify(room)}`);
		}

		if (!room.memory.structureMap) {
			console.log(`Invalid structureMap! room ${JSON.stringify(room)}`);
		}

		RESOURCE_ORDER_STRUCTURE_PRIORITY.forEach((structureType) => {
			if (!room.memory.structureMap[structureType]) {
				console.log(`No room structureMap contains no structureType of ${structureType}`);
				return;
			}

			let availableNoOfStructures = CONTROLLER_STRUCTURES[structureType][room.controller.level];

			let structTypeArray = room.memory.structureMap[structureType].slice(0, availableNoOfStructures);

			while (structTypeArray && structTypeArray.length) {
				const structurePosition = structTypeArray.shift();

				if (structurePosition) {
					if (!isRoomStructureInitialised(structurePosition.structureType, structurePosition.x, structurePosition.y, room.name)) {
						if (!createBuildOperation(structurePosition.structureType, structurePosition.x, structurePosition.y, room.name)) {
							console.log("failed to create build operation!");
						}
					}
				}
			}
		});
	};
};
