/*
    command list of all different commands
*/

module.exports = function () {
	this.getCommand = (commandType) => {
		switch (commandType) {
			case COMMANDS.RUN_COLONIES:
				return require('./commands/colony/runColoniesCommand.js');
			case COMMANDS.RUN_COLONY:
				return require('./commands/colony/runColonyCommand.js');
			// case COMMANDS.MAP_COLONIES:
			// 	return require('./commands/colony/mapColoniesCommand.js');
			case COMMANDS.INITIALISE_COLONIES:
				return require('./commands/colony/initialiseColoniesCommand.js');
			case COMMANDS.INITIALISE_COLONY:
				return require('./commands/colony/initialiseColonyCommand.js');
			case COMMANDS.MAP_ROOM_TO_COLONY:
				return require('./commands/room/mapRoomToColonyCommand.js');
			case COMMANDS.INITIALISE_COLONY_OPERATIONS:
				return require('./commands/colony/initialiseColonyOperationsCommand.js');
			case COMMANDS.INITIALISE_COLONY_SOURCE_OPERATIONS:
				return require('./commands/colony/initialiseColonySourceOperationsCommand.js');
			case COMMANDS.INITIALISE_SOURCE_OPERATION:
				return require('./commands/operations/initialiseSourceOperationCommand.js');
		}
	};
};
