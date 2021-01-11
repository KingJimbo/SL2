const { CREEP_TYPES } = require("../common/constants");

(() => {
	const { resourceModule, memoryModule } = global.App;

	let spawnModule = {
		runSpawns: () => {
			for (const roomName in Game.rooms) {
				let room = Game.rooms[roomName];

				if (room.controller.my) {
					room.memory.creepsToSpawn = spawnModule.calculateCreepsToSpawn(room);

					let spawns = room.find(FIND_MY_STRUCTURES, {
						filter: { structureType: STRUCTURE_SPAWN },
					});

					if (spawns) {
						spawns.forEach((spawn) => {
							spawnModule.runSpawn(spawn);
						});
					}
				}
			}
		}, // runSpawns END

		calculateCreepsToSpawn: (room) => {
			const { roomModule } = global.App;
			room.memory.creepsToSpawnTypes = {};

			var creepsToSpawn = [],
				minerCount = 0,
				resourceCount = 0;

			if (room.controller.level > 1 && room.energyCapacityAvailable >= 550) {
				const miners = room.find(FIND_MY_CREEPS, {
					filter: (creep) => {
						return creep.memory.type === CREEP_TYPES.MINER;
					},
				});

				if (miners) {
					minerCount += miners.length;
				}

				let sources = room.find(FIND_SOURCES);

				if (sources) {
					sources = sources.filter((source) => {
						var hasContainer = false;
						var objects = room.lookAtSurroundingArea(source.pos.x, source.pos.y, true);

						if (objects) {
							objects = objects.forEach((object) => {
								if (object.type === "structure" && object.structure && object.structure.structureType === STRUCTURE_CONTAINER) {
									hasContainer = true;
								}
							});
						}

						return hasContainer;
					});

					if (sources) {
						resourceCount += sources.length;
					}
				}

				const essentialCreeps = room.find(FIND_MY_CREEPS, {
					filter: (creep) => {
						return ESSENTIAL_MINER_TYPES.includes(creep.memory.type);
					},
				});

				if (process.env.NODE_ENV === "development") {
					global.logger.log(
						`minerCount: ${minerCount},
                    resourceCount: ${resourceCount},
                    essentialCreeps: ${JSON.stringify(essentialCreeps)}`,
						LOG_GROUPS.SPAWN
					);
				}

				if (minerCount < resourceCount && essentialCreeps && essentialCreeps.length > 0) {
					for (var i = 0; i < resourceCount - minerCount; i++) {
						const creepToSpawn = spawnModule.getMinerCreepToSpawn(room);
						room.memory.creepsToSpawnTypes.miner = creepToSpawn;
						creepsToSpawn.push(creepToSpawn);
					}
				}
			}

			const harvestRequests = resourceModule.getAllHarvestRequests(room);

			if (harvestRequests) {
				harvestRequests.forEach((harvestId) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getHarvestCreepToSpawn(room, harvestId);
					room.memory.creepsToSpawnTypes.harvest = creepToSpawn;
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			const pickupRequests = resourceModule.getAllPickupRequests(room);

			if (pickupRequests) {
				pickupRequests.forEach((pos) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
					room.memory.creepsToSpawnTypes.pickup = creepToSpawn;
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			const withdrawRequests = resourceModule.getAllWithdrawRequests(room);

			if (withdrawRequests) {
				withdrawRequests.forEach((structureId) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
					room.memory.creepsToSpawnTypes.withdraw = creepToSpawn;
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			// if (room.controller.level > 3) {
			// 	const transferRequests = resourceModule.getAllTransferRequests(room);

			// 	if (transferRequests) {
			// 		transferRequests.forEach((structureId) => {
			// 			// get harvest creepToSpawn using harvestId & add to array
			// 			const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
			// 			room.memory.creepsToSpawnTypes.transfer = creepToSpawn;
			// 			creepsToSpawn.push(creepToSpawn);
			// 		});
			// 	}

			// 	if (creepsToSpawn.length > 3) {
			// 		return creepsToSpawn;
			// 	}

			// 	const repairRequests = resourceModule.getAllRepairRequests(room);

			// 	if (repairRequests) {
			// 		repairRequests.forEach((structureId) => {
			// 			// get harvest creepToSpawn using harvestId & add to array
			// 			const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
			// 			room.memory.creepsToSpawnTypes.repair = creepToSpawn;
			// 			creepsToSpawn.push(creepToSpawn);
			// 		});
			// 	}

			// 	if (creepsToSpawn.length > 3) {
			// 		return creepsToSpawn;
			// 	}

			// 	const buildRequests = resourceModule.getAllBuildRequests(room);

			// 	if (buildRequests) {
			// 		buildRequests.forEach((siteId) => {
			// 			// get harvest creepToSpawn using harvestId & add to array
			// 			const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
			// 			room.memory.creepsToSpawnTypes.build = creepToSpawn;
			// 			creepsToSpawn.push(creepToSpawn);
			// 		});
			// 	}

			// 	if (creepsToSpawn.length > 3) {
			// 		return creepsToSpawn;
			// 	}

			// 	const upgradeControllerRequest = resourceModule.getUpgradeControllerRequest(room);

			// 	if (upgradeControllerRequest) {
			// 		// get upgrade controller creepToSpawn
			// 		const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
			// 		room.memory.creepsToSpawnTypes.upgrade = creepToSpawn;
			// 		creepsToSpawn.push(creepToSpawn);
			// 	}
			// }

			const localScoutRequests = roomModule.getLocalScoutRequests(room);

			if (localScoutRequests && localScoutRequests.length > 0) {
				localScoutRequests.forEach((direction) => {
					const creepToSpawn = spawnModule.getScoutCreepToSpawn(room, direction);
					room.memory.creepsToSpawnTypes.scout = creepToSpawn;
					creepsToSpawn.push(creepToSpawn);
				});
			}

			return creepsToSpawn;
		}, // calculateCreepsToSpawn END

		runSpawn: (spawn) => {
			if (!spawn.room.memory.creepsToSpawn && spawn.room.memory.creepsToSpawn.length === 0) {
				return;
			}

			//const { resourceModule } = global.App;

			// if (room.memory.creepsToSpawn && room.memory.creepsToSpawn.length > 0) {
			// 	const spawnCapacityFree = spawn.store.getFreeCapacity(RESOURCE_ENERGY);

			// 	if (process.env.NODE_ENV === "development" ) {
			// 		global.logger.log(`spawnCapacityFree ${JSON.stringify(spawnCapacityFree)}`);
			// 	}
			// 	resourceModule.addTransferRequest(spawn, RESOURCE_ENERGY, spawnCapacityFree);
			// }

			let energyCapacity = spawn.room.energyCapacityAvailable,
				room = spawn.room,
				creepToSpawn = room.memory.creepsToSpawn.shift();
			const { resourceModule } = global.App;

			if (!creepToSpawn) {
				return;
			}

			let essentialWorkerCreeps = room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return ESSENTIAL_HARVEST_TYPES.includes(creep.memory.type);
				},
			});

			let essentialMinerCreeps = room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return ESSENTIAL_MINER_TYPES.includes(creep.memory.type);
				},
			});

			if (!essentialWorkerCreeps || essentialWorkerCreeps.length === 0 || !essentialMinerCreeps || essentialMinerCreeps.length === 0) {
				energyCapacity = spawn.room.energyAvailable;
			}

			const creepBodyResponse = spawnModule.getCreepBody(creepToSpawn.type, energyCapacity);

			if (process.env.NODE_ENV === "development") {
				global.logger.log("creep body type result:", LOG_GROUPS.SPAWN);
				global.logger.log(JSON.stringify(creepBodyResponse), LOG_GROUPS.SPAWN);
				global.logger.log(`spawn.room.energyAvailable ${JSON.stringify(spawn.room.energyAvailable)}`, LOG_GROUPS.SPAWN);
			}

			if (creepBodyResponse && creepBodyResponse.cost <= spawn.room.energyAvailable) {
				const memory = { type: creepToSpawn.type, spawnRoom: spawn.room.name, ...creepToSpawn.memory };

				if (process.env.NODE_ENV === "development") {
					global.logger.log(`creep memory to spawn ${JSON.stringify(memory)}`, LOG_GROUPS.SPAWN);
				}

				var spawnCreepResult = spawn.spawnCreep(creepBodyResponse.creepBody, memoryModule.getNextCreepName(), {
					memory,
				});

				// if (process.env.NODE_ENV === "development") {
				// 	global.logger.log(`spawnCreepResult ${JSON.stringify(spawnCreepResult)}`);
				// }

				switch (spawnCreepResult) {
					case OK:
						break;
					default:
						if (process.env.NODE_ENV === "development") {
							global.logger.log(`failed to spawn spawnCreepResult ${spawnCreepResult}`);
						}

						break;
				}
			}
		}, // runSpawn END

		getCreepBody: (creepType, availableEnergy) => {
			//global.logger.log('Start App.getCreepBody');
			const creepTemplate = CREEP_BODIES[creepType];

			// if (process.env.NODE_ENV === "development") {
			// 	global.logger.log(`creep template: ${JSON.stringify(creepTemplate)}`);
			// }

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

				// if (process.env.NODE_ENV === "development") {
				// 	global.logger.log(`creepTemplateItem: ${JSON.stringify(creepTemplateItem)}`);
				// }

				if (creepTemplateItem.value > 0) {
					let bodyCost = BODYPART_COST[bodyPart];
					// e.g. available energy * 0.3
					//bodyToSpend = availableEnergy * creepTemplateItem.value,
					// Round down to nearest whole no. as you don't get half a body part.
					//bodyNo = Math.floor(bodyToSpend / bodyCost);
					//global.logger.log(`availableEnergy: ${availableEnergy}`);
					//global.logger.log(`bodyPart: ${bodyPart} | bodyCost: ${bodyCost} | bodyToSpend: ${bodyToSpend} | bodyNo:${bodyNo}`);
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
				if (process.env.NODE_ENV === "development") {
					global.logger.log("not enough energy capacity to generate creep template", LOG_GROUPS.SPAWN);
				}

				return;
			}

			// limit creep to max ratio
			if (creepTemplate.maxRatio && ratio > creepTemplate.maxRatio) {
				ratio = creepTemplate.maxRatio;
			}

			for (const bodyPart in creepTemplate) {
				const creepTemplateItem = creepTemplate[bodyPart];

				if (creepTemplateItem.value > 0) {
					const bodyCount = ratio * creepTemplateItem.value;

					creepBodyResponse.bodyCounts[bodyPart] += bodyCount;
					creepBodyResponse.bodyTotal += bodyCount;

					creepBodyResponse.cost += BODYPART_COST[bodyPart] * bodyCount;

					for (var i = 0; i < bodyCount; i++) {
						creepBodyResponse.creepBody.push(bodyPart);
					}
				}
			}

			return creepBodyResponse;
		}, // getCreepBody END

		getHarvestCreepToSpawn: (room, harvestId) => {
			// determine what type of harvest creep is best
			let harvestCreepType = CREEP_TYPES.UTILITY;

			return spawnModule.createCreepToSpawnObject(room.name, harvestCreepType);
		}, // getHarvestCreepToSpawn END

		getTransferCreepToSpawn: (room) => {
			// determine what type of harvest creep is best
			let harvestCreepType = CREEP_TYPES.UTILITY;

			return spawnModule.createCreepToSpawnObject(room.name, harvestCreepType);
		}, // getTransferCreepToSpawn END

		getMinerCreepToSpawn: (room) => {
			// determine what type of harvest creep is best
			let harvestCreepType = CREEP_TYPES.MINER;

			return spawnModule.createCreepToSpawnObject(room.name, harvestCreepType);
		}, // getTransferCreepToSpawn END

		getScoutCreepToSpawn: (room, direction, roomName) => {
			// determine what type of harvest creep is best
			let creepType = CREEP_TYPES.SCOUT;

			if (roomName) {
				return spawnModule.createCreepToSpawnObject(room.name, creepType, { roomName }); // { ...creepToSpawn, roomName };
			} else if (direction) {
				return spawnModule.createCreepToSpawnObject(room.name, creepType, { direction }); //{ ...creepToSpawn, direction };
			}
		}, // getTransferCreepToSpawn END

		createCreepToSpawnObject: (room, type, memory) => {
			if (!memory) {
				memory = {};
			}

			return { room, type, memory };
		}, // createCreepToSpawnObject END
	};

	global.App.spawnModule = spawnModule;
})();

module.exports = global.App.spawnModule;
