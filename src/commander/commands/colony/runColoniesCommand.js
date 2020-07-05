/*
    command that will add all colony check commands
*/

module.exports = function () {
	const Command = require('../command.js');
	return new Command(_Modules.colony.runColonies);
};
