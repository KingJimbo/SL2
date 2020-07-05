/*
    command that will add all colony check commands
*/

module.exports = function (room) {
	const Command = require('../command.js');

	return new Command(_Modules.room.mapRoomToColony, room);
};
