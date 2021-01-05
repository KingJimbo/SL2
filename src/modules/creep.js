const { CREEP_ACTIONS } = require("../common/constants");

(() => {
	let creepModule = {
		runCreeps: () => {
			for (const name in Game.creeps) {
				let creep = Game.creeps[name];
				creepModule.runCreep(creep);
			}

			//clean up creep memory
			for (const name in Memory.creeps) {
				if (!Game.creeps[name]) {
					delete Memory.creeps[name];
				}
			}
		}, // runCreeps END

		runCreep: (creep) => {
			if (!creep) {
				throw new Error(`Invalid Parameters!`);
			}

			if (process.env.NODE_ENV === "development") {
				console.log(`run creep ${creep.name}`);
			}

			if (!creep.memory.type || creep.memory.type === "unknown") {
				creep.memory.type = CREEP_TYPES.UTILITY;
			}

			switch (creep.memory.type) {
				case CREEP_TYPES.UTILITY:
					creepModule.runUtilityCreep(creep);
					break;
				case CREEP_TYPES.MINER:
					creepModule.runMinerCreep(creep);
					break;
			}
		}, // runCreep END

		removeCreepRole: (creep) => {
			if (creep) {
				delete creep.memory.role;
			}
		}, // removeCreepRole END

		getCreepBody: (creepType, availableEnergy) => {
			//console.log('Start App.getCreepBody');
			const creepTemplate = CREEP_BODIES[creepType];
			//console.log(`creep template: ${JSON.stringify(creepTemplate)}`);

			let currentCost = 0,
				creepBodyResponse = {
					creepBody: [],
					bodyCounts: {
						move: 0,
						work: 0,
						carry: 0,
						attack: 0,
						ranged_attack: 0,
						tough: 0,
						heal: 0,
						claim: 0,
						total: 0,
					},
					bodyTotal: 0,
					cost: 0,
				};

			let ratioCost = 0;

			for (const bodyPart in creepTemplate) {
				// use spawn max energy to calculate max creep body possible
				const creepTemplateItem = creepTemplate[bodyPart];

				//console.log(`creepTemplateItem: ${JSON.stringify(creepTemplateItem)}`);

				if (creepTemplateItem.value > 0) {
					let bodyCost = BODYPART_COST[bodyPart];
					// e.g. available energy * 0.3
					//bodyToSpend = availableEnergy * creepTemplateItem.value,
					// Round down to nearest whole no. as you don't get half a body part.
					//bodyNo = Math.floor(bodyToSpend / bodyCost);
					//console.log(`availableEnergy: ${availableEnergy}`);
					//console.log(`bodyPart: ${bodyPart} | bodyCost: ${bodyCost} | bodyToSpend: ${bodyToSpend} | bodyNo:${bodyNo}`);
					// if (bodyNo === 0) {
					// 	// no enough to add body part so return invalid target error
					// 	return ERR_INVALID_TARGET;
					// }

					// if (creepTemplateItem.max && bodyNo > creepTemplateItem.max) {
					// 	bodyNo = creepTemplateItem.max;
					// }

					ratioCost += bodyCost * creepTemplateItem.value;

					// for (let i = 0; i < creepTemplateItem.value; i++) {
					// 	// creepBodyResponse.creepBody.push(bodyPart);
					// 	// creepBodyResponse.bodyCounts[bodyPart]++;
					// 	// creepBodyResponse.bodyTotal++;
					// 	// creepBodyResponse.cost += bodyCost;
					// }
				}
			}

			let ratio = Math.floor(availableEnergy / ratioCost);

			if (ratio === 0) {
				console.log("not enough energy capacity to generate creep template");
				return;
			}

			for (const bodyPart in creepTemplate) {
				const creepTemplateItem = creepTemplate[bodyPart];

				if (creepTemplateItem.value > 0) {
					creepBodyResponse.bodyCounts[bodyPart] += ratio;
					creepBodyResponse.bodyTotal += ratio;

					creepBodyResponse.cost += BODYPART_COST[bodyPart] * ratio;

					for (var i = 0; i < ratio; i++) {
						creepBodyResponse.creepBody.push(bodyPart);
					}
				}
			}

			return creepBodyResponse;
		}, // getCreepBody END

		carryOutAction: (creep) => {
			switch (creep.memory.currentAction) {
				case CREEP_ACTIONS.BUILD:
					creepModule.build(creep);
					break;
				case CREEP_ACTIONS.FIND_REQUEST:
					creepModule.findRequest(creep);
					break;
				case CREEP_ACTIONS.HARVEST:
					creepModule.harvest(creep);
					break;
				case CREEP_ACTIONS.IDLE:
					creepModule.idle(creep);
					break;
				case CREEP_ACTIONS.MINE:
					creepModule.mine(creep);
					break;
				case CREEP_ACTIONS.PICKUP:
					creepModule.pickup(creep);
					break;
				case CREEP_ACTIONS.REPAIR:
					creepModule.repair(creep);
					break;
				case CREEP_ACTIONS.TRANSFER:
					creepModule.transfer(creep);
					break;
				case CREEP_ACTIONS.UPGRADE:
					creepModule.upgrade(creep);
					break;
			}
		},

		/* CREEP ROLES */

		runIdleCreep: (creep) => {
			let { creepRequisitionModule } = global.App;

			if (!creep.memory.structureId && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
				creep.memory.currentAction = CREEP_ACTIONS.FIND_REQUEST;
				creepModule.carryOutAction(creep);
			}

			if (creep.memory.structureId) {
				creepModule.carryOutAction(creep);
				return;
			}

			if (!creepRequisitionModule.isCreepIdle(creep)) {
				//console.log("No creep name found idle creep memory adding to idle pool");
				creepRequisitionModule.addCreepToIdlePool(creep.room, creep);
			}

			creep.moveTo(0, 0);
		}, // runIdleCreep END

		runUtilityCreep: (creep) => {
			const { resourceModule } = global.App;

			if (!creep.memory.currentAction) {
				if (creep.store.getUsedCapacity() > 0) {
					for (const resourceType in Object.keys(creep.store)) {
						const transferData = resourceModule.assignCreepToNextTransferRequest(creep, resourceType);

						if (transferData) {
							creep.memory.currentAction = CREEP_ACTIONS.TRANSFER;
							creep.memory.resourceType = resourceType;
							creep.memory.structureId = transferData.structure.id;

							return creepModule.carryOutAction(creep);
						}

						if (resourceType === RESOURCE_ENERGY) {
							const repairData = resourceModule.assignCreepToNextRepairRequest(creep);

							if (repairData) {
								creep.memory.currentAction = CREEP_ACTIONS.REPAIR;
								creep.memory.structureId = repairData.id;

								return creepModule.carryOutAction(creep);
							}

							const buildData = resourceModule.assignCreepToNextBuildRequest(creep);

							if (buildData) {
								creep.memory.currentAction = CREEP_ACTIONS.BUILD;
								creep.memory.structureId = buildData.id;

								return creepModule.carryOutAction(creep);
							}

							const controllerId = resourceModule.getUpgradeControllerRequest(creep);

							if (controllerId) {
								creep.memory.currentAction = CREEP_ACTIONS.UPGRADE;
								creep.memory.structureId = controllerId;

								return creepModule.carryOutAction(creep);
							}
						}
					}
				}

				const pickupData = resourceModule.assignCreepToNextPickupRequest(creep);

				if (pickupData) {
					creep.memory.currentAction = CREEP_ACTIONS.PICKUP;
					creep.memory.pickupPosition = pickupData.pos;
					creep.memory.resourceType = pickupData.resourceType;

					return creepModule.carryOutAction(creep);
				}

				let harvestObject = resourceModule.assignCreepToNextHarvestRequest(creep);

				if (harvestObject) {
					creep.memory.harvestObjectId = harvestObject.id;
					creep.memory.resourceType = harvestObject.resourceType;
					creep.memory.currentAction = CREEP_ACTIONS.HARVEST;

					return creepModule.carryOutAction(creep);
				}

				const withdrawData = resourceModule.assignCreepToNextWithdrawRequest(creep);

				if (withdrawData) {
					creep.memory.currentAction = CREEP_ACTIONS.WITHDRAW;
					creep.memory.structureId = withdrawData.withdrawStructure.id;
					creep.memory.destinationId = withdrawData.destinationId;

					return creepModule.carryOutAction(creep);
				}

				creep.memory.currentAction = CREEP_ACTIONS.IDLE;
				return creepModule.carryOutAction(creep);
			}

			return creepModule.carryOutAction(creep);
		}, // runUtilityCreep END

		runMinerCreep: (creep) => {
			const { creepRequisitionModule, roomModule } = global.App;

			if (!creep.memory.sourceId) {
				// if (process.env.NODE_ENV === "development") {
				// 	console.log(`finding source ${creep.memory.sourceId}`);
				// }

				const sources = creep.room.find(FIND_SOURCES);

				if (sources) {
					for (const i in sources) {
						const source = sources[i];

						if (source) {
							if (!roomModule.positionHasNearbyThreat(source.pos)) {
								continue;
							}

							if (process.env.NODE_ENV === "development") {
								console.log(`Doesn't have threat`);
							}

							let sourceMemory = roomModule.getSourceMemory(source.id);

							if (!sourceMemory) {
								sourceMemory = {};
							}

							if (process.env.NODE_ENV === "development") {
								console.log(`sourceMemory ${JSON.stringify(sourceMemory)}`);
							}

							if (sourceMemory.minerName && sourceMemory.minerName !== creep.name) {
								let creep = Game.creeps[sourceMemory.minerName];

								if (!creep) {
									delete sourceMemory.minerName;
								}
							}

							if (!sourceMemory.minerName) {
								let nearByContainer = null;

								const containers = room.find(FIND_STRUCTURES, {
									filter: { structureType: STRUCTURE_CONTAINER },
								});

								if (containers) {
									for (const i in containers) {
										const container = containers[i];

										if (container.pos.isNearTo(source)) {
											nearByContainer = container;
											break;
										}
									}
								}

								if (nearByContainer) {
									sourceMemory.minerName = creep.name;
									creep.memory.sourceId = source.id;
									creep.memory.miningPosition = nearByContainer.pos;
									roomModule.updateSourceMemory(source, sourceMemory);
								}
							}
						}
					}
				}

				// no source check for spawns
				if (!creep.memory.sourceId) {
					creepRequisitionModule.addCreepToIdlePool(creep.room, creep);
				}
			}

			// if new
			if (!creep.memory.currentAction) {
				creep.memory.currentAction = CREEP_ACTIONS.MINE_SOURCE;
			}

			creepModule.carryOutAction(creep);
		}, // runMinerCreep END

		/* CREEP ROLES END */

		/* CREEP ACTIONS */
		idle: (creep) => {
			return creep.moveTo(0, 0);
		}, // harvest END

		build: (creep) => {
			const site = Game.getObjectById(creep.memory.structureId);

			if (process.env.NODE_ENV === "development") {
				if (!site) {
					console.log(`Can't find a site with id of ${creep.memory.structureId}`);
				}
			}

			if (
				typeof site.progress === "undefined" ||
				creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 ||
				roomModule.positionHasNearbyThreat(site.pos)
			) {
				resourceModule.removeCreepFromBuildRequest(creep);
				creepModule.clearCreepMemory(creep);
				return creepModule.runCreep(creep);
			}

			const result = creep.harvest(harvestObject);
			switch (result) {
				case OK:
					break;
				case ERR_NOT_IN_RANGE:
					creep.moveTo(harvestObject.pos);
					break;
				default:
					if (process.env.NODE_ENV === "development") {
						console.log(`Unhandled harvest error ${result}`);
					}
					break;
			}

			return result;
		}, // harvest END

		harvest: (creep) => {
			const harvestObject = Game.getObjectById(creep.memory.harvestObjectId);

			if (creep.store.getFreeCapacity(creep.memory.resourceType) === 0 || roomModule.positionHasNearbyThreat(harvestObject.pos)) {
				resourceModule.removeCreepFromHarvestRequest(creep);
				creepModule.clearCreepMemory(creep);
				return creepModule.runCreep(creep);
			}

			const result = creep.harvest(harvestObject);
			switch (result) {
				case OK:
					break;
				case ERR_NOT_IN_RANGE:
					creep.moveTo(harvestObject.pos);
					break;
				case ERR_NOT_ENOUGH_RESOURCES:
				case ERR_TIRED:
					resourceModule.removeCreepFromHarvestRequest(creep);
					creepModule.clearCreepMemory(creep);
					return creepModule.runCreep(creep);
				default:
					if (process.env.NODE_ENV === "development") {
						console.log(`Unhandled harvest error ${result}`);
					}
					break;
			}

			return result;
		}, // harvest END

		pickup: (creep) => {
			const { resourceModule } = global.App,
				position = creep.memory.pickupPosition;

			if (!position || creep.store.getFreeCapacity(creep.memory.resourceType) === 0 || roomModule.positionHasNearbyThreat(position)) {
				resourceModule.removeCreepFromPickupRequest(creep);
				creepModule.clearCreepMemory(creep);
				return creepModule.runCreep(creep);
			}

			const resource = creep.room.find(FIND_DROPPED_RESOURCES, {
				filter: (resource) => {
					return (
						resource.resourceType === creep.memory.resourceType &&
						resource.pos.roomName === position.roomName &&
						resource.pos.x === position.pos.x &&
						resource.pos.y === position.pos.y
					);
				},
			});

			if (!resource) {
				if (process.env.NODE_ENV === "development") {
					console.log(`Can't find resource at ${JSON.stringify(position)}`);
				}

				resourceModule.removeCreepFromPickupRequest(creep);
				creepModule.clearCreepMemory(creep);
				return creepModule.runCreep(creep);
			}

			const result = creep.pickup(harvestObject);
			switch (result) {
				case OK:
					break;
				case ERR_NOT_IN_RANGE:
					creep.moveTo(harvestObject.pos);
					break;
				case ERR_FULL:
					resourceModule.removeCreepFromPickupRequest(creep);
					creepModule.clearCreepMemory(creep);
					return creepModule.runCreep(creep);
				default:
					if (process.env.NODE_ENV === "development") {
						console.log(`Unhandled harvest error ${result}`);
					}
					break;
			}

			return result;
		}, // harvest END

		transfer: (creep) => {
			let { resourceModule } = global.App;

			let structure = Game.getObjectById(creep.memory.structureId);

			if (
				!structure ||
				creep.getUsedCapacity(creep.memory.resourceType) === 0 ||
				structure.store.getFreeCapacity(creep.memory.resourceType) === 0
			) {
				resourceModule.removeCreepFromTransferRequest(creep);
				creepModule.clearCreepMemory(creep);
				return creepModule.runCreep(creep);
			}

			if (structure) {
				let transferResult = creep.transfer(structure);

				const freeCapacity = structure.store.getFreeCapacity(creep.memory.resourceType);
				const usedCapacity = creep.store.getUsedCapacity(creep.memory.resourceType);

				let capacity = usedCapacity;

				if (freeCapacity < usedCapacity) {
					capacity = freeCapacity;
				}

				transferResult = creep.transfer(structure, creep.memory.resourceType, capacity);

				if (process.env.NODE_ENV === "development") {
					console.log(`transfer result ${transferResult}`);
				}

				switch (transferResult) {
					case ERR_NOT_IN_RANGE:
						creep.moveTo(structure.pos);
						break;
					case ERR_NOT_ENOUGH_RESOURCES:
						resourceModule.removeCreepFromTransferRequest(creep);
						creepModule.clearCreepMemory(creep);
						return creepModule.runCreep(creep);
					case ERR_FULL:
						resourceModule.removeCreepFromTransferRequest(creep);
						creepModule.clearCreepMemory(creep);
						return creepModule.runCreep(creep);
					default:
						if (process.env.NODE_ENV === "development") {
							console.log(`transfer result ${transferResult}`);
						}
						break;
				}
			}
		}, // transfer END

		repair: (creep) => {
			let { resourceModule } = global.App;

			if (creep.memory.structureId) {
				let destination = Game.getObjectById(creep.memory.structureId);

				if (!destination || creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 || destination.hits === destination.hitsMax) {
					resourceModule.removeRepairerFromRepairRequest(creep);
					creepModule.clearCreepMemory(creep);
					return creepModule.runCreep(creep);
				}

				let transferResult = creep.repair(destination);

				switch (transferResult) {
					case ERR_NOT_IN_RANGE:
						creep.moveTo(destination.pos);
						break;
					case ERR_NOT_ENOUGH_RESOURCES:
						resourceModule.removeRepairerFromRepairRequest(creep);
						creepModule.clearCreepMemory(creep);
						return creepModule.runCreep(creep);
				}
			}
		}, // repairStructure END

		upgradeController: (creep) => {
			if (!creep.memory.structureId) {
				creep.memory.structureId = creep.room.controller.id;
			}

			let controller = Game.getObjectById(creep.memory.structureId);

			if (process.env.NODE_ENV === "development") {
				if (!controller) {
					console.log(`Can't find controller! ${creep.memory.structureId}`);
				}
			}

			if (!controller || creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
				creepModule.clearCreepMemory(creep);
				return creepModule.runCreep(creep);
			}

			switch (creep.upgradeController(controller)) {
				case ERR_NOT_IN_RANGE:
					creep.moveTo(controller.pos);
					break;
				case ERR_NOT_ENOUGH_RESOURCES:
					creepModule.clearCreepMemory(creep);
					return creepModule.runCreep(creep);
			}
		}, // upgradeController END

		mineSource: (creep) => {
			const source = Game.getObjectById(creep.memory.sourceId);
			const { roomModule } = global.App;

			if (roomModule.positionHasNearbyThreat(source.pos)) {
				let sourceMemory = roomModule.getSourceMemory(creep.memory.sourceId);
				delete sourceMemory.minerName;
				roomModule.updateSourceMemory(source, sourceMemory);
				creep.memory.sourceId = null;
				creepModule.runCreep(creep);
				return;
			}

			if (!creep.memory.miningPosition) {
				const containers = room.find(FIND_STRUCTURES, {
					filter: { structureType: STRUCTURE_CONTAINER },
				});

				if (containers) {
					for (const i in containers) {
						const container = containers[i];

						if (container.pos.isNearTo(source)) {
							creep.memory.miningPosition = container.pos;
						}
					}
				}
			}

			const result = creep.harvest(source);
			switch (result) {
				case OK:
					break;
				case ERR_NOT_IN_RANGE:
					creep.moveTo(creep.memory.miningPosition);
					break;
				default:
					if (process.env.NODE_ENV === "development") {
						console.log(`Unhandled harvest error ${result}`);
					}
					break;
			}
		}, // mineSource END

		findRequest: (creep) => {
			const { resourceModule } = global.App;

			let structure = resourceModule.assignCreepToNextEnergyRequest(creep);
			creep.memory.structureId = structure.id;
			creepModule.runCreep(creep);
		},

		/* CREEP ACTIONS END */

		clearCreepMemory: (creep) => {
			delete creep.memory.currentAction;
			delete creep.memory.harvestObjectId;
			delete creep.memory.pickupPosition;
			delete creep.memory.structureId;
			delete creep.memory.destinationId;
			delete creep.memory.resourceType;
		},
	};

	global.App.creepModule = creepModule;
})();

module.exports = global.App.creepModule;
