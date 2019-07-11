(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// app.js\r\n\r\nmodule.exports = function(memory, game) {\r\n    if (!memory || !game) {\r\n        throw ERR_MESSAGE_INVALID_ARGS;\r\n    }\r\n\r\n    const MemoryManager = __webpack_require__(/*! ./managers/memory.js */ \"./src/managers/memory.js\");\r\n    this.memoryManager = new MemoryManager(memory);\r\n\r\n    //const ResourceManager = require(\"../managers/resource-manager.js\");\r\n    //this.resourceManager = new ResourceManager(this.memoryManager, this.game);\r\n\r\n    const ColonyManager = __webpack_require__(/*! ./managers/colony-manager.js */ \"./src/managers/colony-manager.js\");\r\n    this.colonyManager = new ColonyManager(\r\n        game,\r\n        //this.resourceManager,\r\n        this.memoryManager\r\n    );\r\n\r\n    // run function will activate every loop\r\n    this.run = function() {\r\n        this.colonyManager.processColonies();\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/common/constants.js":
/*!*********************************!*\
  !*** ./src/common/constants.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/** constants.js **/\r\nglobal.CREEP_TEMPLATES = {\r\n\tCREEP_TYPE_UTILITY: {\r\n\t\tMOVE: 0.3,\r\n\t\tWORK: 0.3,\r\n\t\tCARRY: 0.3,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_MINER: {\r\n\t\tMOVE: 0.1,\r\n\t\tWORK: 0.9,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_TRANSPORTER: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0.5,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_CLAIMER: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0.5\r\n\t},\r\n\tCREEP_TYPE_MELEE: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0.5,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_RANGED: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0.5,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_TANK: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0.25,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0.25,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_HEALER: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0.5,\r\n\t\tCLAIM: 0\r\n\t}\r\n};\r\n\r\n\r\nglobal.CREEP_TYPE_UTILITY = \"utility\";\r\nglobal.CREEP_TYPE_MINER = \"miner\";\r\nglobal.CREEP_TYPE_TRANSPORTER = \"transporter\";\r\nglobal.CREEP_TYPE_CLAIMER = \"claimer\";\r\nglobal.CREEP_TYPE_MELEE = \"melee\";\r\nglobal.CREEP_TYPE_RANGED = \"ranged\";\r\nglobal.CREEP_TYPE_TANK = \"tank\";\r\nglobal.CREEP_TYPE_HEALER = \"healer\";\r\n\r\nglobal.COLONY_CREEP_QUEUE_FREE = \"free\";\r\nglobal.COLONY_CREEP_QUEUE_BUSY = \"busy\";\r\n\r\nglobal.ERR_MESSAGE_INVALID_ARGS = \"Invalid arguments have been found!\";\r\n\r\nglobal.OBJECT_TYPE_COLONY = \"colony\";\r\nglobal.OBJECT_TYPE_SOURCE_OPERATION = \"sourceOperation\";\r\nglobal.OBJECT_TYPE_SOURCE_MEMORY = \"sourceMemory\";\r\nglobal.OBJECT_TYPE_CREEP_ID = \"creepId\";\r\n\r\nglobal.PRIORITY_LOW = \"low\";\r\nglobal.PRIORITY_MEDIUM = \"medium\";\r\nglobal.PRIORITY_HIGH = \"high\";\r\n\r\nglobal.RESULT_FAILED = 0;\r\nglobal.RESULT_OK = 1;\r\n\r\n\r\n\r\n//     MOVE: \"move\",\r\n//     WORK: \"work\",\r\n//     CARRY: \"carry\",\r\n//     ATTACK: \"attack\",\r\n//     RANGED_ATTACK: \"ranged_attack\",\r\n//     TOUGH: \"tough\",\r\n//     HEAL: \"heal\",\r\n//     CLAIM: \"claim\",\r\n\n\n//# sourceURL=webpack:///./src/common/constants.js?");

/***/ }),

/***/ "./src/common/dateHelper.js":
/*!**********************************!*\
  !*** ./src/common/dateHelper.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(){\r\n\r\n    this.getCurrentDateTime = function (){\r\n        return new Date();\r\n    }\r\n\r\n    this.getCurrentDateTimeAsString = function (){\r\n        var date = new Date();\r\n        var sp = '-';\r\n        var dd = date.getDate();\r\n        var mm = date.getMonth()+1; //As January is 0.\r\n        var yyyy = date.getFullYear();\r\n\r\n        if(dd<10) dd='0'+dd;\r\n        if(mm<10) mm='0'+mm;\r\n        return (mm+sp+dd+sp+yyyy);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/common/dateHelper.js?");

/***/ }),

/***/ "./src/common/helper.js":
/*!******************************!*\
  !*** ./src/common/helper.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(){\r\n\r\n    this.objExists = function (obj){\r\n        return (typeof obj !== \"undefined\" &&\r\n            obj !== null);\r\n    }\r\n\r\n    this.getCurrentDateTimeAsString = function (){\r\n        var date = new Date();\r\n        var sp = '-';\r\n        var dd = date.getDate();\r\n        var mm = date.getMonth()+1; //As January is 0.\r\n        var yyyy = date.getFullYear();\r\n\r\n        if(dd<10) dd='0'+dd;\r\n        if(mm<10) mm='0'+mm;\r\n        return (mm+sp+dd+sp+yyyy);\r\n    }\r\n\r\n    this.getFuncName = function(fn){\r\n        var f = typeof fn == 'function';\r\n        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\\(]+)/));\r\n        return (!f && 'not a function') || (s && s[1] || 'anonymous');\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack:///./src/common/helper.js?");

/***/ }),

/***/ "./src/common/logger.js":
/*!******************************!*\
  !*** ./src/common/logger.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// window.test = function () {\r\n//     return \"works\";\r\n// }\r\n\r\n// function augment(withFn) {\r\n//     var name, fn;\r\n//     for (name in window) {\r\n//         fn = window[name];\r\n//         if (typeof fn === 'function') {\r\n//             window[name] = (function(name, fn) {\r\n//                 var args = arguments;\r\n//                 return function() {\r\n//                     withFn.apply(this, args);\r\n//                     return fn.apply(this, arguments);\r\n//                 }\r\n//             })(name, fn);\r\n//         }\r\n//     }\r\n// }\r\n\r\n// augment(function(name, fn) {\r\n//     console.log(\"calling \" + name);\r\n// });\r\n\r\n// alert(test());\r\n\r\nmodule.exports = function(dateHelper){\r\n\r\n    if(!dateHelper){\r\n        throw new Error(ERR_MESSAGE_INVALID_ARGS);\r\n    }\r\n\r\n    this.dateHelper = dateHelper;\r\n\r\n    this.LOG_TYPES = {\r\n        ERROR : 'error',\r\n        WARNING : 'warning',\r\n        INFO : 'info'\r\n    }\r\n\r\n    this.attachLogger = function (obj, notRecursive) {\r\n        let name, fn;\r\n        for (name in obj) {\r\n            fn = obj[name];\r\n            if (typeof fn === 'function') {\r\n                obj[name] = (function(name, fn) {\r\n                    var args = arguments;\r\n                    return function() {\r\n                        (function(name, fn) {\r\n                            console.log(\"calling \" + name);\r\n                       }).apply(this, args);\r\n                        return fn.apply(this, arguments);\r\n                    }\r\n                })(name, fn);\r\n            } else if(typeof fn === 'object' && !notRecursive){\r\n                this.attachLogger(fn, true);\r\n            }\r\n        }\r\n    }\r\n\r\n    this.log = function (message, logType){\r\n        //message = this.dateHelper.getCurrentDateTimeAsString() + ': ' + message;\r\n        switch(logType){\r\n            case this.LOG_TYPES.ERROR:\r\n                this.logError(message);\r\n                break;\r\n            case this.LOG_TYPES.WARNING:\r\n                this.logWarning(message);\r\n                break;\r\n            default:\r\n                console.log(message);\r\n                break;\r\n        }\r\n    }\r\n\r\n    this.logException = function (error){\r\n        this.logError('An error has occured!');\r\n        this.log('message: ' + error.message );\r\n        this.log('name: ' + error.name );\r\n        this.log('error occured on file: ' + error.filename + ' line: ' + error.lineNumber + ' column: ' + error.columnNumber );\r\n        this.log('stacktrace ' + error.stack );\r\n    }\r\n\r\n    this.logError = function (error){\r\n        console.log('ERROR: ' + message);\r\n    }\r\n\r\n    this.logWarning = function (message){\r\n        console.log('WARNING: ' + message);\r\n    }\r\n};\n\n//# sourceURL=webpack:///./src/common/logger.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports.loop = function() {\r\n\r\n\tvar Logger = __webpack_require__(/*! ./common/logger.js */ \"./src/common/logger.js\");\r\n\tvar DateHelper = __webpack_require__(/*! ./common/dateHelper.js */ \"./src/common/dateHelper.js\");\r\n\tvar Helper = __webpack_require__(/*! ./common/helper.js */ \"./src/common/helper.js\");\r\n\tglobal.helper = new Helper();\r\n\tglobal.logger = new Logger(new DateHelper());\r\n\r\n\tlogger.log(\"loop start\");\r\n\t__webpack_require__(/*! ./common/constants */ \"./src/common/constants.js\");\r\n\t\r\n\tvar App = __webpack_require__(/*! ./app */ \"./src/app.js\");\r\n\tvar app = new App(Memory, Game, logger);\r\n\r\n\ttry{\r\n\t\tlogger.attachLogger(app);\r\n\t\tapp.run();\r\n\t}\r\n\tcatch(error){\r\n\t\tlogger.logException(error);\r\n\t}\r\n\r\n\tlogger.log(\"loop end\");\r\n};\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/managers/colony-manager.js":
/*!****************************************!*\
  !*** ./src/managers/colony-manager.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// colony-manager.js\r\n\r\nmodule.exports = function(game, memoryManager, resourceManager, operationManager, structureMapper, creepManager) {\r\n\tthis.game = game;\t\r\n\tthis.memoryManager = memoryManager;\r\n\tthis.resourceManager = resourceManager;\r\n\tthis.operationManager = operationManager;\r\n\tthis.structureMapper = structureMapper;\r\n\tthis.creepManager = creepManager;\r\n\r\n\tthis.processColonies = function(){\r\n\t\tlet colonies = this.memoryManager.getAll(OBJECT_TYPE_COLONY);\r\n\r\n\t\t// if no colonies map existing owned rooms\r\n        if (!colonies) {\r\n            colonies = this.mapColonies();\r\n        }\r\n\r\n        for (const i in colonies) {\r\n\t\t\tlet colony = colonies[i];\r\n\t\t\tvar result = this.processColony(colony)\r\n\r\n            if(!result.status){\r\n\t\t\t\tlogger.logWarning(result.message);\r\n\t\t\t}\r\n        }\r\n\t}\r\n\r\n\tthis.mapColonies = function() {\r\n        for (const i in this.game.rooms) {\r\n\t\t\tconst room = this.game.rooms[i];\r\n\t\t\t\r\n            if (this.isRoomColony(room)) {\r\n\t\t\t\tthis.memoryManager.save(this.createColony(room));\r\n            }\r\n        }\r\n\r\n        return this.memoryManager.getAll(OBJECT_TYPE_COLONY);\r\n    };\r\n\r\n\r\n\r\n\t// Use this method to create a colony object json object from a room\r\n\tthis.createColony = function(room) {\r\n\t\tlet colony = {\r\n\t\t\tid: 0,\r\n\t\t\tobjectType: OBJECT_TYPE_COLONY,\r\n\t\t\tstructureMap: this.createNewStructureMap(),\r\n\t\t\troomName: room.name,\r\n\t\t\tremoteRoomNames: [],\r\n\t\t\tresourceRequests: {},\r\n\t\t\tspawnQueues: {\r\n\t\t\t\tPRIORITY_HIGH: [],\r\n\t\t\t\tPRIORITY_MEDIUM: [],\r\n\t\t\t\tPRIORITY_LOW: []\r\n\t\t\t}\r\n\t\t};\r\n\r\n\t\t// save colony to get colony id\r\n\t\tcolony = this.memoryManager.save(colony);\r\n\r\n\t\treturn colony;\r\n\t};\r\n\r\n\tthis.isRoomColony = function(room){\r\n\r\n\t\tif ((helper.objExists(room.controller) &&\r\n\t\troom.controller.my)){\r\n\t\t\treturn true;\r\n\t\t}\r\n\t\telse{\r\n\t\t\tconst spawns = room.find(FIND_MY_STRUCTURES, {\r\n\t\t\t\tfilter: { structureType: STRUCTURE_SPAWN }\r\n\t\t\t});\r\n\r\n\t\t\tfor(var i in spawns){\r\n\t\t\t\tvar spawn = spawns[i];\r\n\t\t\t\tconsole.log(\"spawn \" + i);\r\n\t\t\t\tconsole.log(JSON.stringify(spawn));\r\n\t\t\t\tif(spawn.my){\r\n\t\t\t\t\treturn true;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn false;\r\n\t}\r\n\r\n\tthis.addRoomToColony = function(colony, room) {\r\n\t\t// add if it doesn't exist\r\n\t\t//this.memoryManager(OBJECT_TYPE_ROOMS, this.room.name)\r\n\t\tif (!room.memory.colonyId) {\r\n\t\t\troom.memory.colonyId = colony.id;\r\n\t\t\tcolony.rooms.push(room);\r\n\t\t\tthis.memoryManager.save(colony);\r\n\t\t} else {\r\n\t\t\tconsole.log(\"Warning: this room is already assigned to a colony \" + room.memory.colonyId + \" cannot assign to \" + colony.id);\r\n\t\t\t//TODO: Add logic to handle room transfer\r\n\t\t\t// check colony still exists\r\n\t\t\t// check room is actually part of colony\r\n\t\t}\r\n\t};\r\n\r\n\tthis.addSourceToColony = function(colony, source) {\r\n\t\tif (colony && source) {\r\n\t\t\tif (!colony.sources) {\r\n\t\t\t\tcolony.sources = {};\r\n\t\t\t}\r\n\r\n\t\t\tif (!colony.sources[source.id]) {\r\n\t\t\t\tcolony.sources[source.id] = { id: source.id };\r\n\t\t\t}\r\n\r\n\t\t\tthis.memoryManager.save(colony);\r\n\r\n\t\t\treturn this.createSourceMemory(source);\r\n\t\t}\r\n\t};\r\n\r\n\t// this function performs all colony activities\r\n\tthis.processColony = function(colony) {\r\n\r\n\t\tif(!colony){\r\n\t\t\treturn { result: RESULT_FAILED, message: \"colonyManager.processColony() failed due to: \" + ERR_MESSAGE_INVALID_ARGS };\r\n\t\t}\r\n\t\telse{\r\n\t\t\t// start run colony\r\n\t\t\tconsole.log(\"start processing\" + colony.id);\r\n\t\t\t// // Resource check\r\n\t\t\t// this.checkColonyResourceRequirements(colony);\r\n\r\n\t\t\t// //process resources\r\n\t\t\t// this.processColonyResources(colony);\r\n\r\n\t\t\t// // check spawn queues and spawn creeps\r\n\t\t\t// this.processSpawning(colony);\r\n\t\t\t// // resource requests\r\n\t\t\t// this.processResourceRequests(colony);\r\n\t\t\t// // priorities\r\n\t\t\t// // resource out\r\n\r\n\t\t\treturn {status:RESULT_OK, message: null}\r\n\t\t}\r\n\t\t\r\n\t};\r\n\r\n\tthis.processColonyResources = function(colony) {\r\n\t\t// verify last resource check\r\n\t\tif (!colony.lastResourceCheck || colony.lastResourceCheck.level < this.game.rooms[colony.mainRoom].controller.level) {\r\n\t\t\t// find rooms for colony\r\n\t\t\tthis.addColonySources(colony);\r\n\r\n\t\t\t// TODO\r\n\t\t\t// not a problem until later levels\r\n\t\t\tthis.checkColonyMinerals(colony);\r\n\r\n\t\t\t// assign operations to resources\r\n\t\t\tthis.addSourceOperations(colony);\r\n\r\n\t\t\t//TODO\r\n\t\t\t//this.addMineralOperations(colony);\r\n\r\n\t\t\tcolony.lastResourceCheck = this.game.time;\r\n\t\t}\r\n\r\n\t\t//TODO\r\n\t\t// process sources for operations\r\n\t\tthis.processSourceOperations(colony);\r\n\r\n\t\t// save colony\r\n\t\tthis.memoryManager.save();\r\n\t};\r\n\r\n\t// Function will assign sources to colony\r\n\tthis.addColonySources = function(colony) {\r\n\t\tconst rooms = this.getColonyRooms(colony);\r\n\r\n\t\tfor (let i = 0; i < rooms.length; i++) {\r\n\t\t\t// find all resources in room\r\n\t\t\tconst room = rooms[i];\r\n\t\t\tconst sources = room.find(FIND_SOURCES);\r\n\r\n\t\t\tfor (let i = 0; i < sources.length; i++) {\r\n\t\t\t\tconst source = sources[i];\r\n\t\t\t\t// add sources to colony\r\n\t\t\t\tthis.addSourceToColony(colony, source);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\t// Function will assign minerals to colony\r\n\tthis.checkColonyMinerals = function(colony) {\r\n\t\t//TODO: add minderal logic\r\n\t\t//const minerals = room.find(FIND_MINERALS);\r\n\t};\r\n\r\n\tthis.addSourceOperations = function(colony) {\r\n\t\t// cycle through all the sources and determine if they have an operation. If not create one.\r\n\t\tfor (const sourceId in colony.sources) {\r\n\t\t\tlet sourceMemory = this.memoryManager.getById(OBJECT_TYPE_SOURCE_MEMORY, sourceId);\r\n\r\n\t\t\t// check source memory exists\r\n\t\t\tif (!sourceMemory) {\r\n\t\t\t\tconst source = this.game.getObjectById(sourceId);\r\n\t\t\t\tif (source) {\r\n\t\t\t\t\tsourceMemory = this.createSourceMemory(source);\r\n\t\t\t\t}\r\n\t\t\t}\r\n\r\n\t\t\t// if no operation assigned\r\n\t\t\tif (sourceMemory && !sourceMemory.operationId) {\r\n\t\t\t\t//create operation\r\n\t\t\t\tconst source = this.game.getObjectById(sourceId);\r\n\t\t\t\tlet sourceOperation = this.operationManager.createSourceOperation(source);\r\n\r\n\t\t\t\t// save source memory with operation id\r\n\t\t\t\tsourceMemory.operationId = sourceOperation.id;\r\n\t\t\t\tmemoryManager.save(sourceMemory);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\tthis.createSourceMemory = function(source) {\r\n\t\tif (source.room.memory.colonyId) {\r\n\t\t\treturn this.memoryManager.save({\r\n\t\t\t\tid: source.id,\r\n\t\t\t\tobjectType: OBJECT_TYPE_SOURCE_MEMORY,\r\n\t\t\t\toperationId: 0,\r\n\t\t\t\tcolonyId: source.room.memory.colonyId\r\n\t\t\t});\r\n\t\t}\r\n\r\n\t\treturn null;\r\n\t};\r\n\r\n\tthis.getColonyRooms = function(colony) {\r\n\t\tif (!colony.rooms) {\r\n\t\t\tlet rooms = [];\r\n\t\t\tfor (let i = 0; i < colony.rooms.length; i++) {\r\n\t\t\t\tconst roomName = colony.rooms[i];\r\n\t\t\t\trooms.push(this.game.rooms[roomName]);\r\n\t\t\t}\r\n\t\t\treturn rooms;\r\n\t\t}\r\n\t};\r\n\r\n\tthis.checkColonyResourceRequirements = function(colony) {\r\n\t\t// add check if cpu is limited\r\n\t\t//if (!colony.lastResourceCheck || colony.lastResourceCheck) {\r\n\t\t//}\r\n\t\t// check buildings in colony\r\n\t\tif (!colony.structureMap) {\r\n\t\t\tthis.generateColonyStructureMap(colony);\r\n\t\t}\r\n\r\n\t\tthis.resourceManager.checkColonyResourceRequirements(colony);\r\n\t};\r\n\r\n\tthis.processSpawning = function(colony) {\r\n\t\t// get all available spawns\r\n\t\tlet spawns = [];\r\n\t\tfor (const i in colony.structureMap[STRUCTURE_SPAWN]) {\r\n\t\t\tlet spawn = this.game.getObjectById(colony.structureMap[STRUCTURE_SPAWN][i].id);\r\n\r\n\t\t\t// Check spawn is not currently spawning and is not already assigned a creep to spawn\r\n\t\t\tif (spawn.spawning === null && !spawn.memory.creepToSpawn) {\r\n\t\t\t\tspawns.push(spawn);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\tif (spawns.length > 0) {\r\n\t\t\t// check colony spawn queues\r\n\t\t\tfor (let j = 0; j < spawns.length; j++) {\r\n\t\t\t\tlet spawn = spawns[j];\r\n\r\n\t\t\t\tfor (const i in colony.spawnQueues) {\r\n\t\t\t\t\tlet spawnQueue = colony.spawnQueues[i];\r\n\t\t\t\t\t// check if any creeps are to be spawned.\r\n\t\t\t\t\tif (spawnQueue.length > 0) {\r\n\t\t\t\t\t\tspawn.memory.creepToSpawn = spawnQueue.shift();\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\tthis.processSourceOperations = function(colony) {\r\n\t\t// cycle sources\r\n\t\tfor (const id in colony.sources) {\r\n\t\t\tlet sourceMemory = this.memoryManager.getById(OBJECT_TYPE_SOURCE_MEMORY, id);\r\n\t\t\tif (sourceMemory.operationId) {\r\n\t\t\t\tlet sourceOperation = this.memoryManager.getById(OBJECT_TYPE_SOURCE_OPERATION, sourceMemory.operationId);\r\n\t\t\t\tthis.operationManager.processSourceOperation(sourceOperation);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\t/* STRUCTURE MAP FUNCTIONS */\r\n\r\n\tthis.generateColonyStructureMap = function(colony) {\r\n\t\tcolony.structureMap = this.createNewStructureMap();\r\n\t\t// find all buildings and assign to memory\r\n\t\tif (!colony.rooms) {\r\n\t\t\t// no rooms have been added to the colony yet so find original\r\n\t\t\tconst room = this.game.rooms[colony.id];\r\n\t\t\t// add room to colony rooms\r\n\t\t\tcolony.rooms.push(room.name);\r\n\t\t\tthis.addRoomStructuresToColonyStructureMap(room, colony);\r\n\t\t} else {\r\n\t\t\t// check all rooms\r\n\t\t\tfor (let i = 0; i < colony.rooms.length; i++) {\r\n\t\t\t\tconst room = colony.rooms[i];\r\n\t\t\t\tthis.addRoomStructuresToColonyStructureMap(room, colony);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\tthis.addRoomStructuresToColonyStructureMap = function(room, colony) {\r\n\t\tconst structures = room.find(FIND_MY_STRUCTURES);\r\n\t\t//add each structure to structure map\r\n\t\tfor (const i in structures) {\r\n\t\t\tconst structure = structures[i];\r\n\t\t\tcolony.structureMap[structure.structureType][structure.id] = this.generateStructureMapItemFromStructure(structure);\r\n\t\t}\r\n\t};\r\n\r\n\tthis.createNewStructureMap = function() {\r\n\t\treturn {\r\n\t\t\tspawn: {},\r\n\t\t\textension: {},\r\n\t\t\troad: {},\r\n\t\t\tconstructedWall: {},\r\n\t\t\trampart: {},\r\n\t\t\tkeeperLair: {},\r\n\t\t\tportal: {},\r\n\t\t\tcontroller: {},\r\n\t\t\tlink: {},\r\n\t\t\tstorage: {},\r\n\t\t\ttower: {},\r\n\t\t\tobserver: {},\r\n\t\t\tpowerBank: {},\r\n\t\t\tpowerSpawn: {},\r\n\t\t\textractor: {},\r\n\t\t\tlab: {},\r\n\t\t\tterminal: {},\r\n\t\t\tcontainer: {},\r\n\t\t\tnuker: {}\r\n\t\t};\r\n\t};\r\n\r\n\t// method will create a structure map item object from structure.\r\n\tthis.generateStructureMapItemFromStructure = function(structure) {\r\n\t\treturn {\r\n\t\t\tid: structure.id,\r\n\t\t\tpos: structure.pos\r\n\t\t};\r\n\t};\r\n\r\n\t// function that will check all resource requests and assign any available creeps\r\n\tthis.processResourceRequests = function(colony) {\r\n\t\t// find any available creeps\r\n\t\t// prioritise transport creeps then utility creeps\r\n\t\tlet creepType = null;\r\n\t\t//TODO\r\n\t\tif (this.areAnyCreepsFree(colony, CREEP_TYPE_TRANSPORTER) === true) {\r\n\t\t\tcreepType = CREEP_TYPE_TRANSPORTER;\r\n\t\t} else if (this.areAnyCreepsFree(colony, CREEP_TYPE_UTILITY) === true) {\r\n\t\t\tcreepType = CREEP_TYPE_UTILITY;\r\n\t\t}\r\n\r\n\t\tif (creepType) {\r\n\t\t}\r\n\r\n\t\t// find all resource requests\r\n\t\t// assign available creeps to resource requests\r\n\t};\r\n\t// function to check if there are any available creeps in the free queue\r\n\tthis.areAnyCreepsFree = function(colony, creepType) {\r\n\t\t// initialise creepQueues\r\n\t\tif (!colony.creepQueues) {\r\n\t\t\tcolony.creepQueues = {};\r\n\t\t}\r\n\r\n\t\tif (!colony.creepQueues[creepType]) {\r\n\t\t\tcolony.creepQueues[creepType] = {\r\n\t\t\t\tCOLONY_CREEP_QUEUE_FREE: [],\r\n\t\t\t\tCOLONY_CREEP_QUEUE_BUSY: []\r\n\t\t\t};\r\n\t\t}\r\n\r\n\t\treturn colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].length > 0;\r\n\t};\r\n};\r\n\n\n//# sourceURL=webpack:///./src/managers/colony-manager.js?");

/***/ }),

/***/ "./src/managers/memory.js":
/*!********************************!*\
  !*** ./src/managers/memory.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// memory-manager.js\r\nmodule.exports = function(memory) {\r\n\r\n    if(!memory){\r\n        throw ERR_MESSAGE_INVALID_ARGS;\r\n    }\r\n\r\n    this.memory = memory;\r\n\r\n    this.getAll = function(objectType) {\r\n        return this.memory[objectType];\r\n    };\r\n\r\n    this.getById = function(objectType, id) {\r\n        return this.memory[objectType][id];\r\n    };\r\n    // add function calls to memory here\r\n\r\n    this.save = function(object) {\r\n        if (!object.objectType) {\r\n            throw \"Error: object does not have a valid object type.\";\r\n        }\r\n        if (!this.memory[object.objectType]) {\r\n            this.memory[object.objectType] = {};\r\n        }\r\n\r\n        // new object\r\n        if (!object.id) {\r\n            // generate id\r\n            object.id = this.getNextId(object.objectType);\r\n        }\r\n        this.memory[object.objectType][object.id] = object;\r\n        return object;\r\n    };\r\n\r\n    this.getNextId = function(objectType) {\r\n        if (!this.memory.objectIds) {\r\n            this.memory.objectIds = {};\r\n        }\r\n        if (!this.memory.objectIds[objectType]) {\r\n            this.memory.objectIds[objectType] = 0;\r\n        }\r\n        this.memory.objectIds[objectType]++;\r\n        return this.memory.objectIds[objectType];\r\n    };\r\n\r\n    this.getNextCreepName = function() {\r\n        return \"Creep_\" + this.getNextId(OBJECT_TYPE_CREEP_ID);\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./src/managers/memory.js?");

/***/ })

/******/ })));