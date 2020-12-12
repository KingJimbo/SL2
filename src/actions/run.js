const { OBJECT_TYPE } = require("../common/constants");
const { isANumber, getAccessiblePositions } = require("./common");
const { saveObject } = require("./memory");
const { checkOperationCreeps } = require("./operationCreeps");
const { addCreepToIdlePool } = require("./roomCreepRequisition");

module.exports = {
	runSourceOperation: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameter source operation");
		}

		let source = Game.getObjectById(operation.sourceId);

		if (!operation.level || source.room.controller.level > operation.level) {
			upgradeSourceOperation(operation);
		}

		checkOperationCreeps(operation);
	},
	runCreep: (creep) => {
		if (!creep) {
			throw new Error(`Invalid Parameters!`);
		}

		if (!creep.memory.role) {
			//do somehting to reassign creep
			console.log("No creep role found in memory adding to idle pool");
			addCreepToIdlePool(creep.room, creep);
		}

		if (!creep.memory.type || creep.memory.type === "unknown") {
			creep.memory.type = CREEP_TYPES.UTILITY;
		}

		switch (creep.memory.role) {
			case "idle":
				if (!Memory.idleCreeps[creep.name]) {
					console.log("No creep name found idle creep memory adding to idle pool");
					//this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
				}
				creep.moveTo(0, 0);
				break;
			case CREEP_ROLES.HARVESTER:
				if (!creep.memory.currentAction) {
					creep.store.getFreeCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY)
						? (creep.memory.currentAction = "goToSource")
						: (creep.memory.currentAction = "goToDestination");
				}

				switch (creep.memory.currentAction) {
					case "goToSource":
						let source = Game.getObjectById(creep.memory.sourceId);

						if (!source) {
							console.log(`No source found belonging to id ${creep.memory.sourceId}!`);
							//this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
						} else {
							// check source
							let sourceMemory = Memory.sources[source.id];
							if (!sourceMemory.creepIds[creep.name]) {
								if (Object.keys(sourceMemory.creepIds).length < sourceMemory.noOfAccessPos) {
									sourceMemory.creepIds[creep.name] = creep.name;
									if (!sourceMemory.pendingCreepIds) {
										sourceMemory.pendingCreepIds = {};
									}

									if (creep.memory.spawnQueueItemId) {
										if (sourceMemory.pendingCreepIds[creep.memory.spawnQueueItemId]) {
											delete sourceMemory.pendingCreepIds[creep.memory.spawnQueueItemId];
										}

										delete creep.memory.spawnQueueItemId;
									}
								} else {
									//this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
								}
							}

							Memory.sources[source.id] = sourceMemory;
						}

						creep.moveTo(source.pos);
						if (creep.pos.isNearTo(source.pos)) {
							creep.memory.currentAction = "harvest";
							creep.harvest(Game.getObjectById(creep.memory.sourceId));
						}

						break;
					case "harvest":
						if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
							creep.harvest(Game.getObjectById(creep.memory.sourceId));
						} else {
							if (!creep.memory.resourceOrderItemId) {
								this.resource.findNextResourceOrderToFulfill(
									creep.room,
									creep,
									RESOURCE_ENERGY,
									creep.store.getUsedCapacity(RESOURCE_ENERGY)
								);
							}

							creep.memory.currentAction = "goToDestination";
							let destination = this.resource.getResourceOrderItemDestination(creep.memory.resourceOrderItemId);
							creep.moveTo(destination.pos);
						}

						break;
					case "goToDestination":
						if (!creep.memory.resourceOrderItemId) {
							if (creep.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) {
								creep.memory.currentAction = "goToSource";
							} else {
								this.resource.findNextResourceOrderToFulfill(
									creep.room,
									creep,
									RESOURCE_ENERGY,
									creep.store.getUsedCapacity(RESOURCE_ENERGY)
								);
							}
						}

						if (creep.memory.resourceOrderItemId) {
							let destination = this.resource.getResourceOrderItemDestination(creep.memory.resourceOrderItemId);
							creep.moveTo(destination.pos);
							let isNear = creep.pos.isNearTo(destination.pos);

							if (isNear) {
								if (destination.structureType === STRUCTURE_CONTROLLER) {
									let controller = destination;

									if (controller.progress >= controller.progressTotal) {
										let upgradeResult = creep.upgradeController(controller);

										switch (upgradeResult) {
											case OK:
												console.log(`controller upgrade scheduled successfully in room ${creep.room.name}`);
												break;
										}
									}
								}

								let transferResult = this.resource.fulfillResourceOrderItem(creep);

								if (transferResult !== OK) {
									console.log(`transferResult: ${transferResult}`);
								}

								creep.memory.currentAction = "goToSource";
							}
						}

						break;
				}

				break;
		}
	},
};
