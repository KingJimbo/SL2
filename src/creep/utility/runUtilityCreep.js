// import { resourceModule } from '../../modules/resource';
// //import { runIdleCreep } from '../../modules/resource';

// export const runUtilityCreep = (creep) => {
//     //const { resourceModule } = global.App;

//     // if creep has no memory of currentAction or that current action is IDLE
//     if (!creep.memory.currentAction || creep.memory.currentAction != CREEP_ACTIONS.UTILITY) {
//         // do nothing until creep has been assigned
//         // register as idle
//         // runIdleCreep(creep)
//     }

//     if (creep.store.getUsedCapacity() > 0) {
//         const resourceTypes = Object.keys(creep.store);

//         for (const i in resourceTypes) {
//             const resourceType = resourceTypes[i];

//             // if (process.env.NODE_ENV === "development" ) {
//             // 	global.logger.log(
//             // 		`resourceType ${resourceType}, RESOURCES[resourceType] ${
//             // 			RESOURCES[resourceType]
//             // 		}, Object.keys(creep.store) ${JSON.stringify(Object.keys(creep.store))}`
//             // 	);
//             // }

//             if (creep.room.controller.ticksToDowngrade < MIN_CONTROLLER_TICKS_TO_DOWNGRADE) {
//                 const controllerId = resourceModule.getUpgradeControllerRequest(creep.room);

//                 if (controllerId) {
//                     creep.memory.currentAction = CREEP_ACTIONS.UPGRADE;
//                     creep.memory.structureId = controllerId;

//                     return creepModule.carryOutAction(creep);
//                 }
//             }

//             const transferData = resourceModule.assignCreepToNextTransferRequest(creep, resourceType);

//             if (transferData) {
//                 creep.memory.currentAction = CREEP_ACTIONS.TRANSFER;
//                 creep.memory.resourceType = resourceType;
//                 creep.memory.structureId = transferData.id;

//                 return creepModule.carryOutAction(creep);
//             }

//             if (resourceType === RESOURCE_ENERGY) {
//                 const repairData = resourceModule.assignRepairerToNextRequest(creep);

//                 if (repairData) {
//                     creep.memory.currentAction = CREEP_ACTIONS.REPAIR;
//                     creep.memory.structureId = repairData.id;

//                     return creepModule.carryOutAction(creep);
//                 }

//                 const buildData = resourceModule.assignCreepToNextBuildRequest(creep);

//                 if (buildData) {
//                     creep.memory.currentAction = CREEP_ACTIONS.BUILD;
//                     creep.memory.structureId = buildData.id;

//                     return creepModule.carryOutAction(creep);
//                 }

//                 const controllerId = resourceModule.getUpgradeControllerRequest(creep.room);

//                 if (controllerId) {
//                     creep.memory.currentAction = CREEP_ACTIONS.UPGRADE;
//                     creep.memory.structureId = controllerId;

//                     return creepModule.carryOutAction(creep);
//                 }
//             }
//         }
//     }

//     const pickupData = resourceModule.assignCreepToNextPickupRequest(creep);

//     if (pickupData) {
//         creep.memory.currentAction = CREEP_ACTIONS.PICKUP;
//         creep.memory.pickupPosition = pickupData.pos;
//         creep.memory.resourceType = pickupData.resourceType;

//         return creepModule.carryOutAction(creep);
//     }

//     let harvestObject = resourceModule.assignCreepToNextHarvestRequest(creep);

//     if (harvestObject) {
//         creep.memory.harvestObjectId = harvestObject.id;
//         creep.memory.resourceType = harvestObject.resourceType;
//         creep.memory.currentAction = CREEP_ACTIONS.HARVEST;

//         return creepModule.carryOutAction(creep);
//     }

//     const withdrawData = resourceModule.assignCreepToNextWithdrawRequest(creep);

//     if (withdrawData) {
//         creep.memory.currentAction = CREEP_ACTIONS.WITHDRAW;
//         creep.memory.structureId = withdrawData.withdrawStructure.id;
//         creep.memory.destinationId = withdrawData.destinationId;
//         creep.memory.resourceType = withdrawData.resourceType;

//         return creepModule.carryOutAction(creep);
//     }

//     creep.memory.currentAction = CREEP_ACTIONS.IDLE;
//     return creepModule.carryOutAction(creep);

// }
