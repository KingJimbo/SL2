const { OBJECT_TYPE } = require("../common/constants");
const { isANumber, getAccessiblePositions } = require("./common");
const { saveObject, getObject } = require("./memory");
const { deleteOperation } = require("./operation");
const { checkOperationCreeps } = require("./operationCreeps");
const { upgradeSourceOperation } = require("./operationSource");
const { addCreepToIdlePool } = require("./roomCreepRequisition");
const { runIdleCreep, runHarvesterCreep } = require("./runCreep");
const resource = App.modules.resource;

module.exports = {
	runSourceOperation: (operation) => {
		if (!operation) {
			throw new Error("Invalid parameter source operation");
		}

		let source = Game.getObjectById(operation.sourceId);

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

		if (operation.constructionId) {
			constructionSite = Game.getObjectById(operation.constructionId);
		}

		if (!constructionSite) {
			// still needs built
			//let spawnName = name
			const createConstructionSiteResponse = room.createConstructionSite(operation.x, operation.y, operation.structureType);
			if (createConstructionSiteResponse !== OK) {
				console.log(`Failed to build contruction site response ${createConstructionSiteResponse}`);
			}
			operation.status = STRUCTURE_BUILD_STATUS.UNDER_CONSTRUCTION;
		}

		if (constructionSite && !constructionSite.progressTotal) {
			// built
			operation.status = STRUCTURE_BUILD_STATUS.BUILT;
		}

		if (constructionSite && constructionSite.progressTotal && constructionSite.progress < constructionSite.progressTotal) {
			// still under construction
			operation.status = STRUCTURE_BUILD_STATUS.UNDER_CONSTRUCTION;
		}

		switch (operation.status) {
			case STRUCTURE_BUILD_STATUS.UNDER_CONSTRUCTION:
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
			case STRUCTURE_BUILD_STATUS.BUILT:
				// clean up
				deleteOperation(operation);
				break;
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
