module.exports = function (args) {
	const Command = require('../command.js');

	return new Command(_Modules.operation.initialiseSourceOperation, args);
};
