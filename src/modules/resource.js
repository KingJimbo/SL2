(() => {
	let resourceModule = {
		addStructureResourceRequest: (structure, resourceType, amount) => {
			if ((!structure, !resourceType)) {
				throw Error(
					`Invalid parameters structure  ${JSON.stringify(structure)}, resourceType ${JSON.stringify(
						resourceType
					)}, amount ${JSON.stringify(amount)}`
				);
			}

			if (!structure.room.memory.resourceRequests) {
				structure.room.memory.resourceRequests = {};
			}

			if (!structure.room.memory.resourceRequests[resourceType]) {
				structure.room.memory.resourceRequests[resourceType] = {};
			}

			if (!structure.room.memory.resourceRequests[resourceType][structure.structureType]) {
				structure.room.memory.resourceRequests[resourceType][structure.structureType] = {};
			}

			if (!structure.room.memory.structureMemory) {
				structure.room.memory.structureMemory = {};
			}

			if (!structure.room.memory.structureMemory[structure.structureType]) {
				structure.room.memory.structureMemory[structure.structureType] = {};
			}

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id] = {
					resourceRequests: {},
					repairCreepName: null,
				};
			}

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[resourceType]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[resourceType] = {
					amount: {},
					pendingAmount: 0,
					pendingCreepNames: {},
				};
			}

			let structureResourceRequestMemory =
				structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[resourceType];

			if (process.env.NODE_ENV === "development") {
				console.log(`structureResourceRequestMemory ${JSON.stringify(structureResourceRequestMemory)}`);
			}

			if (amount !== structureResourceRequestMemory.amount) {
				structureResourceRequestMemory.amount = amount;
			}

			structureResourceRequestMemory.pendingAmount = 0;

			const creepNames = Object.keys(structureResourceRequestMemory.pendingCreepNames);

			if (creepNames && creepNames.length > 0) {
				creepNames.forEach((creepName) => {
					//
					let creep = Game.creeps[creepName];

					// if a creep is invalid remove
					if (!creep) {
						delete structureResourceRequestMemory.pendingCreepNames[creepName];
						return;
					}

					structureResourceRequestMemory.pendingAmount += creep.store.getUsedCapacity(resourceType);
				});
			}

			// if pending is less than total submit a request to the room
			if (structureResourceRequestMemory.pendingAmount < structureResourceRequestMemory.amount) {
				if (!structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]) {
					structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id] = structure.id;

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Added resource request for structure ${JSON.stringify(
								structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]
							)}`
						);
					}
				}
			} else {
				if (process.env.NODE_ENV === "development") {
					console.log(`structure ${JSON.stringify(structure.id)}`);
					console.log(
						`Deleting resource request for structure ${JSON.stringify(
							structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]
						)}`
					);
				}

				delete structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id];
			}

			structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[
				resourceType
			] = structureResourceRequestMemory;
		}, // addStructureResourceRequest END

		addStructureRepairRequest: (structure, amount) => {
			if ((!structure, !amount)) {
				throw Error(
					`Invalid parameters structure  ${JSON.stringify(structure)}, resourceType ${JSON.stringify(
						resourceType
					)}, amount ${JSON.stringify(amount)}`
				);
			}

			// intialise repair requests memory
			if (!structure.room.memory.repairRequests) {
				structure.room.memory.repairRequests = {};
			}

			if (!structure.room.memory.repairRequests[structure.structureType]) {
				structure.room.memory.repairRequests[structure.structureType] = {};
			}

			if (!structure.room.memory.repairRequests[structure.structureType][structure.id]) {
				structure.room.memory.repairRequests[structure.structureType][structure.id] = structure.id;
			}

			// initialising structure memory
			if (!structure.room.memory.structureMemory) {
				structure.room.memory.structureMemory = {};
			}

			if (!structure.room.memory.structureMemory[structure.structureType]) {
				structure.room.memory.structureMemory[structure.structureType] = {};
			}

			if (!structure.room.memory.structureMemory[structure.structureType][structure.id]) {
				structure.room.memory.structureMemory[structure.structureType][structure.id] = {
					resourceRequests: {},
					repairCreepName: null,
				};
			}

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];

			if (structureMemory.repairCreepName) {
				let creep = Game.creeps[structureMemory.repairCreepName];

				// if valid remove repair request
				if (creep && creep.memory.structureId === structure.id && creep.memory.currentAction === CREEP_ACTIONS.REPAIR_STRUCTURE) {
					delete structure.room.memory.repairRequests[structure.structureType][structure.id];
				}
			}
		}, // addStructureRepairRequest END

		getNextResourceRequestStructure: (room, resourceType) => {
			if (!room.memory.resourceRequests) {
				room.memory.resourceRequests = {};
			}

			if (!room.memory.resourceRequests[resourceType]) {
				room.memory.resourceRequests[resourceType] = {};
			}

			var strucIndex = 0;

			let structure = null;

			while (!structure && strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length) {
				const structureType = RESOURCE_ORDER_STRUCTURE_PRIORITY[strucIndex];

				if (!room.memory.resourceRequests[resourceType][structureType]) {
					room.memory.resourceRequests[resourceType][structureType] = {};
				}

				const structureIds = Object.keys(room.memory.resourceRequests[resourceType][structureType]);

				for (const i in structureIds) {
					const structureId = structureIds[i];
					structure = Game.getObjectById(structureId);

					if (!structure) {
						throw new Error(`Couldn't find structure beloning to structure id ${structureId}`);
					}

					return structure;
				}

				strucIndex++;
			}
		}, // getNextResourceRequestStructure END

		getNextRepairRequestStructure: (room) => {
			// intialise repair requests memory
			if (!room.memory.repairRequests) {
				room.memory.repairRequests = {};
			}

			var strucIndex = 0;

			let structure = null;

			while (!structure && strucIndex < RESOURCE_ORDER_STRUCTURE_PRIORITY.length) {
				const structureType = RESOURCE_ORDER_STRUCTURE_PRIORITY[strucIndex];

				if (!room.memory.repairRequests[structureType]) {
					room.memory.repairRequests[structureType] = {};
				}

				const structureIds = Object.keys(room.memory.repairRequests[structureType]);

				for (const structureId in structureIds) {
					structure = Game.getObjectById(structureId);

					if (!structure) {
						throw new Error(`Couldn't find structure beloning to structure id ${structureId}`);
					}

					return structure;
				}

				strucIndex++;
			}
		}, // getNextResourceRequestStructure END

		assignCreepToResourceRequest: (creep, structure, resourceType) => {
			resourceModule.initialiseResourceRequestMemory(structure.room, resourceType, structure.structureType);

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];
			if (structureMemory) {
				let structureResourceRequestMemory = structureMemory.resourceRequests[resourceType];

				// if pending amount is already greater than amount required return false
				if (structureResourceRequestMemory.pendingAmount >= structureResourceRequestMemory.amount) {
					if (process.env.NODE_ENV === "development") {
						console.log(`structure ${JSON.stringify(structure.id)}`);
						console.log(
							`Deleting resource request for structure ${JSON.stringify(
								structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]
							)}`
						);
					}

					delete structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id];

					if (process.env.NODE_ENV === "development") {
						console.log(
							`Pending amount is greater than required amount! Shouldn't have been in request queue! ${JSON.stringify(
								resourceType
							)} ${JSON.stringify(structure)}`
						);
					}

					return false;
				}

				structureResourceRequestMemory.pendingCreepNames[creep.name] = creep.name;

				let creepNames = Object.keys(structureResourceRequestMemory.pendingCreepNames);

				if (creepNames && creepNames.length > 0) {
					creepNames.forEach((creepName) => {
						let creep = Game.creeps[creepName];

						if (creep && creep.memory.structureId && creep.memory.structureId === structure.id) {
							let usedCapacity = creep.store.getUsedCapacity(resourceType);

							if (usedCapacity) {
								structureResourceRequestMemory.pendingAmount += usedCapacity;
								return;
							}
						}

						// if not valid or carrying any resource delete from pending
						delete structureResourceRequestMemory.pendingCreepNames[creepName];
					});
				}

				// pending amount is equal or greater than required delete request
				if (structureResourceRequestMemory.pendingAmount >= structureResourceRequestMemory.amount) {
					if (process.env.NODE_ENV === "development") {
						console.log(`structure ${JSON.stringify(structure.id)}`);

						console.log(
							`Deleting resource request for structure ${JSON.stringify(
								structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id]
							)}`
						);
					}

					delete structure.room.memory.resourceRequests[resourceType][structure.structureType][structure.id];
				}

				structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[
					resourceType
				] = structureResourceRequestMemory;

				return true;
			}
		}, // assignCreepToResourceRequest END

		removeCreepFromResourceRequest: (creep, structure, resourceType) => {
			resourceModule.initialiseResourceRequestMemory(structure.room, resourceType, structure.structureType);

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];
			if (structureMemory) {
				let structureResourceRequestMemory = structureMemory.resourceRequests[resourceType];

				delete structureResourceRequestMemory.pendingCreepNames[creep.name];
				structure.room.memory.structureMemory[structure.structureType][structure.id].resourceRequests[
					resourceType
				] = structureResourceRequestMemory;
			}
		}, // removeCreepFromResourceRequest END

		assignCreepToRepairRequest: (creep, structure) => {
			// intialise repair requests memory

			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];

			if (!structureMemory) {
				throw Error(`Couldn't find structure memory for ${JSON.stringify(structure)}`);
			}

			structureMemory.repairCreepName = creep.name;

			structure.room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;

			// delete repair request
			delete structure.room.memory.repairRequests[structure.structureType][structure.id];

			return true;
		}, // assignCreepToRepairRequest END

		removeCreepFromRepairRequest: (structure) => {
			let structureMemory = structure.room.memory.structureMemory[structure.structureType][structure.id];
			if (structureMemory) {
				delete structureMemory.repairCreepName;
			}
			structure.room.memory.structureMemory[structure.structureType][structure.id] = structureMemory;
		}, // removeCreepFromRepairRequest END

		assignCreepToNextEnergyRequest: (creep) => {
			let room = creep.room,
				structure = resourceModule.getNextResourceRequestStructure(room, RESOURCE_ENERGY);

			if (structure) {
				if (resourceModule.assignCreepToResourceRequest(creep, structure, RESOURCE_ENERGY)) {
					creep.memory.currentAction = CREEP_ACTIONS.TRANSFER_RESOURCE;
					creep.memory.resourceType = RESOURCE_ENERGY;
				}
			} else {
				structure = resourceModule.getNextRepairRequestStructure(room);

				if (structure) {
					if (resourceModule.assignCreepToRepairRequest(creep, structure)) {
						creep.memory.currentAction = CREEP_ACTIONS.REPAIR_STRUCTURE;
					}
				}
			}

			if (!structure) {
				structure = room.controller;
				creep.memory.currentAction = CREEP_ACTIONS.UPGRADE_CONTROLLER;
			}

			return structure;
		}, // assignCreepToNextEnergyRequest END

		initialiseResourceRequestMemory: (room, resourceType, structureType) => {
			if (!room.memory.resourceRequests) {
				room.memory.resourceRequests = {};
			}

			if (!room.memory.resourceRequests[resourceType]) {
				room.memory.resourceRequests[resourceType] = {};
			}

			if (!room.memory.resourceRequests[resourceType][structureType]) {
				room.memory.resourceRequests[resourceType][structureType] = {};
			}

			if (!room.memory.structureMemory) {
				room.memory.structureMemory = {};
			}

			if (!room.memory.structureMemory[structureType]) {
				room.memory.structureMemory[structureType] = {};
			}
		}, // initialiseResourceRequestMemory END
	};

	global.App.resourceModule = resourceModule;
})();

module.exports = global.App.resourceModule;
