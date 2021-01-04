const { CREEP_ROLES, CREEP_TYPES } = require("../common/constants");

(() => {
	const { resourceModule, memoryModule } = global.App;

	var CreepTypes = {};

	let spawnModule = {
		runSpawns: () => {
			for (const roomName in Game.rooms) {
				let room = Game.rooms[roomName];

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
		},

		calculateCreepsToSpawn: (room) => {
			var creepsToSpawn = [];

			const harvestRequests = resourceModule.getAllHarvestRequests(room);

			if (harvestRequests) {
				harvestRequests.forEach((harvestId) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getHarvestCreepToSpawn(room);
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			const transferRequests = resourceModule.getAllTransferRequests(room);

			if (transferRequests) {
				transferRequests.forEach((structureId) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			const repairRequests = resourceModule.getAllRepairRequests(room);

			if (repairRequests) {
				repairRequests.forEach((structureId) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			const buildRequests = resourceModule.getAllBuildRequests(room);

			if (buildRequests) {
				buildRequests.forEach((siteId) => {
					// get harvest creepToSpawn using harvestId & add to array
					const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
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
					creepsToSpawn.push(creepToSpawn);
				});
			}

			if (creepsToSpawn.length > 3) {
				return creepsToSpawn;
			}

			const upgradeControllerRequest = resourceModule.getUpgradeControllerRequest(room);

			if (upgradeControllerRequest) {
				// get upgrade controller creepToSpawn
				const creepToSpawn = spawnModule.getTransferCreepToSpawn(room);
				creepsToSpawn.push(creepToSpawn);
			}

			return creepsToSpawn;
		},

		runSpawn: (spawn) => {
			if (!room.memory.creepsToSpawn && room.memory.creepsToSpawn.length === 0) {
				return;
			}

			//const { resourceModule } = global.App;

			// if (room.memory.creepsToSpawn && room.memory.creepsToSpawn.length > 0) {
			// 	const spawnCapacityFree = spawn.store.getFreeCapacity(RESOURCE_ENERGY);

			// 	if (process.env.NODE_ENV === "development") {
			// 		console.log(`spawnCapacityFree ${JSON.stringify(spawnCapacityFree)}`);
			// 	}
			// 	resourceModule.addTransferRequest(spawn, RESOURCE_ENERGY, spawnCapacityFree);
			// }

			let energyCapacity = spawn.room.energyCapacityAvailable,
				room = spawn.room,
				creepToSpawn = room.memory.creepsToSpawn.shift();

			let essentialWorkerCreeps = room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return ESSENTIAL_CREEP_ROLES.includes(creep.memory.role);
				},
			});

			if (!essentialWorkerCreeps || essentialWorkerCreeps.length === 0) {
				energyCapacity = spawn.room.energyAvailable;
			}

			const creepBodyResponse = spawnModule.getCreepBody(creepToSpawn.type, energyCapacity);

			if (process.env.NODE_ENV === "development") {
				console.log("creep body type result:");
				console.log(JSON.stringify(creepBodyResponse));
				console.log(`spawn.room.energyAvailable ${JSON.stringify(spawn.room.energyAvailable)}`);
			}

			if (creepBodyResponse && creepBodyResponse.cost <= spawn.room.energyAvailable) {
				var spawnCreepResult = spawn.spawnCreep(creepBodyResponse.creepBody, memoryModule.getNextCreepName(), {
					memory: { type: creepToSpawn.type, role: creepToSpawn.role },
				});

				if (process.env.NODE_ENV === "development") {
					console.log(`spawnCreepResult ${JSON.stringify(spawnCreepResult)}`);
				}

				switch (spawnCreepResult) {
					case OK:
						break;
					default:
						console.log(`failed to spawn spawnCreepResult ${spawnCreepResult}`);
						break;
				}
			}
		},

		getCreepBody: (creepType, availableEnergy) => {
			//console.log('Start App.getCreepBody');
			const creepTemplate = CREEP_BODIES[creepType];

			if (process.env.NODE_ENV === "development") {
				console.log(`creep template: ${JSON.stringify(creepTemplate)}`);
			}

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

				if (process.env.NODE_ENV === "development") {
					console.log(`creepTemplateItem: ${JSON.stringify(creepTemplateItem)}`);
				}

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
		},

		getHarvestCreepToSpawn: (room) => {
			// determine what type of harvest creep is best
			let harvestCreepType = CREEP_TYPES.UTILITY,
				harvestCreepRole = CREEP_ROLES.HARVESTER;

			if (room.energyCapacityAvailable > 300) {
				const miners = room.find(FIND_MY_CREEPS, {
					filter: (creep) => {
						return creep.memory.role === CREEP_ROLES.MINER;
					},
				});

				const haulers = room.find(FIND_MY_CREEPS, {
					filter: (creep) => {
						return creep.memory.role === CREEP_ROLES.HAULER;
					},
				});

				if (miners && miners.length > 0 && haulers && haulers.length > 0) {
					harvestCreepType = CREEP_TYPES.MINER;
					harvestCreepRole = CREEP_ROLES.MINER;
				}
			}

			return spawnModule.createCreepToSpawnObject(room.name, harvestCreepType, harvestCreepRole);
		}, // getHarvestCreepToSpawn END

		getTransferCreepToSpawn: (room) => {
			// determine what type of harvest creep is best
			let harvestCreepType = CREEP_TYPES.UTILITY,
				harvestCreepRole = CREEP_ROLES.UTILITY;

			return spawnModule.createCreepToSpawnObject(room.name, harvestCreepType, harvestCreepRole);
		}, // getTransferCreepToSpawn END

		createCreepToSpawnObject: (room, type, role) => {
			return { room, type, role };
		},
	};

	global.App.spawnModule = spawnModule;
})();

module.exports = global.App.spawnModule;
