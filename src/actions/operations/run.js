const { isANumber } = require("../common");

module.exports = {
	runSourceOperation: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameter source operation");
		}

		let source = Game.getObjectById(operation.sourceId);
		//console.log(`runRooms | source: ${source.id}`);

		if (!Memory.sources[source.id]) {
			const accessPos = this.getAccessiblePositions(source.pos);
			Memory.sources[source.id] = {
				noOfAccessPos: accessPos.length,
				creepsAssigned: 0,
				creepsPending: 0,
				creepIds: {},
				pendingCreepIds: {},
			};
		}

		var sourceMemory = Memory.sources[source.id];

		if (!sourceMemory.creepIds) {
			sourceMemory.creepIds = {};
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

		Memory.sources[source.id] = sourceMemory;
	},
};
