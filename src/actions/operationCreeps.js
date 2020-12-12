const { getIdleCreep, addCreepToSpawn } = require("./roomCreepRequisition");

module.exports = {
	checkOperationCreeps: (operation) => {
		if (!operation || !operation.creepRoles) {
			throw new Error(`Invalid parameters! operation ${JSON.stringify(operation)}`);
		}

		// check differences in required and current
		let room = Game.rooms[operation.room];

		if (!room) {
			console.log(`Couldn't find room ${operation.room}`);
		}

		if (room.memory.spawnsCheckedTime && room.memory.spawnsCheckedTime === Game.time) {
			return;
		}

		for (const roleName in operation.creepRoles) {
			let role = operation.creepRoles[roleName];
			let noOfCurrentCreeps = 0;
			let creepsToDelete = [];

			if (role) {
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

				if (creepsToDelete) {
					creepsToDelete.forEach((name) => {
						delete operation.creepRoles[roleName].creepData[name];
					});
				}

				const remainingNoOfCreeps = role.noCreepsRequired - noOfCurrentCreeps;

				if (remainingNoOfCreeps > 0) {
					for (let i = 0; i < remainingNoOfCreeps; i++) {
						// requisition more creeps
						// requestIdleCreep;

						let creep = getIdleCreep(operation.room, CREEP_TYPES.UTILITY);

						if (creep) {
							role.creepData[creep.name] = { name: creep.name, role: roleName, operationId: operation.id };
						}

						if (!addCreepToSpawn(operation.room, CREEP_TYPES.UTILITY, { role: roleName, operationId: operation.id })) {
							break;
						}
					}
				} else if (remainingNoOfCreeps < 0) {
					const creepNames = Object.keys(operation.creepRoles[roleName].creepData).slice(0, remainingNoOfCreeps * -1 + 1);
					for (const creepName in creepNames) {
						delete operation.creepRoles[roleName].creepData[creepName];
					}
				}
			}
		}
	},
};
