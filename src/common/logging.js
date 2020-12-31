// define a new console

(function () {
	var exLog = console.log,
		logMessages = [];
	console.log = function (msg) {
		logMessages.push(msg);
	};

	console.reportLog = function () {
		exLog.apply(this, [logMessages.join("\n")]);
	};

	console.attachLogger = function (obj) {
		if (!obj.loggerAttached) {
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
				} else if (typeof fn === "object" && fn != null && !fn.loggerAttached) {
					console.attachLogger(fn, true);
				}
			}

			obj.loggerAttached = true;
		}
	};
})();

// let oldConsole = console;

// var newConsole = {
// 	logMessages: [],
// 	log: function (text) {
// 		newConsole.logMessages.push(text);
// 		// Your code
// 	},
// 	// info: function (text) {
// 	// 	newConsole.logMessages.push(text);
// 	// 	// Your code
// 	// },
// 	// warn: function (text) {
// 	// 	newConsole.logMessages.push(text);
// 	// 	// Your code
// 	// },
// 	// error: function (text) {
// 	// 	newConsole.logMessages.push(text);
// 	// 	// Your code
// 	// },
// 	reportLog: () => {
// 		oldConsole.log(newConsole.logMessages.join("\n"));
// 	},
// 	attachLogger: (obj) => {
// 		let name, fn;
// 		for (name in obj) {
// 			fn = obj[name];
// 			if (typeof fn === "function") {
// 				obj[name] = (function (name, fn) {
// 					var args = arguments;
// 					return function () {
// 						(function (name, fn) {
// 							oldConsole.log("calling " + name);
// 						}.apply(this, args));
// 						return fn.apply(this, arguments);
// 					};
// 				})(name, fn);
// 			} else if (typeof fn === "object" && !fn.loggerAttached) {
// 				newConsole.attachLogger(fn, true);
// 			}
// 		}

// 		obj.loggerAttached = true;
// 	},
// };

// console = newConsole;

// global.newConsole = newConsole;

// module.exports = console;

// //Then redefine the old console
// window.console = console;

// // override console.log()
// var log = console.log;

// console.reportLog = () => {
// 	//old.apply(old, arguments);
// 	log.apply(log, console.logMessages.join("\n"));
// };

//console.logMessages = [];

// console.log = (message) => {
// 	console.logMessages.push(message);
// };

// console.debug = (message) => {
// 	console.logMessages.push(message);
// };

// console.attachLogger = (obj) => {
// 	let name, fn;
// 	for (name in obj) {
// 		fn = obj[name];
// 		if (typeof fn === "function") {
// 			obj[name] = (function (name, fn) {
// 				var args = arguments;
// 				return function () {
// 					(function (name, fn) {
// 						console.debug("calling " + name);
// 					}.apply(this, args));
// 					return fn.apply(this, arguments);
// 				};
// 			})(name, fn);
// 		} else if (typeof fn === "object") {
// 			console.attachLogger(fn, true);
// 		}
// 	}
// };
