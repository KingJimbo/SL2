const { OBJECT_TYPE } = require("../common/constants");
const { getObject } = require("./memory");
const { addCreepToIdlePool } = require("./roomCreepRequisition");
const resource = App.modules.resource;

module.exports = {
	removeCreepRole: (creep) => {
		if (creep) {
			delete creep.memory.role;
		}
	},
	getCreepBody: (creepType, availableEnergy) => {
		//console.log('Start App.getCreepBody');
		const creepTemplate = CREEP_BODIES[creepType];
		//console.log(`creep template: ${JSON.stringify(creepTemplate)}`);

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

			//console.log(`creepTemplateItem: ${JSON.stringify(creepTemplateItem)}`);

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

		for (const bodyPart in creepTemplate) {
			const creepTemplateItem = creepTemplate[bodyPart];

			if (creepTemplateItem.value > 0) {
				creepBodyResponse.bodyCounts[bodyPart] += ratio;
				creepBodyResponse.bodyTotal += ratio;

				creepBodyResponse.cost += BODYPART_COST[bodyPart] * ratio;

				for (var i = 0; i < ratio; i++) {
					creepBodyResponse.creepBody.push(bodyPart);
				}
			}
		}

		return creepBodyResponse;
	},
	goToSource: (creep) => {
		let operation = getObject(OBJECT_TYPE.OPERATION, creep.memory.operationId);

		if (!operation) {
			addCreepToIdlePool(creep.room, creep);
			return;
		}

		let source = Game.getObjectById(operation.sourceId);

		if (!source) {
			console.log(`No source found belonging to id ${operation.sourceId}!`);
			addCreepToIdlePool(creep.room, creep);
			// TODO delete operation
			return;
		}

		creep.moveTo(source.pos);
		if (creep.pos.isNearTo(source.pos)) {
			creep.memory.currentAction = CREEP_ACTIONS.HARVEST;
			creep.harvest(source);
		}
	},
	harvest: (creep) => {
		if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
			let operation = getObject(OBJECT_TYPE.OPERATION, creep.memory.operationId);
			creep.harvest(Game.getObjectById(operation.sourceId));
		} else {
			if (!creep.memory.resourceOrderItemId) {
				resource.findNextResourceOrderToFulfill(creep.room, creep, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
			}

			creep.memory.currentAction = CREEP_ACTIONS.FULLFILL_ENERGY_ORDER;
			let destination = resource.getResourceOrderItemDestination(creep.memory.resourceOrderItemId);
			creep.moveTo(destination.pos);
		}
	},
	fullEnergyFillOrder: (creep) => {
		if (!creep.memory.resourceOrderItemId) {
			if (creep.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) {
				creep.memory.currentAction = CREEP_ACTIONS.GO_TO_SOURCE;
			} else {
				resource.findNextResourceOrderToFulfill(creep.room, creep, RESOURCE_ENERGY, creep.store.getUsedCapacity(RESOURCE_ENERGY));
			}
		}

		if (creep.memory.resourceOrderItemId) {
			let destination = resource.getResourceOrderItemDestination(creep.memory.resourceOrderItemId);
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

				let transferResult = resource.fulfillResourceOrderItem(creep);

				if (transferResult !== OK) {
					console.log(`transferResult: ${transferResult}`);
				}

				creep.memory.currentAction = CREEP_ACTIONS.GO_TO_SOURCE;
			}
		}
	},
};
