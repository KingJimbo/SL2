const App = require("./app");
const config = require("./config/config");

module.exports.loop = function () {
	if (process.env.NODE_ENV === "development") {
		require("./common/logging");
		global.logger.log(`Start loop`, LOG_GROUPS.DEFAULT);
	}

	try {
		var app = new App();

		if (process.env.NODE_ENV === "development") {
			if (global.logger.attachLogger) global.logger.attachLogger(app);
		}

		app.runApp(Memory, Game, config);
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
