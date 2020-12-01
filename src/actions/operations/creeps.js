const { requestCreep } = require("../room");

module.exports = {
	checkOperationCreeps: (operation) => {
		if (!operation || !operation.creepRoles) {
			throw new Error(`Invalid parameters! operation ${JSON.stringify(operation)}`);
		}

		// check differences in required and current

		for (const roleName in operation.creepRoles) {
			let role = operation.creepRoles[roleName];
			let noOfCurrentCreeps = 0;
			let creepsToDelete = [];

			if (role) {
				for (const creepName in operation.creepRoles[roleName].creepData) {
                    let creepData = operation.creepRoles[roleName].creepData[creepName];
                    
                    
                    let creep = Game.creeps[creepName];

					// if creep is valid
					if (!creep || creep.memory.role !== roleName || creep.memory.operationId !== operation.id) {
						//creep no longer exists so remove
						creepsToDelete.push(i);
						continue;
					}

					noOfCurrentCreeps++;
				}

				if (creepsToDelete) {
					creepsToDelete.forEach((name) => {
						delete operation.creepRoles[roleName].currentCreeps[name];
					});
				}

				const remainingNoOfCreeps = role.noCreepsRequired - noOfCurrentCreeps;

				if (remainingNoOfCreeps > 0) {
					for (let i = 0; i < remainingNoOfCreeps; i++) {
						// requisition more creeps
						requestCreep;
					}
				} else if (remainingNoOfCreeps < 0) {
					const creepNames = Object.keys(operation.creepRoles[roleName].currentCreeps).slice(0, remainingNoOfCreeps * -1 + 1);
					for (const creepName in creepNames) {
						delete operation.creepRoles[roleName].currentCreeps[creepName];
					}
				}
			}
		}

		

		var noCreepIds = Object.keys(sourceMemory.creepIds).length;

		if (!sourceMemory.pendingCreepIds) {
			sourceMemory.pendingCreepIds = {};
		} else {
			// check for any defunct pending creeps
			for (const id in sourceMemory.pendingCreepIds) {
				if (!Memory.spawnQueueItems[sourceMemory.pendingCreepIds[id]]) {
					delete sourceMemory.pendingCreepIds[id];
				}
			}
		}

		var creepsPending = Object.keys(sourceMemory.pendingCreepIds),
			noCreepsRequired = sourceMemory.noOfAccessPos - noCreepIds;

		// console.log(
		// 	`source run. noCreepsRequired ${noCreepsRequired} | noOfAccessPos ${sourceMemory.noOfAccessPos} | noCreepIds ${noCreepIds} | creepsPending ${creepsPending}`
		// );

		for (var q = 0; q < noCreepsRequired; q++) {
			let creep = this.creepRequisitioner.getIdleCreep(source.room, CREEP_TYPES.UTILITY, {
				role: CREEP_ROLES.HARVESTER,
				sourceId: source.id,
			});

			if (creep) {
				sourceMemory.creepIds[creep.name] = creep.name;
				noCreepIds++;
				let spawnQueueItemId = creepsPending.shift(); //get first pending id
				if (Memory.spawnQueueItems[spawnQueueItemId]) {
					delete sourceMemory.pendingCreepIds[spawnQueueItemId];
					delete Memory.spawnQueueItems[spawnQueueItemId];
				}
			} else {
				break;
			}
		}

		let noCreepsPending = creepsPending.length;

		if (sourceMemory.noOfAccessPos > noCreepsPending + noCreepIds) {
			// console.log(
			// 	`sourceMemory.noOfAccessPos:${sourceMemory.noOfAccessPos} > sourceMemory.creepsPending:${sourceMemory.creepsPending}`
			// );

			while (noCreepsPending + noCreepIds < sourceMemory.noOfAccessPos) {
				let spawnQueueItem = this.creepRequisitioner.addCreepToRoomSpawnQueue(source.room, CREEP_TYPES.UTILITY, {
					role: CREEP_ROLES.HARVESTER,
					sourceId: source.id,
				});

				// if response exists but isn't spawning resonse (1) must have found idle creep
				if (spawnQueueItem) {
					//console.log(`spawnQueueItem: ${JSON.stringify(spawnQueueItem)}`);
					if (!sourceMemory.pendingCreepIds) {
						sourceMemory.pendingCreepIds = {};
					}

					sourceMemory.pendingCreepIds[spawnQueueItem.id] = spawnQueueItem.id;
					noCreepsPending++;
				} else {
					console.log(`No spawn queue Item found!`);
				}
			}
		}
	},
};
