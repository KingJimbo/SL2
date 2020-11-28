const { createBuildOperation } = require("../actions/operation");

module.exports = function () {
	this.createBuildOperations = (room) => {
		if (!room) {
			console.log(`Invalid parameters! room ${JSON.stringify(room)}`);
		}

		if (!room.memory.structureMap) {
			console.log(`Invalid structureMap! room ${JSON.stringify(room)}`);
		}

		// if (!room.memory.structureMapCurrent) {
		// 	room.memory.structureMapCurrent = { ...room.memory.structureMap };
		// }

		let buildQueue = [];

		RESOURCE_ORDER_STRUCTURE_PRIORITY.forEach((structureType) => {
			if (!room.memory.structureMap[structureType]) {
				console.log(`No room structureMap contains no structureType of ${structureType}`);
				return;
			}

			let availableNoOfStructures = CONTROLLER_STRUCTURES[structureType][room.controller.level];
			//let noOfCurrentStructures = 0;

			let structTypeArray = room.memory.structureMap[structureType].slice(0, availableNoOfStructures);
			//let structTypeArray = [...room.memory.structureMap[structureType]];

			// const currentStructures = room.find(FIND_MY_STRUCTURES, {
			// 	filter: { structureType },
			// });

			// if (currentStructures && currentStructures.length) {
			// 	noOfCurrentStructures = currentStructures.length;
			// }

			//const noOfStructuresToBuild = availableNoOfStructures - noOfCurrentStructures;

			//let index = 0;
			while (structTypeArray && structTypeArray.length) {
				const structurePosition = structTypeArray.shift();

				if (structurePosition) {
					createBuildOperation(structurePosition.structureType, structurePosition.x, structurePosition.y, room.name);
				}
			}
			// 	while (structTypeArray && structTypeArray.length && availableNoOfStructures > 0) {
			// 		const structurePosition = structTypeArray.shift();

			// 		if (structurePosition) {
			// 			let hasStructure = false;
			// 			const structures = room.lookForAt(LOOK_STRUCTURES, room.getPositionAt(structurePosition.x, structurePosition.y));

			// 			if (structures) {
			// 				// determine if current structure is intended structure
			// 				for (var i in structures) {
			// 					var structure = structures[i];

			// 					if (structure.structureType !== STRUCTURE_RAMPART) {
			// 						currentStructure = structure;
			// 						if (structure.structureType === structureType) {
			// 							hasStructure = true;
			// 						}
			// 					}
			// 				}
			// 			}

			// 			if (!hasStructure) {
			// 				buildQueue.push({ structureType, room: room.name, ...structurePosition });
			// 				availableNoOfStructures--;
			// 			}
			// 		}
			// 	}
		});

		// room.memory.buildQueue = buildQueue;

		// return buildQueue;
	};
};
