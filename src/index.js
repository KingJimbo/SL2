module.exports.loop = function() {

	var Logger = require("./common/logger.js");
	var DateHelper = require("./common/dateHelper.js");
	var Helper = require("./common/helper.js");
	global.helper = new Helper();
	var logger = new Logger(new DateHelper());

	logger.log("loop start");
	require("./common/constants");
	
	var App = require("./app");
	var app = new App(Memory, Game, logger);

	try{
		logger.attachLogger(app);
		app.run();
	}
	catch(error){
		logger.logError(error);
	}

	logger.log("loop end");
};
