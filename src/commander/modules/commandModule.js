/*
    command that will add all colony check commands
*/

module.exports = function () {
	this.pushDataToQueue = (type, values) => {
		let commandModuleMemory = this.getCommandMemory();
		commandModuleMemory.commandQueue.push({ type, values });
		_Modules.memory.save(commandModuleMemory);
	};

	this.getCommandMemory = () => {
		return _Modules.memory.getById(OBJECT_TYPE_SETTING, SETTING_ID_COMMAND_MODULE);
	};
};
