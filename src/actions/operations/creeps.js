module.exports = {
	checkOperationCreeps: (operation) => {
		if (!operation || !operation.requiredCreeps) {
			throw new Error(`Invalid parameters! operation ${JSON.stringify(operation)}`);
		}

		// check differences in required and current
		let requiredCreepRoles = { ...operation.requiredCreeps };

		if (operation.currentCreeps) {
			let creepsToDelete = [];
			let curentCreepRoles = [];

			for (const creepName in operation.currentCreeps) {
				let creep = Game.creeps[creepId];
				if (!creep) {
					//creep no longer exists so remove
					creepsToDelete.push(i);
				}

				if (!requiredCreepRoles[creep.memory.role]) {
				}

				creep.memory.role;
			}

			if (creepsToDelete) {
				creepsToDelete.forEach((name) => {
					delete operation.currentCreeps[name];
				});
			}
		}

		// clean up dead creeps from source memory
		for (const name in sourceMemory.creepIds) {
			var creepname = sourceMemory.creepIds[name];
			let creep = Game.creeps[creepname];

			if (!creep) {
				delete sourceMemory.creepIds[name];
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
