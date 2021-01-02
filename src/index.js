module.exports.loop = function () {
	// start loop

	//require("./common/logging");

	if (process.env.NODE_ENV === "development") {
		require("./common/logging");
		console.log(`Start loop`);
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
		if (console.attachLogger) console.attachLogger(global.App);
	}

	try {
		App.runApp();

		// for (var i in Game.rooms) {
		// 	let room = Game.rooms[i];
		// 	let roomStructureMap = roomSurveyModule.surveyRoomForStructures(room);
		// 	let buildQueue = roomBuildModule.createBuildQueue(room);

		// 	console.log(`buildQueue: ${JSON.stringify(buildQueue)}`);
		// }
	} catch (error) {
		const errorMessage = `An error has occured!
        message: ${error.message}
        name: ${error.name}
        error occured on file: ${error.filename} line: ${error.lineNumber} column: ${error.columnNumber}
        stacktrace: ${error.stack}`;

		console.log(errorMessage);

		if (process.env.NODE_ENV === "production") {
			Game.notify(errorMessage, 180);
		}
	}

	if (process.env.NODE_ENV === "development") {
		console.log("End loop");
		if (console.reportLog) console.reportLog();
	}
};
