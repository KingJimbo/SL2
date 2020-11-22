module.exports.loop = function () {
	require("./common/constants.js");

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

	const RoomSurveyor = require("./modules/roomSurveyor");
	let roomSurveyor = new RoomSurveyor(Memory, Game);

	if (console.settings.debug) {
		console._log = console.log;
		console.log = (message) => {
			if (console.settings.debug) {
				console._log(message);
			}
		};
		//this.attachLogger(app);
		//this.attachLogger(roomSurveyor);
	}

	console.debug = (func) => {
		func();
	};

	console.log("loop start");

	try {
		//app.run();
		for (var roomName in Game.rooms) {
			let room = Game.rooms[roomName];
			roomSurveyor.surveyRoom(room);
		}
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
