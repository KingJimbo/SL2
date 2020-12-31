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
		console.log("An error has occured!");
		console.log("message: " + error.message);
		console.log("name: " + error.name);
		console.log("error occured on file: " + error.filename + " line: " + error.lineNumber + " column: " + error.columnNumber);
		console.log("stacktrace " + error.stack);
	}

	if (process.env.NODE_ENV === "development") {
		console.log("End loop");
		if (console.reportLog) console.reportLog();
	}
};
