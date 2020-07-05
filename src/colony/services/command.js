// command-module.js

module.exports = function ({ memoryManager }) {
	this.memory = memoryManager;

	//determind command stance
	this.getStance = function (colony) {
		let currentColony = this.memory.getById(OBJECT_TYPE_COLONY, colony.id);

		// Default to peace
		if (!currentColony.currentStance) {
			this.currentStance = COMMAND_STANCES.PEACE;
		}

		// TODO check if there is any threats to change stance

		this.memory.save(currentColony);
	};
};
