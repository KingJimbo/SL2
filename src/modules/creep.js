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

			let { creepRequisitionModule } = global.App;

			if (!creep.memory.role) {
				//do somehting to reassign creep
				console.log("No creep role found in memory adding to idle pool");
				creepRequisitionModule.addCreepToIdlePool(creep.room, creep);
			}

			if (!creep.memory.type || creep.memory.type === "unknown") {
				creep.memory.type = CREEP_TYPES.UTILITY;
			}

			// if (creep.memory.operationId) {
			// 	let operation = getObject(OBJECT_TYPE.OPERATION, creep.memory.operationId);

			// 	if (operation) {
			// 		if (operation.creepRoles[creep.memory.role]) {
			// 			if (!operation.creepRoles[creep.memory.role].creepData) {
			// 				operation.creepRoles[creep.memory.role].creepData = {};
			// 			}

			// 			if (!operation.creepRoles[creep.memory.role].creepData[creep.name]) {
			// 				operation.creepRoles[creep.memory.role].creepData[creep.name] = { name: creep.name };
			// 			}
			// 		}
			// 	}
			// }

			switch (creep.memory.role) {
				case CREEP_ROLES.IDLE:
					creepModule.runIdleCreep(creep);
					break;
				case CREEP_ROLES.UTILITY:
					creepModule.runUtilityCreep(creep);
					break;
				case CREEP_ROLES.MINER:
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
				case CREEP_ACTIONS.HARVEST:
					creepModule.harvest(creep);
					break;
				case CREEP_ACTIONS.TRANSFER_RESOURCE:
					creepModule.transferResource(creep);
					break;
				case CREEP_ACTIONS.UPGRADE_CONTROLLER:
					creepModule.upgradeController(creep);
					break;
				case CREEP_ACTIONS.REPAIR_STRUCTURE:
					creepModule.repairStructure(creep);
					break;
				case CREEP_ACTIONS.FIND_REQUEST:
					creepModule.findRequest(creep);
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
			const { resourceModule, roomModule } = global.App;

			if (!creep.memory.currentAction) {
				if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
					let harvestObject = resourceModule.assignCreepToNextHarvestRequest(creep);

					if (harvestObject) {
						creep.memory.harvestObjectId = harvestObject.id;
						creep.memory.currentAction = CREEP_ACTIONS.HARVEST;

						if (roomModule.positionHasNearbyThreat(harvestObject.pos)) {
							creep.memory.harvestObjectId = null;
							delete source.room.memory.sources[source.id].currentCreeps[creep.name];
							creepModule.runCreep(creep);
							return;
						}

						return creepModule.carryOutAction(creep);
					}

					const withdrawData = resourceModule.assignCreepToNextWithdrawRequest(creep);

					if (withdrawData) {
						creep.memory.currentAction = CREEP_ACTIONS.WITHDRAW_RESOURCE;
						creep.memory.withdrawId = withdrawData.withdrawStructure.id;
						creep.memory.destinationId = withdrawData.destinationId;

						return creepModule.carryOutAction(creep);
					}
				}

				const transferData = resourceModule.assignCreepToNextTransferRequest(creep);

				if (transferData) {
					creep.memory.currentAction = CREEP_ACTIONS.TRANSFER_RESOURCE;
					creep.memory.resourceType = transferData.resourceType;
					creep.memory.transferStructureId = transferData.structure.id;

					return creepModule.carryOutAction(creep);
				}

				const repairData = resourceModule.assignCreepToNextRepairRequest(creep);

				if (repairData) {
					creep.memory.currentAction = CREEP_ACTIONS.REPAIR_STRUCTURE;
					creep.memory.repairStructureId = repairData.id;

					return creepModule.carryOutAction(creep);
				}

				const buildData = resourceModule.assignCreepToNextBuildRequest(creep);

				if (buildData) {
					creep.memory.currentAction = CREEP_ACTIONS.BUILD_STRUCTURE;
					creep.memory.structureId = buildData.id;

					return creepModule.carryOutAction(creep);
				}

				const pickupData = resourceModule.assignCreepToNextPickupRequest(creep);

				if (pickupData) {
					creep.memory.currentAction = CREEP_ACTIONS.PICKUP_RESOURCE;
					creep.memory.pickupPosition = pickupData.pos;
					creep.memory.resourceType = pickupData.resourceType;

					return creepModule.carryOutAction(creep);
				}

				const controllerId = resourceModule.getUpgradeControllerRequest(creep);

				if (controllerId) {
					creep.memory.currentAction = CREEP_ACTIONS.UPGRADE_CONTROLLER;
					creep.memory.controllerId = controllerId;

					return creepModule.carryOutAction(creep);
				}
			}
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

		harvest: (creep) => {
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
		}, // harvest END

		transferResource: (creep) => {
			let { resourceModule } = global.App;

			let structure = Game.getObjectById(creep.memory.structureId);

			if (!structure) {
				creep.memory.currentAction = null;
				creep.memory.structureId = null;
				creepModule.runCreep(creep);
			}

			if (structure) {
				let transferResult = null;

				if (typeof structure.progress !== "undefined") {
					if (process.env.NODE_ENV === "development") {
						console.log(`hit build`);
					}
					transferResult = creep.build(structure);
				} else {
					if (process.env.NODE_ENV === "development") {
						console.log(`hit transfer`);
					}
					const freeCapacity = structure.store.getFreeCapacity(creep.memory.resourceType);
					const usedCapacity = creep.store.getUsedCapacity(creep.memory.resourceType);

					if (freeCapacity === 0) {
						resourceModule.removeCreepFromResourceRequest(creep, structure, creep.memory.resourceType);
						creep.memory.currentAction = null;
						creep.memory.structureId = null;
						creepModule.runCreep(creep);
						return;
					}

					let capacity = usedCapacity;

					if (freeCapacity < usedCapacity) {
						capacity = freeCapacity;
					}

					transferResult = creep.transfer(structure, creep.memory.resourceType, capacity);
				}

				if (process.env.NODE_ENV === "development") {
					console.log(`transfer result ${transferResult}`);
				}

				switch (transferResult) {
					case ERR_NOT_IN_RANGE:
						creep.moveTo(structure.pos);
						break;
					case ERR_NOT_ENOUGH_RESOURCES:
						resourceModule.removeCreepFromResourceRequest(creep, structure, creep.memory.resourceType);
						creep.memory.currentAction = null;
						creep.memory.structureId = null;
						creepModule.runCreep(creep);
						break;
					case ERR_FULL:
						// resourceModule.removeCreepFromResourceRequest(creep, structure, creep.memory.resourceType);
						// let structure = resourceModule.assignCreepToNextEnergyRequest(creep);
						// creep.memory.structureId = structure.id;
						// creepModule.carryOutAction(creep);
						resourceModule.removeCreepFromResourceRequest(creep, structure, creep.memory.resourceType);
						creep.memory.currentAction = null;
						creep.memory.structureId = null;
						creepModule.runCreep(creep);
						break;
					default:
						if (process.env.NODE_ENV === "development") {
							console.log(`transfer result ${transferResult}`);
						}
						break;
				}
			}
		}, // transferResource END

		repairStructure: (creep) => {
			let { resourceModule } = global.App;

			if (creep.memory.structureId) {
				let destination = Game.getObjectById(creep.memory.structureId);

				if (destination) {
					if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 || destination.hits === destination.hitsMax) {
						creep.memory.currentAction = CREEP_ACTIONS.HARVEST;
						creepModule.runCreep(creep);
						return;
					}

					let transferResult = creep.repair(destination);

					switch (transferResult) {
						case ERR_NOT_IN_RANGE:
							creep.moveTo(destination.pos);
							break;
						case ERR_NOT_ENOUGH_RESOURCES:
							resourceModule.removeCreepFromRepairRequest(destination);
							creep.memory.currentAction = null;
							creep.memory.structureId = null;
							creepModule.runCreep(creep);
							break;
					}
				}
			}
		}, // repairStructure END

		upgradeController: (creep) => {
			if (!creep.memory.structureId) {
				creep.memory.structureId = creep.room.controller.id;
			}

			let destination = Game.getObjectById(creep.memory.structureId);

			if (process.env.NODE_ENV === "development") {
				if (!destination) {
					console.log(`Can't find controller! ${creep.memory.structureId}`);
				}
			}

			if (destination) {
				switch (creep.upgradeController(destination)) {
					case ERR_NOT_IN_RANGE:
						creep.moveTo(destination.pos);
						break;
					case ERR_NOT_ENOUGH_RESOURCES:
						creep.memory.structureId = null;
						creep.memory.currentAction = null;
						creepModule.runCreep(creep);
						break;
				}
			}
		},

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
		},

		findRequest: (creep) => {
			const { resourceModule } = global.App;

			let structure = resourceModule.assignCreepToNextEnergyRequest(creep);
			creep.memory.structureId = structure.id;
			creepModule.runCreep(creep);
		},

		/* CREEP ACTIONS END */
	};

	global.App.creepModule = creepModule;
})();

module.exports = global.App.creepModule;
