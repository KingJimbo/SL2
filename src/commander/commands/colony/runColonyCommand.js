/*
    command that will add all colony check commands
*/

module.exports = function (colony) {
	const Command = require('../command.js');

	return new Command(_Modules.colony.runColony, colony);
};
