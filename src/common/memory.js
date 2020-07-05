// memory-manager.js
module.exports = function () {
	if (!Memory) {
		throw ERR_MESSAGE_INVALID_ARGS;
	}

	if (!Memory.cmdr) {
		Memory.cmdr = {};
	}

	this.getAll = function (objectType) {
		return Memory.cmdr[objectType];
	};

	this.getById = function (objectType, id) {
		if (!Memory.cmdr[objectType]) {
			Memory.cmdr[objectType] = {};
		}
		return Memory.cmdr[objectType][id];
	};
	// add function calls to memory here

	this.save = function (object) {
		if (!object.objectType) {
			throw new Error('Error: object does not have a valid object type.');
		}
		if (!Memory.cmdr[object.objectType]) {
			Memory.cmdr[object.objectType] = {};
		}

		// new object
		if (!object.id) {
			// generate id
			object.id = this.getNextId(object.objectType);
		}
		Memory.cmdr[object.objectType][object.id] = object;

		// if (object.objectType === OBJECT_TYPE_SETTING) {
		logger.log('memory save');
		logger.stringify(Memory.cmdr[object.objectType][object.id]);
		// }

		return object;
	};

	this.getNextId = function (objectType) {
		if (!Memory.cmdr.objectIds) {
			Memory.cmdr.objectIds = {};
		}
		if (!Memory.cmdr.objectIds[objectType]) {
			Memory.cmdr.objectIds[objectType] = 0;
		}
		Memory.cmdr.objectIds[objectType]++;
		return Memory.cmdr.objectIds[objectType];
	};

	this.getNextCreepName = function () {
		return 'Creep_' + this.getNextId(OBJECT_TYPE_CREEP_ID);
	};
};
