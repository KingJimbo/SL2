(() => {
	const { getAccessiblePositions } = require("../common/position");
	let resourceModule = {
		/* BUILD REQUEST FUNCTIONS */

		addBuildRequest: (site) => {
			if (!site) {
				throw Error(`Invalid parameters site  ${JSON.stringify(site)}`);
			}

			resourceModule.addStructureMemory(site);

			let siteMemory = structure.room.memory.structureMemory[structure.structureType][structure.id].buildRequest;
			//let siteMemory = site.room.memory.constructionSites[site.id];

			if (process.env.NODE_ENV === "development") {
				console.log(`siteMemory ${JSON.stringify(siteMemory)}`);
			}

			let currentProgress = site.progressTotal - site.progress;
			siteMemory.amount = currentProgress;

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

					siteMemory.pendingAmount += creep.store.getUsedCapacity(resourceType);
				});
			}

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

			structure.room.memory.structureMemory[structure.structureType][structure.id].buildRequest = siteMemory;
		}, // addBuildRequest END

		/* BUILD REQUEST FUNCTIONS END */

		/* HARVEST REQUEST FUNCTIONS */

		addHarvestRequest: (source) => {
			if (!source) {
				throw Error(`Invalid parameters site  ${JSON.stringify(site)}, amount ${JSON.stringify(amount)}`);
			}

			const { roomModule } = global.App;

			if (!source.room.memory.sources) {
				source.room.memory.sources = {};
			}

			if (!source.room.memory.sources[source.id]) {
				if (roomModule.positionHasNearbyThreat(source.pos)) {
					delete source.room.memory.sources[source.id];
				} else {
					let accessiblePositions = getAccessiblePositions(source.pos);

					if (accessiblePositions) {
						accessiblePositions = [];
					}

					source.room.memory.sources[source.id] = {
						amount: 0,
						pendingAmount: 0,
						pendingCreepNames: {},
						accessiblePositions,
					};
				}
			}

			let sourceMemory = source.room.memory.sources[source.id];

			if (process.env.NODE_ENV === "development") {
				console.log(`sourceMemory ${JSON.stringify(sourceMemory)}`);
			}

			if (amount !== sourceMemory.amount) {
				sourceMemory.amount = amount;
			}

			sourceMemory = resourceModule.calculateHarvestPendingAmount(sourceMemory);
			source.room.memory.sources[source.id] = sourceMemory;

			resourceModule.verifySourceMemory(source);

			return true;
		}, // addHarvestRequest END

		assignCreepToNextHarvestRequest: (creep) => {
			let room = creep.room;
			assignedSource = null;

			if (!room.memory.sources) {
				room.memory.sources = {};
			}

			for (var sourceId in room.memory.requests.harvest) {
				const source = Game.getObjectById(sourceId);

				if (!source) {
					throw Error(`Can't find source belonging to source id ${sourceId}`);
				}

				let sourceMemory = room.memory.sources[sourceId];
				sourceMemory.pendingCreepNames[creep.name];

				sourceMemory = resourceModule.calculateHarvestPendingAmount(sourceMemory);

				assignedSource = source;
				break;
			}

			if (assignedSource) {
				assignedSource.room.memory.sources[source.id] = sourceMemory;
				resourceModule.verifySourceMemory(assignedSource);
			}

			return assignedSource;
		}, // assignCreepToNextHarvestRequest END

		calculateHarvestPendingAmount: (sourceMemory) => {
			sourceMemory.pendingAmount = 0;

			const creepNames = Object.keys(sourceMemory.pendingCreepNames);

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

		verifySourceMemory: (source) => {
			let room = source.room,
				sourceMemory = room.memory.sources[source.id];

			const creepNames = Object.keys(sourceMemory.pendingCreepNames);

			// if pending is less than total and source is currently accessible submit a request to the room
			if (sourceMemory.pendingAmount < sourceMemory.amount && creepNames.length < sourceMemory.accessiblePositions.length) {
				if (!source.room.memory.requests.harvest[source.id]) {
					source.room.memory.requests.harvest[source.id] = source.id;

					if (process.env.NODE_ENV === "development") {
						console.log(`Added resource request for source ${JSON.stringify(source.room.memory.requests.harvest[source.id])}`);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`source ${JSON.stringify(source.id)}`);
					console.log(`Deleting resource request for structure ${JSON.stringify(source.room.memory.requests.harvest[source.id])}`);
				}

				delete source.room.memory.requests.harvest[source.id];
			}
		}, // verifySourceMemory END

		/* HARVEST REQUEST FUNCTIONS END */

		/* PICKUP REQUEST FUNCTIONS */

		addPickupRequest: (pos, resourceType, amount) => {
			const { getPosName } = require("../common/position");
			let room = Game.rooms[pos.roomName];

			if (!pos || !resourceType || !amount || amount < 1) {
				throw Error(`Invalid parameters pos  ${JSON.stringify(pos)}, resourceType ${resourceType} amount ${JSON.stringify(amount)}`);
			}

			if (!room.memory.pickups) {
				room.memory.pickups = {};
			}

			var positionName = getPosName(pos.x, pos.y);

			if (!room.memory.requests.pickup[positionName]) {
				room.memory.requests.pickup[positionName] = {
					pos,
				};
			}

			if (!room.memory.requests.pickup[positionName][resourceType]) {
				room.memory.requests.pickup[positionName][resourceType] = {
					amount: 0,
					pendingAmount: 0,
					pendingCreepNames: {},
				};
			}

			let pickupMemory = room.memory.requests.pickup[positionName][resourceType];

			if (process.env.NODE_ENV === "development") {
				console.log(`pickupMemory ${JSON.stringify(pickupMemory)}`);
			}

			if (amount !== pickupMemory.amount) {
				pickupMemory.amount = amount;
			}

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

					pickupMemory.pendingAmount += creep.store.getUsedCapacity(resourceType);
				});
			}

			// if pending is less than total submit a request to the room
			if (pickupMemory.pendingAmount < pickupMemory.amount) {
				if (!room.memory.requests.pickup[positionName]) {
					room.memory.requests.pickup[positionName] = {};

					if (!room.memory.requests.pickup[positionName][resourceType]) {
						room.memory.requests.pickup[positionName][resourceType] = pos;
					}

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Added resource request for structure ${JSON.stringify(room.memory.requests.pickup[positionName][resourceType])}`
						);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`positionName ${JSON.stringify(positionName)}`);
					console.log(`Deleting resource request for position ${JSON.stringify(room.memory.requests.pickup[positionName][resourceType])}`);
				}

				delete room.memory.requests.pickup[positionName][resourceType];
			}

			room.memory.requests.pickup[positionName][resourceType] = pickupMemory;
		}, // addPickupRequest END

		/* PICKUP REQUEST FUNCTIONS END */

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

			if (amount !== structureResourceRequestMemory.amount) {
				structureResourceRequestMemory.amount = amount;
			}

			structureResourceRequestMemory.pendingAmount = 0;

			const creepNames = Object.keys(structureResourceRequestMemory.pendingCreepNames);

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete structureResourceRequestMemory.pendingCreepNames[creepName];
						return;
					}

					structureResourceRequestMemory.pendingAmount += creep.store.getUsedCapacity(resourceType);
				});
			}

			// if pending is less than total submit a request to the room
			if (structureResourceRequestMemory.pendingAmount < structureResourceRequestMemory.amount) {
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

			structure.room.memory.structureMemory[structure.structureType][structure.id].transferRequests[
				resourceType
			] = structureResourceRequestMemory;
		}, // addTransferRequest END

		addUpgradeControllerRequest: (controller) => {
			if (!controller) {
				throw Error(`Invalid parameters structure  ${JSON.stringify(controller)}`);
			}

			if (!structure.room.memory.requests.upgradeController[controller.id]) {
				structure.room.memory.requests.upgradeController[controller.id] = controller.id;
			}

			if (controller.progress === controller.progressTotal) {
				delete structure.room.memory.requests.upgradeController[controller.id];
			}
		}, // addUpgradeControllerRequest END

		addWithdrawRequest: (structure, resourceType, amount) => {
			if ((!structure, !resourceType)) {
				throw Error(
					`Invalid parameters structure  ${JSON.stringify(structure)}, resourceType ${JSON.stringify(
						resourceType
					)}, amount ${JSON.stringify(amount)}`
				);
			}

			if (!structure.room.memory.requests.withdraw[resourceType]) {
				structure.room.memory.requests.withdraw[resourceType] = {};
			}

			if (!structure.room.memory.requests.withdraw[resourceType][structure.structureType]) {
				structure.room.memory.requests.withdraw[resourceType][structure.structureType] = {};
			}

			resourceModule.addStructureMemory(structure);

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType] = {
					amount: 0,
					pendingAmount: 0,
					pendingCreepNames: {},
				};
			}

			let structureResourceRequestMemory =
				structure.room.memory.structureMemory[structure.structureType][structure.id].withdrawRequests[resourceType];

			if (process.env.NODE_ENV === "development") {
				console.log(`structureResourceRequestMemory ${JSON.stringify(structureResourceRequestMemory)}`);
			}

			if (amount !== structureResourceRequestMemory.amount) {
				structureResourceRequestMemory.amount = amount;
			}

			structureResourceRequestMemory.pendingAmount = 0;

			const creepNames = Object.keys(structureResourceRequestMemory.pendingCreepNames);

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete structureResourceRequestMemory.pendingCreepNames[creepName];
						return;
					}

					structureResourceRequestMemory.pendingAmount += creep.store.getUsedCapacity(resourceType);
				});
			}

			// if pending is less than total submit a request to the room
			if (structureResourceRequestMemory.pendingAmount < structureResourceRequestMemory.amount) {
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

			structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[
				resourceType
			] = structureResourceRequestMemory;
		}, // addWithdrawRequest END

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
					repairerId,
				};
			}
		}, // addStructureMemory END

		/* ADD REQUESTS END */

		getNextResourceRequestStructure: (room, resourceType) => {
			if (!room.memory.resourceRequests) {
				room.memory.resourceRequests = {};
			}

			if (!room.memory.resourceRequests[resourceType]) {
				room.memory.resourceRequests[resourceType] = {};
			}

			var strucIndex = 0;

			let structure = null;

			while (!structure && strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length) {
				const structureType = RESOURCE_ORDER_STRUCTURE_PRIORITY[strucIndex];

				if (!room.memory.resourceRequests[resourceType][structureType]) {
					room.memory.resourceRequests[resourceType][structureType] = {};
				}

				const structureIds = Object.keys(room.memory.resourceRequests[resourceType][structureType]);

				for (const i in structureIds) {
					const structureId = structureIds[i];
					structure = Game.getObjectById(structureId);

					if (!structure) {
						throw new Error(`Couldn't find structure beloning to structure id ${structureId}`);
					}

					return structure;
				}

				strucIndex++;
			}
		}, // getNextResourceRequestStructure END

		getNextRepairRequestStructure: (room) => {
			// intialise repair requests memory
			if (!room.memory.repairRequests) {
				room.memory.repairRequests = {};
			}

			var strucIndex = 0;

			let structure = null;

			while (!structure && strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length) {
				const structureType = RESOURCE_ORDER_STRUCTURE_PRIORITY[strucIndex];

				if (!room.memory.repairRequests[structureType]) {
					room.memory.repairRequests[structureType] = {};
				}

				const structureIds = Object.keys(room.memory.repairRequests[structureType]);

				for (const structureId in structureIds) {
					structure = Game.getObjectById(structureId);

					if (!structure) {
						throw new Error(`Couldn't find structure beloning to structure id ${structureId}`);
					}

					return structure;
				}

				strucIndex++;
			}
		}, // getNextResourceRequestStructure END

		assignCreepToResourceRequest: (creep, structure, resourceType) => {
			resourceModule.initialiseResourceRequestMemory(structure.room, resourceType, structure.structureType);

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];
			if (structureMemory) {
				let structureResourceRequestMemory = structureMemory.resourceRequests[resourceType];

				// if pending amount is already greater than amount required return false
				if (structureResourceRequestMemory.pendingAmount >= structureResourceRequestMemory.amount) {
					if (process.env.NODE_ENV === "development") {
						console.log(`structure ${JSON.stringify(structure.id)}`);
						console.log(
							`Deleting resource request for structure ${JSON.stringify(
								structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]
							)}`
						);
					}

					delete structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id];

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Pending amount is greater than required amount! Shouldn't have been in request queue! ${JSON.stringify(
								resourceType
							)} ${JSON.stringify(structure)}`
						);
					}

					return false;
				}

				structureResourceRequestMemory.pendingCreepNames[creep.name] = creep.name;

				let creepNames = Object.keys(structureResourceRequestMemory.pendingCreepNames);

				if (creepNames && creepNames.length > 0) {
					creepNames.forEach((creepName) => {
						let creep = Game.creeps[creepName];

						if (creep && creep.memory.structureId && creep.memory.structureId === structure.id) {
							let usedCapacity = creep.store.getUsedCapacity(resourceType);

							if (usedCapacity) {
								structureResourceRequestMemory.pendingAmount += usedCapacity;
								return;
							}
						}

						// if not valid or carrying any resource delete from pending
						delete structureResourceRequestMemory.pendingCreepNames[creepName];
					});
				}

				// pending amount is equal or greater than required delete request
				if (structureResourceRequestMemory.pendingAmount >= structureResourceRequestMemory.amount) {
					if (process.env.NODE_ENV === "development") {
						console.log(`structure ${JSON.stringify(structure.id)}`);

						console.log(
							`Deleting resource request for structure ${JSON.stringify(
								structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]
							)}`
						);
					}

					delete structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id];
				}

				structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[
					resourceType
				] = structureResourceRequestMemory;

				return true;
			}
		}, // assignCreepToResourceRequest END

		removeCreepFromResourceRequest: (creep, structure, resourceType) => {
			resourceModule.initialiseResourceRequestMemory(structure.room, resourceType, structure.structureType);

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];
			if (structureMemory) {
				let structureResourceRequestMemory = structureMemory.resourceRequests[resourceType];

				delete structureResourceRequestMemory.pendingCreepNames[creep.name];
				structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[
					resourceType
				] = structureResourceRequestMemory;
			}
		}, // removeCreepFromResourceRequest END

		assignCreepToRepairRequest: (creep, structure) => {
			// intialise repair requests memory

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];

			if (!structureMemory) {
				throw Error(`Couldn't find structure memory for ${JSON.stringify(structure)}`);
			}

			structureMemory.repairCreepName = creep.name;

			structure.room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;

			// delete repair request
			delete structure.room.memory.repairRequests[structure.structureType][structure.id];

			return true;
		}, // assignCreepToRepairRequest END

		removeCreepFromRepairRequest: (structure) => {
			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];
			if (structureMemory) {
				delete structureMemory.repairCreepName;
			}
			structure.room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;
		}, // removeCreepFromRepairRequest END

		assignCreepToNextEnergyRequest: (creep) => {
			let room = creep.room,
				structure = resourceModule.getNextResourceRequestStructure(room, RESOURCE_ENERGY);

			if (structure) {
				if (resourceModule.assignCreepToResourceRequest(creep, structure, RESOURCE_ENERGY)) {
					creep.memory.currentAction = CREEP_ACTIONS.TRANSFER_RESOURCE;
					creep.memory.resourceType = RESOURCE_ENERGY;
				}
			} else {
				structure = resourceModule.getNextRepairRequestStructure(room);

				if (structure) {
					if (resourceModule.assignCreepToRepairRequest(creep, structure)) {
						creep.memory.currentAction = CREEP_ACTIONS.REPAIR_STRUCTURE;
					}
				}
			}

			if (!structure) {
				structure = room.controller;
				creep.memory.currentAction = CREEP_ACTIONS.UPGRADE_CONTROLLER;
			}

			return structure;
		}, // assignCreepToNextEnergyRequest END

		initialiseResourceRequestMemory: (room, resourceType, structureType) => {
			if (!room.memory.resourceRequests) {
				room.memory.resourceRequests = {};
			}

			if (!room.memory.resourceRequests[resourceType]) {
				room.memory.resourceRequests[resourceType] = {};
			}

			if (!room.memory.resourceRequests[resourceType][structureType]) {
				room.memory.resourceRequests[resourceType][structureType] = {};
			}

			if (!room.memory.structureMemory) {
				room.memory.structureMemory = {};
			}

			if (!room.memory.structureMemory[structureType]) {
				room.memory.structureMemory[structureType] = {};
			}
		}, // initialiseResourceRequestMemory END

		cleanUpRequestMemory: (room) => {
			// TODO
			// build: {},
			// 		claimController: {},
			// 		dismantle: {},
			// 		drop: {},
			// 		harvest: {},
			// 		pickup: {},
			// 		repair: {},
			// 		reserveController: {},
			// 		signController: {},
			// 		transfer: {},
			// 		upgradeController: {},
			// 		withdraw: {},
		},
	};

	global.App.resourceModule = resourceModule;
})();

module.exports = global.App.resourceModule;
