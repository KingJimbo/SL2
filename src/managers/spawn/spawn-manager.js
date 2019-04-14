// spawn-manager.js

module.exports = function(game, memoryManager) {
	this.game = game;
	this.memoryManager = memoryManager;

	this.spawnCreeps = function() {
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

	this.spawnCreep = function(spawn) {
		// check spawn for creep template
		if (spawn && spawn.memory && spawn.memory.creepToSpawn && spawn.memory.creepToSpawn.type) {
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

			// Double check if total capacity is enough
			if (bodyCostTotal < spawn.energyCapacity) {
				return ERR_INVALID_TARGET;
			}

			// check if enough energy.
			if (spawn.energy < bodyCostTotal) {
				// not enough energy so make an energy request
				// ignore if request already exists
			} else {
				// spawn creep
				// delete request? (maybe not handle that here)
				// return success code
			}
		}

		// invalid parameters
		return;
	};
};
