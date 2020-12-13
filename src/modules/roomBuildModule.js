const { createBuildOperation } = require("../actions/operation");
const { isRoomStructureInitialised } = require("../actions/room");

module.exports = function () {
	// this.managedConstructionSites = (room) => {
	// 	// find construction sites
	// 	let constructionSites = room.find(LOOK_CONSTRUCTION_SITES);

	// 	if (!constructionSites) {
	// 		return;
	// 	}

	// 	constructionSites.forEach((site) => {
	// 		if (!this.resource.getStructureResourceOrderId(site, RESOURCE_ENERGY)) {
	// 			this.resource.createResourceOrder(room, site.id, RESOURCE_ENERGY, site.progressTotal - site.progress, true);
	// 		}
	// 	});
	// };

	this.createBuildOperations = (room) => {
		console.log("createBuildOperations start");
		if (!room) {
			console.log(`Invalid parameters! room ${JSON.stringify(room)}`);
		}

		if (!room.memory.structureMap) {
			console.log(`Invalid structureMap! room ${JSON.stringify(room)}`);
		}

		RESOURCE_ORDER_STRUCTURE_PRIORITY.forEach((structureType) => {
			console.log(`structureType: ${structureType}`);
			if (!room.memory.structureMap[structureType]) {
				console.log(`No room structureMap contains no structureType of ${structureType}`);
				return;
			}

			let availableNoOfStructures = CONTROLLER_STRUCTURES[structureType][room.controller.level];
			console.log(`availableNoOfStructures: ${availableNoOfStructures}`);

			const structures = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType },
			});

			console.log(`structures found ${JSON.stringify(structures)}`);

			if (structures) {
				availableNoOfStructures -= structures.length;
			}

			if (availableNoOfStructures < 1) {
				return;
			}

			let structTypeArray = room.memory.structureMap[structureType].slice(0, availableNoOfStructures);
			console.log(`structTypeArray: ${JSON.stringify(structTypeArray)}`);

			while (structTypeArray && structTypeArray.length) {
				const structurePosition = structTypeArray.shift();

				console.log(`structurePosition: ${JSON.stringify(structurePosition)}`);

				if (structurePosition) {
					if (!isRoomStructureInitialised(structureType, structurePosition.x, structurePosition.y, room.name)) {
						console.log(`isRoomStructureInitialised false`);
						if (!createBuildOperation(structureType, structurePosition.x, structurePosition.y, room.name)) {
							console.log("failed to create build operation!");
						}
					}
				}
			}
		});
	};
};
