module.exports = function (dateHelper, logData = true) {
	if (!dateHelper) {
		throw new Error(ERR_MESSAGE_INVALID_ARGS);
	}

	this.dateHelper = dateHelper;
	this.logData = logData;

	this.LOG_TYPES = {
		ERROR: 'error',
		WARNING: 'warning',
		INFO: 'info',
	};

	this.attachLogger = function (obj, notRecursive) {
		if (this.logData) {
			let name, fn;
			for (name in obj) {
				fn = obj[name];
				if (typeof fn === 'function') {
					obj[name] = (function (name, fn) {
						var args = arguments;
						return function () {
							(function (name, fn) {
								console.log('calling ' + name);
							}.apply(this, args));
							return fn.apply(this, arguments);
						};
					})(name, fn);
				} else if (typeof fn === 'object' && !notRecursive) {
					this.attachLogger(fn, true);
				}
			}
		}
	};

	this.stringify = function (message, logType) {
		this.log(JSON.stringify(message, logType));
	};

	this.debug = (message) => {
		this.log(message);
	};

	this.log = function (message, logType) {
		if (this.logData) {
			//message = this.dateHelper.getCurrentDateTimeAsString() + ': ' + message;
			switch (logType) {
				case this.LOG_TYPES.ERROR:
					this.logError(message);
					break;
				case this.LOG_TYPES.WARNING:
					this.logWarning(message);
					break;
				default:
					console.log(message);
					break;
			}
		}
	};

	this.logException = function (error) {
		if (this.logData) {
			this.logError('An error has occured!');
			this.log('message: ' + error.message);
			this.log('name: ' + error.name);
			this.log('error occured on file: ' + error.filename + ' line: ' + error.lineNumber + ' column: ' + error.columnNumber);
			this.log('stacktrace ' + error.stack);
		}
	};

	this.logError = function (error) {
		if (this.logData) console.log('ERROR: ' + error);
	};

	this.warning = function (message) {
		if (this.logData) console.log('WARNING: ' + message);
	};
};
