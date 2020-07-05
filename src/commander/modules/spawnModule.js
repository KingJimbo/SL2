// spawn-manager.js

module.exports = function () {
	this.spawnCreeps = function () {
		// cycle all colony spawners and spawn creeps
		let colonies = this.memoryManager.getAll(OBJECT_TYPE_COLONY);

		for (const colonyId in colonies) {
			let colony = colonies[colonyId];

			for (const spawnId in colony.structureMap.spawn) {
				let spawn = this.game.getObjectById(spawnId);

				this.spawnCreep(spawn);
			}
		}
	};

	this.getCreepBody = (creepType, availableEnergy) => {
		const creepTemplate = CREEP_TEMPLATES[creepType];
		let bodyCostTotal = 0,
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
		for (const bodyPart in creepTemplate) {
			// use spawn max energy to calculate max creep body possible
			const creepTemplateItem = creepTemplate[bodyPart];
			if (creepTemplateItem > 0) {
				let bodyCost = BODYPART_COST[bodyPart],
					// e.g. available energy * 0.3
					bodyToSpend = availableEnergy * creepTemplateItem,
					// Round down to nearest whole no. as you don't get half a body part.
					bodyNo = Math.floor(bodyToSpend / bodyCost);
				if (bodyNo === 0) {
					// no enough to add body part so return invalid target error
					return ERR_INVALID_TARGET;
				}

				for (let i = 0; i < bodyNo; i++) {
					creepBodyResponse.creepBody.push(bodyPart);
					creepBodyResponse.bodyCounts[bodyPart]++;
					creepBodyResponse.bodyTotal++;
					creepBodyResponse.cost += bodyCost;
				}
			}
		}

		return creepBodyResponse;
	};

	this.spawnCreep = function (spawn) {
		// check spawn for creep template
		if (spawn && spawn.memory && spawn.memory.creepToSpawn && spawn.memory.creepToSpawn.type && spawn.memory.creepToSpawn.memory) {
			if (!spawn.memory.creepToSpawn.body) {
				// calculate creep body
				const creepTemplate = CREEP_TEMPLATES[spawn.memory.creepToSpawn.type];
				let creepBody = [],
					bodyCostTotal = 0;
				for (const bodyPart in creepTemplate) {
					// use spawn max energy to calculate max creep body possible
					const creepTemplateItem = creepTemplate[bodyPart];
					if (creepTemplateItem.value > 0) {
						let bodyCost = BODYPART_COST[bodyPart],
							bodyToSpend = spawn.energyCapacity * creepTemplateItem.value,
							// Round down to nearest whole no. as you don't get half a body part.
							bodyNo = Math.floor(bodyToSpend / bodyCost);
						if (bodyNo === 0) {
							// no enough to add body part so return invalid target error
							return ERR_INVALID_TARGET;
						}

						for (let i = 0; i < bodyNo; i++) {
							creepBody.push(bodyPart);
							bodyCostTotal += bodyCost;
						}
					}
				}
				spawn.memory.creepToSpawn.body = creepBody;
				spawn.memory.creepToSpawn.cost = bodyCostTotal;
			}

			// Double check if total capacity is enough
			if (spawn.memory.creepToSpawn.cost < spawn.energyCapacity) {
				return ERR_INVALID_TARGET;
			}

			// check if enough energy.
			if (spawn.energy < spawn.memory.creepToSpawn.cost) {
				// not enough energy so make an energy request
				// ignore if request already exists or request no longer exists
				if (
					!spawn.memory.requestId ||
					(spawn.memory.requestId && !this.memoryManager.getById(OBJECT_TYPE_ENERGY_REQUEST, spawn.memory.requestId))
				) {
					let energyRequest = this.resourceManager.createEnergyRequest(
						spawn.memory.colonyId, // colony
						spawn.pos,
						spawn.energyCapacity - spawn.energy,
						RESOURCE_ENERGY,
						PRIORITY_LOW
					);

					if (energyRequest !== ERR_INVALID_ARGS) {
						spawn.memory.requestId = energyRequest.id;
					} else {
						throw 'Warning: Invalid arguments given. spawnManager.spawnCreep(spawn)';
					}
				}
			} else {
				// spawn creep
				spawn.spawnCreep(spawn.memory.creepToSpawn.body, this.memoryManager.getNextCreepName(), { memory: spawn.memory.creepToSpawn.memory });
				// clean up
				spawn.memory.creepToSpawn = null;
				spawn.memory.requestId = 0;

				// delete request? (maybe not handle that here)

				// return success code
				return OK;
			}
		} else {
			logger.warning('Invalid parameter spawn: ');
			logger.log(JSON.stringify(spawn));
		}
	};
};
