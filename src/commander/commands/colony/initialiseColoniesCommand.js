module.exports = function () {
	const Command = require('../command.js');

	return new Command(_Modules.colony.initialiseColonies);
};
