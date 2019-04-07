// memory-manager.js

module.exports = function(memory) {
	this.memory = memory;

	// undefined check to see if initialisation required
	if (typeof this.memory === "undefined" || typeof this.memory.settings === "undefined") {
		this.initialiseMemory();
	}

	this.initialiseMemory = function() {
		this.memory = {
			colonies: {}
		};
	};

	this.getAllColonies = function() {
		return this.memory.colonies;
	};

	this.getAll = function(objectType) {
		return this.memory[objectType];
	};

	this.getById = function(objectType, id) {
		return this.memory[objectType][id];
	};
	// add function calls to memory here

	this.save = function(object) {
		if (!object.objectType) {
			throw "Error: object does not have a valid object type.";
		}
		if (!this.memory[object.objectType]) {
			this.memory[object.objectType] = {};
		}

		// new object
		if (!object.id) {
			// generate id
			object.id = this.getNextId(object.objectType);
		}
		this.memory[object.objectType][object.id] = object;
		return object;
	};

	this.getNextId = function(objectType) {
		if (!this.memory.objectIds) {
			this.memory.objectIds = {};
		}
		if (!this.memory.objectIds[objectType]) {
			this.memory.objectIds[objectType] = 0;
		}
		this.memory.objectIds[objectType]++;
		return this.memory.objectIds[objectType];
	};
};
