const { CREEP_TYPES } = require("./common/constants");

module.exports.loop = function () {
	if (process.env.NODE_ENV === "development") {
		require("./common/logging");
		global.logger.log(`Start loop`, LOG_GROUPS.DEFAULT);
	}

	require("./common/constants");

	const App = require("./app");
	require("./modules/memory");
	require("./modules/resource");
	require("./modules/spawn");
	require("./modules/creep");
	require("./modules/room");
	require("./modules/roomSurvey");
	require("./modules/structure");
	require("./common/overrides");

	if (process.env.NODE_ENV === "development") {
		if (global.logger.attachLogger) global.logger.attachLogger(global.App);
	}

	try {
		// for (var creepName in Game.creeps) {
		// 	let creep = Game.creeps[creepName];

		// 	if (creep.memory.type === CREEP_TYPES.MINER) {
		// 		console.log("miner creep " + creepName);
		// 	}
		// }

		App.runApp();
	} catch (error) {
		const errorMessage = `An error has occured!
        message: ${error.message}
        name: ${error.name}
        error occured on file: ${error.filename} line: ${error.lineNumber} column: ${error.columnNumber}
        stacktrace: ${error.stack}`;

		if (process.env.NODE_ENV === "development") {
			global.logger.log(errorMessage, LOG_GROUPS.ERROR);
		} else {
			console.log(errorMessage);
		}

		if (process.env.NODE_ENV === "production") {
			Game.notify(errorMessage, 180);
		}
	}

	if (process.env.NODE_ENV === "development") {
		global.logger.log(`End loop`, LOG_GROUPS.DEFAULT);

		if (global.logger.condenseLog) {
			global.logger.reportLog();
		}
	}
};
