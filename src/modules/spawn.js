(() => {
	const { resourceModule, memoryModule } = global.App;
	let spawnModule = {
		runRoomSpawns: (room) => {
			let spawns = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_SPAWN },
			});

			if (spawns) {
				spawns.forEach((spawn) => {
					spawnModule.runSpawn(spawn);
				});
			}
		},

		runSpawn: (spawn) => {
			if (!spawn.memory.creepToSpawn) {
				return;
			}

			const { resourceModule } = global.App;

			if (spawn.memory.creepToSpawn) {
				const spawnCapacityFree = spawn.store.getFreeCapacity(RESOURCE_ENERGY);

				if (process.env.NODE_ENV === "development") {
					console.log(`spawnCapacityFree ${JSON.stringify(spawnCapacityFree)}`);
				}
				resourceModule.addStructureResourceRequest(spawn, RESOURCE_ENERGY, spawnCapacityFree);
			}

			let energyCapacity = spawn.room.energyCapacityAvailable,
				room = spawn.room;

			let essentialWorkerCreeps = room.find(FIND_MY_CREEPS, {
				filter: (creep) => {
					return ESSENTIAL_CREEP_ROLES.includes(creep.memory.role);
				},
			});

			if (!essentialWorkerCreeps || essentialWorkerCreeps.length === 0) {
				energyCapacity = spawn.room.energyAvailable;
			}

			const creepBodyResponse = spawnModule.getCreepBody(spawn.memory.creepToSpawn.memory.type, energyCapacity);

			if (process.env.NODE_ENV === "development") {
				console.log("creep body type result:");
				console.log(JSON.stringify(creepBodyResponse));
				console.log(`spawn.room.energyAvailable ${JSON.stringify(spawn.room.energyAvailable)}`);
			}

			if (creepBodyResponse && creepBodyResponse.cost <= spawn.room.energyAvailable) {
				var spawnCreepResult = spawn.spawnCreep(creepBodyResponse.creepBody, memoryModule.getNextCreepName(), {
					memory: spawn.memory.creepToSpawn.memory,
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

			// clear memory
			spawn.memory.creepToSpawn = null;
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
	};

	global.App.spawnModule = spawnModule;
})();

module.exports = global.App.spawnModule;
