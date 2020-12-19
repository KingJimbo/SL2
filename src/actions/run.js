const { OBJECT_TYPE } = require("../common/constants");
const { LOOK_STRUCTURES } = require("../testing/constants");
const { isANumber, getAccessiblePositions } = require("./common");
const { saveObject, getObject } = require("./memory");
const { deleteOperation } = require("./operation");
const { idleOperationCreeps } = require("./operationCreeps");
const { upgradeSourceOperation } = require("./operationSource");
const { positionHasNearbyThreat } = require("./room");
const { addCreepToIdlePool } = require("./roomCreepRequisition");
const { runIdleCreep, runHarvesterCreep } = require("./runCreep");
const resource = App.modules.resource;

module.exports = {
	runSourceOperation: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameter source operation");
		}

		let source = Game.getObjectById(operation.sourceId);

		if (positionHasNearbyThreat(source.pos)) {
			console.log(`${JSON.stringify(source)}`);
			console.log("has threat");
			idleOperationCreeps(operation);
			operation.status = OPERATION_STATUS.SUSPEND;
			saveObject(operation);
			return;
		}

		operation.status = OPERATION_STATUS.ACTIVE;
		saveObject(operation);

		if (!operation.level || source.room.controller.level > operation.level) {
			upgradeSourceOperation(operation);
		}
	},

	runBuildOperation: (operation) => {
		if (!operation || !operation.id || !operation.room || !operation.structureType || !isANumber(operation.x) || !isANumber(operation.y)) {
			throw new Error(`invalid parameters operation: ${JSON.stringify(operation)}`);
		}

		let room = Game.rooms[operation.room],
			constructionSite = null;

		if (room.cantBuildTime === Game.time) {
			// exit
			return;
		}

		// check if it exists
		if (!operation.constructionId) {
			const lookSites = room.lookForAt(LOOK_CONSTRUCTION_SITES, operation.x, operation.y);

			if (lookSites) {
				lookSites.forEach((structure) => {
					if (structure.structureType === operation.structureType) {
						operation.constructionId = structure.id;
						constructionSite = structure;
					}
				});
			}
		}

		if (!constructionSite && operation.constructionId) {
			constructionSite = Game.getObjectById(operation.constructionId);
		}

		if (!constructionSite) {
			// still needs built
			const lookStructures = room.lookForAt(LOOK_STRUCTURES, operation.x, operation.y);

			if (lookStructures) {
				lookStructures.forEach((structure) => {
					if (structure.structureType === operation.structureType && !operation.progressTotal) {
						operation.status = OPERATION_STATUS.TERMINATE;
					}
				});
			}

			if (operation.status === OPERATION_STATUS.TERMINATE) {
				deleteOperation(operation);
				return;
			}

			operation.status = OPERATION_STATUS.ACTIVE;
			const createConstructionSiteResponse = room.createConstructionSite(operation.x, operation.y, operation.structureType);

			switch (createConstructionSiteResponse) {
				case ERR_FULL:
					room.memory.cantBuildTime = Game.time;
					break;
				default:
					console.log(
						`Failed to build contruction site response ${createConstructionSiteResponse} operation.x  ${operation.x} , operation.y  ${operation.y} , operation.structureType  ${operation.structureType} `
					);
					break;
			}
		} else {
			if (constructionSite && !constructionSite.progressTotal) {
				// built
				operation.status = OPERATION_STATUS.TERMINATE;
			}

			if (constructionSite && constructionSite.progressTotal && constructionSite.progress < constructionSite.progressTotal) {
				// still under construction
				operation.status = OPERATION_STATUS.ACTIVE;
			}

			switch (operation.status) {
				case OPERATION_STATUS.ACTIVE:
					if (!resource.getStructureResourceOrderId(constructionSite, RESOURCE_ENERGY)) {
						resource.createResourceOrder(
							room,
							constructionSite.id,
							RESOURCE_ENERGY,
							constructionSite.progressTotal - constructionSite.progress,
							true
						);
					}
					// check creep is assigned if not get one
					break;
				case OPERATION_STATUS.TERMINATE:
					// clean up
					deleteOperation(operation);
					break;
			}
		}

		// determine if structure is under construction
		// if not start construction
		// once construction started requisision energy
		//
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

		if (creep.memory.operationId) {
			let operation = getObject(OBJECT_TYPE.OPERATION, creep.memory.operationId);

			if (operation) {
				if (operation.creepRoles[creep.memory.role]) {
					if (!operation.creepRoles[creep.memory.role].creepData) {
						operation.creepRoles[creep.memory.role].creepData = {};
					}

					if (!operation.creepRoles[creep.memory.role].creepData[creep.name]) {
						operation.creepRoles[creep.memory.role].creepData[creep.name] = { name: creep.name };
					}
				}
			}
		}

		switch (creep.memory.role) {
			case "idle":
				runIdleCreep(creep);
				break;
			case CREEP_ROLES.HARVESTER:
				runHarvesterCreep(creep);
				break;
		}
	},
};
