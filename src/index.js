module.exports.loop = function() {
	require("./common/constants");
	var app = require("./app/app");
	app.run();
};
