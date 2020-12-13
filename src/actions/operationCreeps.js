const { OBJECT_TYPE } = require("../common/constants");
const { saveObject } = require("./memory");
const { getIdleCreep, addCreepToSpawn, addCreepToIdlePool } = require("./roomCreepRequisition");

module.exports = {
	checkOperationCreeps: (operation) => {
		if (!operation) {
			throw new Error(`Invalid parameters! operation ${JSON.stringify(operation)}`);
		}

		console.log(`operation ${JSON.stringify(operation)}`);

		// check differences in required and current
		let room = Game.rooms[operation.room];

		if (!room) {
			console.log(`Couldn't find room ${operation.room}`);
		}

		if (room.memory.spawnsCheckedTime && room.memory.spawnsCheckedTime === Game.time) {
			return;
		}

		if (operation.creepRoles) {
			for (const roleName in operation.creepRoles) {
				console.log(`roleName ${JSON.stringify(roleName)}`);
				let role = operation.creepRoles[roleName];
				let noOfCurrentCreeps = 0;
				let creepsToDelete = [];

				if (role) {
					console.log(`role ${JSON.stringify(role)}`);

					if (operation.creepRoles[roleName].creepData) {
						for (const creepName in operation.creepRoles[roleName].creepData) {
							let creepData = operation.creepRoles[roleName].creepData[creepName];

							if (creepData && !creepData.pending) {
								let creep = Game.creeps[creepName];

								// if creep is valid
								if (!creep || creep.memory.role !== roleName || creep.memory.operationId !== operation.id) {
									//creep no longer exists so remove
									creepsToDelete.push(i);
									continue;
								}
							}

							noOfCurrentCreeps++;
						}
					}

					if (creepsToDelete) {
						creepsToDelete.forEach((name) => {
							delete operation.creepRoles[roleName].creepData[name];
						});
					}

					const remainingNoOfCreeps = role.noCreepsRequired - noOfCurrentCreeps;

					//console.log(`remainingNoOfCreeps ${remainingNoOfCreeps}`);

					if (remainingNoOfCreeps > 0) {
						for (let i = 0; i < remainingNoOfCreeps; i++) {
							// requisition more creeps
							// requestIdleCreep;

							let creep = getIdleCreep(operation.room, CREEP_TYPES.UTILITY);

							if (creep) {
								if (!role.creepData) {
									role.creepData = {};
								}

								role.creepData[creep.name] = { name: creep.name };
								creep.memory.operationId = operation.id;
								creep.memory.role = roleName;
							} else {
								if (!addCreepToSpawn(operation.room, CREEP_TYPES.UTILITY, { role: roleName, operationId: operation.id })) {
									break;
								}
							}
						}
					} else if (remainingNoOfCreeps < 0) {
						const creepNames = Object.keys(operation.creepRoles[roleName].creepData).slice(0, remainingNoOfCreeps * -1 + 1);

						//console.log(`remainingNoOfCreeps ${remainingNoOfCreeps}`);

						if (creepNames) {
							creepNames.forEach((creepName) => {
								delete operation.creepRoles[roleName].creepData[creepName];
								let creep = Game.creeps[creepName];

								console.log(`creep ${creep} creepName ${creepName}`);

								if (creep) {
									addCreepToIdlePool(creep.room, creep);
								}
							});
						}
					}
				}
			}
		}

		saveObject(operation);
	},
};
