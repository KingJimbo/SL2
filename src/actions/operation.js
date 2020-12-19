const { OPERATION_TYPE, OBJECT_TYPE, OPERATION_STATUS } = require("../common/constants");
const { isANumber } = require("../actions/common");
const { saveObject, deleteObject } = require("../actions/memory");
const { addCreepToIdlePool } = require("./roomCreepRequisition");

module.exports = {
	createBuildOperation: (structureType, x, y, roomName) => {
		if (!roomName || !isANumber(x) || !isANumber(y) || !structureType) {
			console.log(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
			return null;
		}

		let room = Game.rooms[roomName];

		if (!room) {
			console.log(`Couldn't find room: ${roomName}`);
			return null;
		}

		let buildOperation = saveObject({
			objectType: OBJECT_TYPE.OPERATION,
			operationType: OPERATION_TYPE.BUILD,
			structureType,
			status: OPERATION_STATUS.ACTIVE,
			x,
			y,
			room: roomName,
		});

		if (!buildOperation) {
			console.log(`Failed to create build operation`);
			return null;
		}

		return buildOperation;
	},

	deleteOperation: (operation) => {
		if (!operation) {
			throw new Error(`Invalid Parameters`);
		}

		// idle creeps
		for (const rolename in operation.creepRoles) {
			const role = operation.creepRoles[rolename];

			for (const creepName in role.creepData) {
				let creep = Game.creeps[creepName];

				addCreepToIdlePool(creep.room, creep);
			}
		}

		//delete from memory
		deleteObject(OBJECT_TYPE.OPERATION, operation.id);
	},
};
