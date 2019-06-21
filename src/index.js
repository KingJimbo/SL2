module.exports.loop = function() {
	console.log("loop start");
	require("./common/constants");
	console.log("import constants");
	var App = require("./app/app");
	console.log("import app");
	var app = new App(Memory, Game);
	app.run();
	console.log("loop end");
};
