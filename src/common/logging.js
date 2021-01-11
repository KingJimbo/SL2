// define a new console

(function () {
	global.logger = {};
	global.logger.logMessages = [];
	global.logger.condenseLog = false;

	const logTypes = {
		LOG_GROUPS: {
			ALL: "all",
			CREEP: "creep",
			DEFAULT: "default",
			ERROR: "error",
			PICKUP: "pickup",
			POSITION: "position",
			RESOURCE: "resource",
			ROOM: "room",
			SPAWN: "spawn",
			TRANSFER: "transfer",
			WITHDRAW: "withdraw",
		},
	};

	global = Object.assign(global, logTypes);

	global.logger.allowedGroups = {
		all: false,
		creep: false,
		default: true,
		error: true,
		pickup: false,
		position: false,
		spawn: false,
		room: false,
		resource: false,
		transfer: false,
		withdraw: false,
	};

	global.logger.log = function (msg, logTypes) {
		// default
		let isAllowed = global.logger.allowedGroups.all;

		if (logTypes) {
			if (Array.isArray(logTypes)) {
				for (const i in logTypes) {
					const logType = logTypes[i];
					const logTypeAllowed = global.logger.allowedGroups[logType];

					if (logTypeAllowed) {
						isAllowed = true;
					}
				}
			} else {
				const logType = logTypes;
				const logTypeAllowed = global.logger.allowedGroups[logType];

				if (logTypeAllowed) {
					isAllowed = true;
				}
			}
		}

		if (isAllowed) {
			if (global.logger.condenseLog) {
				global.logger.logMessages.push(msg);
			} else {
				console.log(msg);
			}
		}
	};

	global.logger.reportLog = function () {
		const log = global.logger.logMessages.join("\n");

		if (!log || log != "") {
			console.log(log);
		}
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
								global.logger.log("calling " + name, LOG_GROUPS.DEFAULT);
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
