/* 
    commander.js
    file used to hold and track all colony actions.
    - hold a list of all possible actions
    - hold an order of possible actions
    - 
*/

module.exports = function (game, _memory) {
	const Modules = require('./modules/modules.js');
	global._Modules = new Modules(game, _memory);
	const CommandList = require('./command-list.js');
	this.commandList = new CommandList();

	const { memory } = _Modules;
	this.memory = memory;

	this.action = (command) => {
		var name = command.execute.toString();
		return name.charAt(0).toUpperCase() + name.slice(1);
	};

	this.execute = (command) => {
		//logger.log(this.action(command));
		let commandMemory = this.getMemory();
		commandMemory.commandQueue.shift();
		commandMemory = this.memory.save(commandMemory);
		return command.execute(command.values);
	};

	this.setChecks = (doneChecks) => {
		let commandMemory = this.getMemory();
		commandMemory.lastCheckTime = _Modules.game.time;
		commandMemory = this.memory.save(commandMemory);
	};

	this.getMemory = function () {
		let commandMemory = this.memory.getById(global.OBJECT_TYPE_SETTING, global.SETTING_ID_COMMAND_MODULE);
		// logger.log('commander get memory');
		// logger.stringify(commandMemory);

		return commandMemory;
	};

	this.executeCommands = () => {
		let commandMemory = this.getMemory();

		logger.log('Got memory');

		if (!commandMemory.commandQueue.length && commandMemory.lastCheckTime < _Modules.game.time) {
			logger.log('Process colonies');
			_Modules.command.pushDataToQueue(COMMANDS.RUN_COLONIES);
			this.setChecks(true);
		}

		while (commandMemory.commandQueue && commandMemory.commandQueue.length > 0) {
			logger.log('Hitting do while loop');
			var commandData = commandMemory.commandQueue[0];
			if (commandData) {
				logger.log(`executing ${commandData.type}`);
				var Command = this.commandList.getCommand(commandData.type);
				this.execute(new Command(commandData.values));
			}
			logger.log(
				`queue length:${commandMemory.commandQueue.length} | time check: ${commandMemory.lastCheckTime < _Modules.game.time} |  ${
					commandMemory.lastCheckTime
				} < ${_Modules.game.time} | returns ${!commandMemory.commandQueue.length && commandMemory.lastCheckTime < _Modules.game.time}`
			);

			// reassign this in case anything was added during last loop
			commandMemory = this.getMemory();
		} //while (commandMemory.commandQueue && commandMemory.commandQueue.length > 0);
	};

	let commandMemory = this.getMemory();

	logger.log('commandMemory Initial');
	logger.stringify(commandMemory);

	if (!commandMemory) {
		commandMemory = {
			objectType: OBJECT_TYPE_SETTING,
			id: SETTING_ID_COMMAND_MODULE,
			commandQueue: [],
			lastCheckTime: 0,
		};

		commandMemory = this.memory.save(commandMemory);
	}
};
