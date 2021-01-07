// define a new console

(function () {
	global.logger = {};
	global.logger.logMessages = [];

	global.logger.log = function (msg) {
		global.logger.logMessages.push(msg);
	};

	global.logger.reportLog = function () {
		console.log(global.logger.logMessages.join("\n"));
	};

	global.logger.attachLogger = function (obj) {
		if (!obj.loggerAttached) {
			let name, fn;
			for (name in obj) {
				fn = obj[name];
				if (typeof fn === "function") {
					obj[name] = (function (name, fn) {
						var args = arguments;
						return function () {
							(function (name, fn) {
								global.logger.log("calling " + name);
							}.apply(this, args));
							return fn.apply(this, arguments);
						};
					})(name, fn);
				} else if (typeof fn === "object" && fn != null && !fn.loggerAttached) {
					global.logger.attachLogger(fn, true);
				}
			}

			obj.loggerAttached = true;
		}
	};
})();
