module.exports = function (args) {
	const Command = require('../command.js');

	return new Command(_Modules.colony.initialiseColony, args);
};
