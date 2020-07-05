module.exports = function (spawn) {
	const Command = require('../command.js');

	return new Command(_Modules.spawnManager.spawnCreep, spawn);
};
