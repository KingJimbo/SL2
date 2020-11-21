// module.exports = (() => {
// 	// global._console = console;

// 	// global.console = {};

// 	console.settings = {
// 		debug: true,
// 	};

// 	console.log = (message) => {
// 		if (console.settings.debug) {
// 			console.log(message);
// 		}
// 	};

// 	// console.debug = (message) => {
// 	// 	if (console.settings.debug) {
// 	// 		_console.log(message);
// 	// 	}
// 	// };

// 	function attachLogger(obj) {
// 		if (console.settings.debug) {
// 			let name, fn;
// 			for (name in obj) {
// 				fn = obj[name];
// 				if (typeof fn === 'function') {
// 					obj[name] = (function (name, fn) {
// 						var args = arguments;
// 						return function () {
// 							(function (name, fn) {
// 								console.log('calling ' + name);
// 							}.apply(this, args));
// 							return fn.apply(this, arguments);
// 						};
// 					})(name, fn);
// 				} else if (typeof fn === 'object') {
// 					this.attachLogger(fn, true);
// 				}
// 			}
// 		}
// 	}

// 	console.log('attach logger run');

// 	attachLogger(app);
// })();
