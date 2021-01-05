(() => {
	const { getAccessiblePositions, getPosName } = require("../common/position");
	let resourceModule = {
		/*------------ BUILD REQUEST FUNCTIONS --------------*/

		addBuildRequest: (site) => {
			if (!site) {
				throw Error(`Invalid parameters site  ${JSON.stringify(site)}`);
			}

			if (!site.room.memory.requests.build[site.structureType]) {
				site.room.memory.requests.build[site.structureType] = {};
			}

			site.room.memory.requests.build[site.structureType][site.id] = site.id;

			resourceModule.addStructureMemory(site);

			let siteMemory = structure.room.memory.structureMemory[structure.structureType][structure.id].buildRequest;
			//let siteMemory = site.room.memory.constructionSites[site.id];

			if (process.env.NODE_ENV === "development") {
				console.log(`siteMemory ${JSON.stringify(siteMemory)}`);
			}

			let currentProgress = site.progressTotal - site.progress;
			siteMemory.amount = currentProgress;

			siteMemory = resourceModule.calculateBuildPendingAmount(siteMemory);

			site.room.memory.structureMemory[site.structureType][site.id].buildRequest = siteMemory;

			resourceModule.verifyBuildMemory(site);
		}, // addBuildRequest END

		assignedCreepToNextBuildRequest: (creep) => {
			let room = creep.room,
				assignedSite;

			for (const structureType in RESOURCE_ORDER_STRUCTURE_PRIORITY) {
				let sites = room.memory.requests.build[structureType];

				if (sites) {
					for (const siteId in sites) {
						const site = Game.getObjectById(siteId);

						if (site) {
							assignedSite = site;
							break;
						}
					}
				}

				if (assignedSite) {
					break;
				}
			}

			if (assignedSite) {
				resourceModule.addStructureMemory(assignedSite);

				let structureBuildMemory = assignedSite.room.memory.structureMemory[assignedSite.structureType][assignedSite.id].buildRequest;

				structureBuildMemory = resourceModule.calculateBuildPendingAmount(structureBuildMemory);

				assignedSite.room.memory.structureMemory[assignedSite.structureType][assignedSite.id].buildRequest = structureBuildMemory;

				resourceModule.verifyBuildMemory(assignedSite);
			}

			return assignedSite;
		}, // assignedCreepToNextBuildRequest END

		calculateBuildPendingAmount: (siteMemory) => {
			siteMemory.pendingAmount = 0;

			const creepNames = Object.keys(siteMemory.pendingCreepNames);

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete siteMemory.pendingCreepNames[creepName];
						return;
					}

					siteMemory.pendingAmount += creep.store.getUsedCapacity(RESOURCE_ENERGY);
				});
			}

			return siteMemory;
		}, // calculateBuildPendingAmount END

		verifyBuildMemory: (site) => {
			let siteMemory = site.room.memory.structureMemory[site.structureType][site.id].buildRequest;

			// if pending is less than total submit a request to the room
			if (siteMemory.pendingAmount < siteMemory.amount) {
				if (!site.room.memory.requests.build[site.structureType][site.id]) {
					site.room.memory.requests.build[site.structureType][site.id] = site.id;

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Added resource request for structure ${JSON.stringify(site.room.memory.requests.build[site.structureType][site.id])}`
						);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`structure ${JSON.stringify(site.id)}`);
					console.log(
						`Deleting resource request for structure ${JSON.stringify(site.room.memory.requests.build[site.structureType][site.id])}`
					);
				}

				delete site.room.memory.requests.build[site.structureType][site.id];
			}
		}, // verifySourceMemory END

		getAllBuildRequests: (room) => {
			let buildRequests = [];

			for (const structureType in room.memory.requests.build) {
				for (const siteId in room.memory.requests.build[structureType]) {
					buildRequests.push(siteId);
				}
			}

			return buildRequests;
		}, // getAllBuildRequests END

		removeCreepFromBuildRequest: (creep) => {
			const site = Game.getObjectById(creep.memory.structureId);
			resourceModule.addStructureMemory(site);
			let structureBuildMemory = site.room.memory.structureMemory[assignedSite.structureType][assignedSite.id].buildRequest;

			delete structureBuildMemory.pendingCreepNames[creep.name];
			site.room.memory.structureMemory[assignedSite.structureType][assignedSite.id].buildRequest = structureBuildMemory;

			return true;
		}, // removeCreepFromBuildRequest END

		/* BUILD REQUEST FUNCTIONS END */

		/*------------ HARVEST REQUEST FUNCTIONS ------------*/

		addHarvestRequest: (harvestableObject) => {
			if (!harvestableObject) {
				throw Error(`Invalid parameters harvestableObject  ${JSON.stringify(harvestableObject)}`);
			}

			if (!harvestableObject.room.memory.requests.harvest[harvestableObject.id]) {
				harvestableObject.room.memory.requests.harvest[harvestableObject.id] = harvestableObject.id;
			}

			if (!harvestableObject.room.memory.harvestableObjects) {
				harvestableObject.room.memory.harvestableObjects = {};
			}

			if (!harvestableObject.room.memory.harvestableObjects[harvestableObject.id]) {
				let accessiblePositions = getAccessiblePositions(harvestableObject.pos);

				if (accessiblePositions) {
					accessiblePositions = [];
				}

				let resourceType = RESOURCE_ENERGY;

				if (harvestableObject.mineralType) {
					resourceType = harvestableObject.mineralType;
				}

				harvestableObject.room.memory.harvestableObjects[harvestableObject.id] = {
					amount: 0,
					pendingAmount: 0,
					pendingCreepNames: {},
					resourceType,
					accessiblePositions,
				};
			}

			let harvestableObjectMemory = harvestableObject.room.memory.harvestableObjects[harvestableObject.id];

			if (process.env.NODE_ENV === "development") {
				console.log(`sourceMemory ${JSON.stringify(harvestableObjectMemory)}`);
			}

			harvestableObjectMemory.amount = amount;

			harvestableObjectMemory = resourceModule.calculateHarvestPendingAmount(harvestableObjectMemory);
			harvestableObject.room.memory.harvestableObjects[harvestableObject.id] = harvestableObjectMemory;

			resourceModule.verifyHarvestMemory(harvestableObject);

			return true;
		}, // addHarvestRequest END

		assignCreepToNextHarvestRequest: (creep) => {
			let room = creep.room,
				assignedSource = null;

			if (!room.memory.harvestableObjects) {
				room.memory.harvestableObjects = {};
			}

			for (var sourceId in room.memory.requests.harvest) {
				const source = Game.getObjectById(sourceId);

				if (!source) {
					throw Error(`Can't find source belonging to source id ${sourceId}`);
				}

				assignedSource = source;
				break;
			}

			if (assignedSource) {
				let sourceMemory = room.memory.harvestableObjects[assignedSource.id];
				sourceMemory.pendingCreepNames[creep.name];
				sourceMemory = resourceModule.calculateHarvestPendingAmount(sourceMemory);
				room.memory.harvestableObjects[sourceId] = sourceMemory;

				resourceModule.verifySourceMemory(assignedSource);
				return { id: assignedSource.id, resourceType: sourceMemory.resourceType };
			}

			return null;
		}, // assignCreepToNextHarvestRequest END

		calculateHarvestPendingAmount: (harvestableObjectMemory) => {
			harvestableObjectMemory.pendingAmount = 0;

			const creepNames = Object.keys(harvestableObjectMemory.pendingCreepNames);

			if (!creepNames) {
				creepNames = [];
			}

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete sourceMemory.pendingCreepNames[creepName];
						return;
					}

					sourceMemory.pendingAmount += creep.getActiveBodyparts(WORK) * HARVEST_POWER;
				});
			}

			return sourceMemory;
		}, // calculateHarvestPendingAmount END

		verifyHarvestMemory: (harvestableObject) => {
			let room = harvestableObject.room,
				harvestableObjectMemory = room.memory.harvestableObjects[harvestableObject.id];

			const { roomModule } = global.App;

			const creepNames = Object.keys(harvestableObjectMemory.pendingCreepNames);

			// if pending is less than total and source is currently accessible submit a request to the room
			if (
				!roomModule.positionHasNearbyThreat(harvestableObject.pos) &&
				harvestableObjectMemory.pendingAmount < harvestableObjectMemory.amount &&
				creepNames.length < harvestableObjectMemory.accessiblePositions.length
			) {
				if (!harvestableObject.room.memory.requests.harvest[harvestableObject.id]) {
					harvestableObject.room.memory.requests.harvest[harvestableObject.id] = harvestableObject.id;

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Added resource request for source ${JSON.stringify(
								harvestableObject.room.memory.requests.harvest[harvestableObject.id]
							)}`
						);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`source ${JSON.stringify(harvestableObject.id)}`);
					console.log(
						`Deleting resource request for structure ${JSON.stringify(
							harvestableObject.room.memory.requests.harvest[harvestableObject.id]
						)}`
					);
				}

				delete harvestableObject.room.memory.requests.harvest[harvestableObject.id];
			}
		}, // verifySourceMemory END

		getAllHarvestRequests: (room) => {
			const harvestRequests = Object.keys(room.memory.requests.harvest);

			return harvestRequests;
		}, // getAllHarvestRequests END

		removeCreepFromHarvestRequest: (creep) => {
			const harvestableObject = Game.getObjectById(creep.memory.harvestableObjectId);

			delete harvestableObject.room.memory.harvestableObjects[harvestableObject.id].pendingCreepNames[creep.name];

			return true;
		}, // removeCreepFromBuildRequest END

		/* HARVEST REQUEST FUNCTIONS END */

		/*-------------- PICKUP REQUEST FUNCTIONS --------------*/

		addPickupRequest: (pos, resourceType, amount) => {
			let room = Game.rooms[pos.roomName];

			if (!pos || !resourceType || !amount || amount < 1) {
				throw Error(`Invalid parameters pos  ${JSON.stringify(pos)}, resourceType ${resourceType} amount ${JSON.stringify(amount)}`);
			}

			var positionName = getPosName(pos.x, pos.y);

			if (!room.memory.requests.pickup[resourceType]) {
				room.memory.requests.pickup[resourceType] = {};
			}

			room.memory.requests.pickup[resourceType][positionName] = pos;

			resourceModule.createPickupMemory(positionName, resourceType);

			let pickupMemory = room.memory.pickups[positionName][resourceType];

			pickupMemory.amount = amount;

			if (process.env.NODE_ENV === "development") {
				console.log(`pickupMemory ${JSON.stringify(pickupMemory)}`);
			}

			pickupMemory = resourceModule.calculatePickupPendingAmount(pickupMemory);

			room.memory.pickups[positionName][resourceType] = pickupMemory;

			resourceModule.verifyPickupMemory(pickupMemory, resourceType, pos);
		}, // addPickupRequest END

		assignCreepToNextPickupRequest: (creep) => {
			let assignedPosition,
				assignedResourceType,
				assignedPositionName,
				room = creep.room;

			for (const resourceType in room.memory.requests.pickup) {
				for (const positionName in room.memory.requests.pickup[resourceType]) {
					const position = room.memory.requests.pickup[resourceType][positionName];

					if (position) {
						assignedPosition = position;
						assignedResourceType = resourceType;
						assignedPositionName = positionName;
						break;
					}
				}

				if (assignedPosition && assignedResourceType) {
					break;
				}
			}

			if (assignedPosition && assignedResourceType) {
				let pickupMemory = room.memory.pickups[assignedPositionName][resourceType];

				if (pickupMemory) {
					pickupMemory.pendingCreepNames[creep.name] = creep.name;

					pickupMemory = calculatePickupPendingAmount(pickupMemory);

					room.memory.pickups[assignedPositionName][resourceType] = pickupMemory;

					resourceModule.verifyPickupMemory(pickupMemory, assignedResourceType, assignedPosition);

					return { pos: assignedPosition, resourceType: assignedResourceType };
				}
			}

			return null;
		}, // assignCreepToNextPickupRequest END

		calculatePickupPendingAmount: (pickupMemory) => {
			pickupMemory.pendingAmount = 0;

			const creepNames = Object.keys(pickupMemory.pendingCreepNames);

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete pickupMemory.pendingCreepNames[creepName];
						return;
					}

					pickupMemory.pendingAmount += creep.store.getFreeCapacity(resourceType);
				});
			}

			return pickupMemory;
		}, // calculatePickupPendingAmount END

		verifyPickupMemory: (pickupMemory, resourceType, pos) => {
			var positionName = getPosName(pos.x, pos.y);

			// if pending is less than total submit a request to the room
			if (pickupMemory.pendingAmount < pickupMemory.amount) {
				if (!room.memory.requests.pickup[positionName]) {
					room.memory.requests.pickup[positionName] = {};

					if (!room.memory.requests.pickup[resourceType][positionName]) {
						room.memory.requests.pickup[resourceType][positionName] = pos;
					}

					if (process.env.NODE_ENV === "development") {
						console.log(`Added pickup request for position ${JSON.stringify(room.memory.requests.pickup[resourceType][positionName])}`);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`positionName ${JSON.stringify(positionName)}`);
					console.log(`Deleting pickup request for position ${JSON.stringify(room.memory.requests.pickup[resourceType][positionName])}`);
				}

				delete room.memory.requests.pickup[resourceType][positionName];
			}
		}, // verifyPickupMemory END

		getAllPickupRequests: (room) => {
			let pickupRequests = [];
			for (const resourceType in room.memory.requests.pickup) {
				for (const positionName in room.memory.requests.pickup[resourceType]) {
					pickupRequests.push(positionName);
				}
			}

			return pickupRequests;
		}, // getAllPickupRequests END

		createPickupMemory: (positionName, resourceType) => {
			if (!room.memory.pickups) {
				room.memory.pickups = {};
			}

			if (!room.memory.pickups[positionName]) {
				room.memory.pickups[positionName] = {};
			}

			if (!room.memory.pickups[positionName][resourceType]) {
				room.memory.pickups[positionName][resourceType] = {
					amount: 0,
					pendingAmount: 0,
					pendingCreepNames: {},
				};
			}
		},

		removeCreepFromPickupRequest: (creep) => {
			const position = creep.memory.pickupPosition;

			if (!position) {
				if (process.env.NODE_ENV === "development") {
					console.log(`Couldn't find any position in memory`);
				}
				return false;
			}

			const positionName = getPosName(position.x, position.y),
				resourceType = creep.memory.resourceType;

			resourceModule.createPickupMemory(positionName, resourceType);

			let pickupMemory = room.memory.pickups[positionName][resourceType];

			delete pickupMemory.pendingCreepNames[creep.name];

			room.memory.pickups[positionName][resourceType] = pickupMemory;

			return true;
		}, // removeCreepFromTransferRequest END

		/* PICKUP REQUEST FUNCTIONS END */

		/*------------- REPAIR REQUEST FUNCTIONS -----------------*/

		addRepairRequest: (structure) => {
			if (!structure) {
				throw Error(
					`Invalid parameters structure  ${JSON.stringify(structure)}, resourceType ${JSON.stringify(
						resourceType
					)}, amount ${JSON.stringify(amount)}`
				);
			}

			if (!structure.room.memory.requests.repair[structure.structureType]) {
				structure.room.memory.requests.repair[structure.structureType] = {};
			}

			if (!structure.room.memory.requests.repair[structure.structureType][structure.id]) {
				structure.room.memory.requests.repair[structure.structureType][structure.id] = structure.id;
			}

			resourceModule.addStructureMemory(structure);

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];

			if (structure.hits === structure.hitsMax) {
				structureMemory.repairerId = null;
				delete structure.room.memory.requests.repair[structure.structureType][structure.id];
			} else {
				if (structureMemory.repairerId) {
					let repairer = Game.getObjectById[structureMemory.repairerId];

					// if valid remove repair request
					if (repairer) {
						delete structure.room.memory.requests.repair[structure.structureType][structure.id];
					}
				}
			}
		}, // addRepairRequest END

		assignRepairerToNextRequest: (repairer) => {
			let room = repairer.room,
				assignedStructure = null;

			for (const structureType in RESOURCE_ORDER_STRUCTURE_PRIORITY) {
				let structures = room.memory.requests.repair[structureType];
				for (const structureId in structures) {
					const structure = Game.getObjectById(structureId);

					if (structure) {
						resourceModule.verifyRepairMemory(structure);
						let structureMemory = room.memory.structureMemory[structure.structureType][structure.id];

						if (!structureMemory.repairerId) {
							structureMemory.repairerId = repairer.id;
							room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;
							assignedStructure = structure;
							break;
						}
					}
				}

				if (assignedStructure) {
					break;
				}
			}

			if (assignedStructure) {
				delete room.memory.requests.repair[assignedStructure.structureType][assignedStructure.id];
			}

			return assignedStructure;
		}, // assignRepairerToNextRequest END

		verifyRepairMemory: (structure) => {
			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];

			if (structure.hits === structure.hitsMax) {
				delete structureMemory.repairerId;
				room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;
				return;
			}

			if (structureMemory.repairerId) {
				const repairer = Game.getObjectById(structureMemory.repairerId);

				if (repairer) {
					const isTower = !repairer.memory;
					let repairerMemory = null;

					if (isTower) {
						if (!room.memory.structureMemory[STRUCTURE_TOWER][repairer.id]) {
							room.memory.structureMemory[STRUCTURE_TOWER][repairer.id] = {};
						}
						repairerMemory = room.memory.structureMemory[STRUCTURE_TOWER][repairer.id];
					} else {
						repairerMemory = repairer.memory;
					}

					if (repairerMemory.repairStructureId !== structureId) {
						delete structureMemory.repairerId;
						room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;
					}
				}
			}
		}, // verifyRepairMemory END

		getAllRepairRequests: (room) => {
			let repairRequests = [];
			for (const structureType in room.memory.requests.repair) {
				for (const structureId in room.memory.requests.repair[structureType]) {
					repairRequests.push(structureId);
				}
			}

			return repairRequests;
		}, // getAllRepairRequests END

		removeRepairerFromRepairRequest: (repairer) => {
			const isTower = !repairer.memory;
			let repairerMemory = null;

			if (isTower) {
				if (!room.memory.structureMemory[STRUCTURE_TOWER][repairer.id]) {
					room.memory.structureMemory[STRUCTURE_TOWER][repairer.id] = {};
				}
				repairerMemory = room.memory.structureMemory[STRUCTURE_TOWER][repairer.id];
			} else {
				repairerMemory = repairer.memory;
			}

			const structure = Game.getObjectById(repairerMemory.repairStructureId);

			let structureMemory = resourceModule.getStructureMemory(structure);

			delete structureMemory.repairerId;

			resourceModule.saveStructureMemory(structure, structureMemory);

			return true;
		},

		/*----------- REPAIR REQUEST FUNCTIONS END ---------------*/

		/* TRANSFER REQUEST FUNCTIONS */

		addTransferRequest: (structure, resourceType, amount) => {
			if ((!structure, !resourceType)) {
				throw Error(
					`Invalid parameters structure  ${JSON.stringify(structure)}, resourceType ${JSON.stringify(
						resourceType
					)}, amount ${JSON.stringify(amount)}`
				);
			}

			if (!structure.room.memory.requests.transfer[resourceType]) {
				structure.room.memory.requests.transfer[resourceType] = {};
			}

			if (!structure.room.memory.requests.transfer[resourceType][structure.structureType]) {
				structure.room.memory.requests.transfer[resourceType][structure.structureType] = {};
			}

			structure.room.memory.requests.transfer[resourceType][structure.structureType][structure.id] = structure.id;

			resourceModule.addStructureMemory(structure);

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id].transferRequests[resourceType]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id].transferRequests[resourceType] = {
					amount: 0,
					pendingAmount: 0,
					pendingCreepNames: {},
				};
			}

			let structureResourceRequestMemory =
				structure.room.memory.structureMemory[structure.structureType][structure.id].transferRequests[resourceType];

			if (process.env.NODE_ENV === "development") {
				console.log(`structureResourceRequestMemory ${JSON.stringify(structureResourceRequestMemory)}`);
			}

			structureResourceRequestMemory.amount = amount;

			structureResourceRequestMemory = resourceModule.calculateTransferPendingAmount(structureResourceRequestMemory, resourceType);

			structure.room.memory.structureMemory[structure.structureType][structure.id].transferRequests[
				resourceType
			] = structureResourceRequestMemory;

			resourceModule.verifyStructureResourceMemory(structure, resourceType);
		}, // addTransferRequest END

		assignCreepToNextTransferRequest: (creep, resourceType) => {
			let assignedStructure;

			let structures = creep.room.memory.requests.transfer[resourceType];

			for (const structureType in RESOURCE_ORDER_STRUCTURE_PRIORITY) {
				let structureMemories = structures[structureType];

				if (structureMemories) {
					for (const structureId in structureMemories) {
						const structure = Game.getObjectById(structureId);

						if (structure) {
							assignedStructure = structure;
							break;
						}
					}
				}

				if (assignedStructure) {
					break;
				}
			}

			if (assignedStructure) {
				resourceModule.addStructureMemory(assignedStructure);

				let structureResourceMemory =
					assignedStructure.room.memory.structureMemory[assignedStructure.structureType][assignedStructure.id].transferRequests[
						resourceType
					];

				structureResourceMemory = resourceModule.calculateTransferPendingAmount(structureResourceMemory, resourceType);

				assignedStructure.room.memory.structureMemory[assignedStructure.structureType][assignedStructure.id].transferRequests[
					resourceType
				] = structureResourceMemory;
				resourceModule.verifyStructureResourceMemory(assignedStructure, resourceType);

				return assignedStructure;
			}

			return null;
		}, // assignCreepToNextTransferRequest END

		calculateTransferPendingAmount: (structureResourceMemory, resourceType) => {
			structureResourceMemory.pendingAmount = 0;

			const creepNames = Object.keys(structureResourceMemory.pendingCreepNames);

			if (!creepNames) {
				creepNames = [];
			}

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete structureResourceMemory.pendingCreepNames[creepName];
						return;
					}

					structureResourceMemory.pendingAmount += creep.store.getUsedCapacity(resourceType);
				});
			}

			return structureResourceMemory;
		}, // calculateTransferPendingAmount END

		verifyStructureResourceMemory: (structure, resourceType) => {
			let structureResourceMemory = structure.room.memory.structureMemory[structure.structureType][structure.id].transferRequests[resourceType];

			// if pending is less than total submit a request to the room
			if (structureResourceMemory.pendingAmount < structureResourceMemory.amount) {
				if (!structure.room.memory.requests.transfer[resourceType][structure.structureType][structure.id]) {
					structure.room.memory.requests.transfer[resourceType][structure.structureType][structure.id] = structure.id;

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Added resource request for structure ${JSON.stringify(
								structure.room.memory.requests.transfer[resourceType][structure.structureType][structure.id]
							)}`
						);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`structure ${JSON.stringify(structure.id)}`);
					console.log(
						`Deleting resource request for structure ${JSON.stringify(
							structure.room.memory.requests.transfer[resourceType][structure.structureType][structure.id]
						)}`
					);
				}

				delete structure.room.memory.requests.transfer[resourceType][structure.structureType][structure.id];
			}
		}, // verifyStructureResourceMemory END

		getAllTransferRequests: (room) => {
			let transferRequests = [];

			for (const resourceType in room.memory.requests.transfer) {
				for (const structureType in room.memory.requests.transfer[resourceType]) {
					for (const structureId in room.memory.requests.transfer[resourceType][structureType]) {
						transferRequests.push(structureId);
					}
				}
			}

			return transferRequests;
		}, // getAllTransferRequests END

		removeCreepFromTransferRequest: (creep) => {
			const structure = Game.getObjectById(creep.memory.structureId);
			resourceModule.addStructureMemory(structure);
			let structureTransferMemory =
				site.room.memory.structureMemory[assignedSite.structureType][assignedSite.id].transferRequests[creep.memory.resourceType];

			delete structureTransferMemory.pendingCreepNames[creep.name];
			site.room.memory.structureMemory[assignedSite.structureType][assignedSite.id].transferRequests[
				creep.memory.resourceType
			] = structureTransferMemory;

			return true;
		}, // removeCreepFromTransferRequest END

		/*------------- TRANSFER REQUEST FUNCTIONS END ----------*/

		/* UPGRADE CONTROLLER REQUEST FUNCTIONS */

		addUpgradeControllerRequest: (controller) => {
			if (!controller) {
				throw Error(`Invalid parameters structure  ${JSON.stringify(controller)}`);
			}

			if (!controller.room.memory.requests.upgradeController[controller.id]) {
				controller.room.memory.requests.upgradeController[controller.id] = controller.id;
			}

			if (controller.progress === controller.progressTotal) {
				delete controller.room.memory.requests.upgradeController[controller.id];
			}
		}, // addUpgradeControllerRequest END

		getUpgradeControllerRequest: (room) => {
			for (const controllerId in room.memory.requests.upgradeController) {
				return controllerId;
			}

			return null;
		}, // getUpgradeControllerRequest END

		/* UPGRADE CONTROLLER REQUEST FUNCTIONS END */

		/* WITHDRAW REQUEST FUNCTIONS */

		addWithdrawRequest: (structure, resourceType, amount, destination) => {
			if (!structure || !resourceType || !destination) {
				throw Error(
					`Invalid parameters structure  ${JSON.stringify(structure)}, resourceType ${JSON.stringify(
						resourceType
					)}, amount ${JSON.stringify(amount)}, destination ${JSON.stringify(destination)}`
				);
			}

			if (!structure.room.memory.requests.withdraw[resourceType]) {
				structure.room.memory.requests.withdraw[resourceType] = {};
			}

			if (!structure.room.memory.requests.withdraw[resourceType][structure.structureType]) {
				structure.room.memory.requests.withdraw[resourceType][structure.structureType] = {};
			}

			structure.room.memory.requests.withdraw[resourceType][structure.structureType][structure.id] = structure.id;

			resourceModule.addStructureMemory(structure);

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType] = {
					amount: 0,
					pendingAmount: 0,
					pendingCreepNames: {},
					destinationId: null,
				};
			}

			let structureWithdrawRequestMemory =
				structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType];

			if (process.env.NODE_ENV === "development") {
				console.log(`structureWithdrawRequestMemory ${JSON.stringify(structureWithdrawRequestMemory)}`);
			}

			structureWithdrawRequestMemory.amount = amount;
			structureWithdrawRequestMemory.destinationId = destination.id;

			structureWithdrawRequestMemory = roomModule.calculateWithdrawPendingAmount(structureWithdrawRequestMemory, resourceType);

			structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[
				resourceType
			] = structureWithdrawRequestMemory;

			roomModule.verifyWithdrawMemory(structure, resourceType);
		}, // addWithdrawRequest END

		assignCreepToNextWithdrawRequest: (creep) => {
			let room = creep.room,
				assignedStructure,
				assignedResourceType;

			for (const resourceType in room.memory.requests.withdraw) {
				let structures = structure.room.memory.requests.withdraw[resourceType];

				for (const structureType in RESOURCE_ORDER_STRUCTURE_PRIORITY) {
					let structureMemories = structures[structureType];

					for (const structureId in structureMemories) {
						const structure = Game.getObjectById(structureId);

						if (structure) {
							assignedStructure = structure;
							assignedResourceType = resourceType;
							break;
						}
					}

					if (assignedStructure) {
						break;
					}
				}
				if (assignedStructure) {
					break;
				}
			}

			if (assignedStructure && assignedResourceType) {
				resourceModule.addStructureMemory(assignedStructure);

				let structureResourceMemory =
					assignedStructure.room.memory.structureMemory[assignedStructure.structureType][assignedStructure.id].withdrawRequests[
						assignedResourceType
					];

				structureResourceMemory = resourceModule.calculateWithdrawPendingAmount(structureResourceMemory, assignedResourceType);

				assignedStructure.room.memory.structureMemory[assignedStructure.structureType][assignedStructure.id].withdrawRequests[
					assignedResourceType
				] = structureResourceMemory;

				resourceModule.verifyWithdrawMemory(assignedStructure, assignedResourceType);

				return { withdrawStructure: assignedStructure, destinationId: structureResourceMemory.destinationId };
			}

			return assignedStructure;
		}, // assignCreepToNextWithdrawRequest END

		calculateWithdrawPendingAmount: (withdrawMemory, resourceType) => {
			withdrawMemory.pendingAmount = 0;

			const creepNames = Object.keys(withdrawMemory.pendingCreepNames);

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete withdrawMemory.pendingCreepNames[creepName];
						return;
					}

					withdrawMemory.pendingAmount += creep.store.getFreeCapacity(resourceType);
				});
			}

			return withdrawMemory;
		}, // calculateWithdrawPendingAmount END

		verifyWithdrawMemory: (structure, resourceType) => {
			let structureWithdrawRequestMemory =
				structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType];

			// if pending is less than total submit a request to the room
			if (structureWithdrawRequestMemory.pendingAmount < structureWithdrawRequestMemory.amount) {
				if (!structure.room.memory.requests.withdraw[resourceType][structure.structureType][structure.id]) {
					structure.room.memory.requests.withdraw[resourceType][structure.structureType][structure.id] = structure.id;

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Added resource request for structure ${JSON.stringify(
								structure.room.memory.requests.withdraw[resourceType][structure.structureType][structure.id]
							)}`
						);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`structure ${JSON.stringify(structure.id)}`);
					console.log(
						`Deleting resource request for structure ${JSON.stringify(
							structure.room.memory.requests.withdraw[resourceType][structure.structureType][structure.id]
						)}`
					);
				}

				delete structure.room.memory.requests.withdraw[resourceType][structure.structureType][structure.id];
			}
		}, // verifySourceMemory END

		getAllWithdrawRequests: (room) => {
			let withdrawRequests = [];

			for (const resourceType in room.memory.requests.withdraw) {
				for (const structureType in room.memory.requests.withdraw[resourceType]) {
					for (const structureId in room.memory.requests.withdraw[resourceType][structureType]) {
						withdrawRequests.push(structureId);
					}
				}
			}

			return withdrawRequests;
		}, // getAllWithdrawRequests END

		/* WITHDRAW REQUEST FUNCTIONS END */

		addStructureMemory: (structure) => {
			if (!structure.room.memory.structureMemory) {
				structure.room.memory.structureMemory = {};
			}

			if (!structure.room.memory.structureMemory[structure.structureType]) {
				structure.room.memory.structureMemory[structure.structureType] = {};
			}

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id] = {
					withdrawRequests: {},
					transferRequests: {},
					buildRequest: { amount: 0, pendingAmount: 0, pendingCreepNames: {} },
					repairerId: null,
				};
			}
		}, // addStructureMemory END

		getStructureMemory: (structure) => {
			resourceModule.addStructureMemory(structure);

			return structure.room.memory.structureMemory[structure.structureType][structure.id];
		}, //getStructureMemory

		saveStructureMemory: (structure, structureMemory) => {
			resourceModule.addStructureMemory(structure);
			structure.room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;
			return structure.room.memory.structureMemory[structure.structureType][structure.id];
		}, // saveStructureMemory END

		/* ADD REQUESTS END */

		cleanUpRequestMemory: (room) => {
			// TODO

			for (const structureType in room.memory.structureMemory) {
				for (const structureId in room.memory.structureMemory[structureType]) {
					let structure = Game.getObjectById(structureId);
					// clean up build memory
					if (typeof structure.progress === "undefined") {
						delete room.memory.structureMemory[structure.structureType][structure.id].buildRequest;
					}

					// 		dismantle: {},
					//TODO
					// 		drop: {},
					//TODO
					// 		harvest: {},
					// TODO?
					// clean up repair memory
					if (structure.hitsMax === structure.hits) {
						delete room.memory.structureMemory[structure.structureType][structure.id].repairerId;
					}

					// 		reserveController: {},
					// TODO

					// 		signController: {},
					// TODO

					// 		transfer: {},
					// TODO?

					// 		withdraw: {},
					// TODO?
				}
			}

			resourceModule.cleanUpPickupMemory(room);
		}, // cleanUpRequestMemory END

		cleanUpPickupMemory: (room) => {
			for (const positionName in room.memory.pickups) {
				for (const resourceType in room.memory.pickups[positionName]) {
					const position = room.memory.requests.pickup[resourceType][positionName];

					if (!position) {
						delete room.memory.pickups[positionName][resourceType];
					}
				}
			}
		},
	};

	global.App.resourceModule = resourceModule;
})();

module.exports = global.App.resourceModule;
