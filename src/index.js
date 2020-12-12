module.exports.loop = function () {
	var appConstants = require("./common/constants");
	global = Object.assign(global, appConstants);

	global.App = { modules: {} };
	require("./modules/resource");

	this.attachLogger = (obj) => {
		let name, fn;
		for (name in obj) {
			fn = obj[name];
			if (typeof fn === "function") {
				obj[name] = (function (name, fn) {
					var args = arguments;
					return function () {
						(function (name, fn) {
							console.log("calling " + name);
						}.apply(this, args));
						return fn.apply(this, arguments);
					};
				})(name, fn);
			} else if (typeof fn === "object") {
				this.attachLogger(fn, true);
			}
		}
	};

	console.settings = { debug: true };

	global.debug = require("./common/debug");

	const App = require("./app.js");
	let app = new App();

	// const RoomBuildModule = require("./modules/roomBuildModule");
	// let roomBuildModule = new RoomBuildModule();

	// const RoomSurveyModule = require("./modules/roomSurveyor");
	// let roomSurveyModule = new RoomSurveyModule(Memory, Game);

	if (console.settings.debug) {
		console._log = console.log;
		console.log = (message) => {
			if (console.settings.debug) {
				console._log(message);
			}
		};
		//this.attachLogger(app);
	}

	console.debug = (func) => {
		func();
	};

	console.log("loop start");

	try {
		app.run();

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
		//console.log(JSON.stringify(error));
	}

	console.log("loop end");
};
