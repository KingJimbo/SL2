module.exports.loop = function () {
	// start loop

	if (process.env.NODE_ENV === "development") {
		require("./common/logging");

		global.logger.log(`Start loop`);
	}

	require("./common/constants");

	const App = require("./app");
	require("./modules/memory");
	require("./modules/resource");
	require("./modules/spawn");

	require("./modules/creep");
	require("./modules/creepRequisition");

	require("./modules/room");
	require("./modules/roomSurvey");
	require("./modules/structure");
	require("./common/overrides");

	if (process.env.NODE_ENV === "development") {
		if (global.logger.attachLogger) global.logger.attachLogger(global.App);
	}

	try {
		App.runApp();

		// for (var i in Game.rooms) {
		// 	let room = Game.rooms[i];
		// 	let roomStructureMap = roomSurveyModule.surveyRoomForStructures(room);
		// 	let buildQueue = roomBuildModule.createBuildQueue(room);

		// 	global.logger.log(`buildQueue: ${JSON.stringify(buildQueue)}`);
		// }
	} catch (error) {
		const errorMessage = `An error has occured!
        message: ${error.message}
        name: ${error.name}
        error occured on file: ${error.filename} line: ${error.lineNumber} column: ${error.columnNumber}
        stacktrace: ${error.stack}`;

		if (process.env.NODE_ENV === "development") {
			global.logger.log(errorMessage);
		} else {
			console.log(errorMessage);
		}

		if (process.env.NODE_ENV === "production") {
			Game.notify(errorMessage, 180);
		}
	}
	//global.logger.log(`process.env.uselogging ${JSON.stringify(process.env.uselogging)}`);

	if (process.env.NODE_ENV === "development") {
		global.logger.log("End loop");
		if (global.logger.reportLog) global.logger.reportLog();
	}
};
