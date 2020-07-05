(function (e, a) {
	for (var i in a) e[i] = a[i];
})(
	exports,
	/******/ (function (modules) {
		// webpackBootstrap
		/******/ // The module cache
		/******/ var installedModules = {}; // The require function
		/******/
		/******/ /******/ function __webpack_require__(moduleId) {
			/******/
			/******/ // Check if module is in cache
			/******/ if (installedModules[moduleId]) {
				/******/ return installedModules[moduleId].exports;
				/******/
			} // Create a new module (and put it into the cache)
			/******/ /******/ var module = (installedModules[moduleId] = {
				/******/ i: moduleId,
				/******/ l: false,
				/******/ exports: {},
				/******/
			}); // Execute the module function
			/******/
			/******/ /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__); // Flag the module as loaded
			/******/
			/******/ /******/ module.l = true; // Return the exports of the module
			/******/
			/******/ /******/ return module.exports;
			/******/
		} // expose the modules object (__webpack_modules__)
		/******/
		/******/
		/******/ /******/ __webpack_require__.m = modules; // expose the module cache
		/******/
		/******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
		/******/
		/******/ /******/ __webpack_require__.d = function (exports, name, getter) {
			/******/ if (!__webpack_require__.o(exports, name)) {
				/******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
				/******/
			}
			/******/
		}; // define __esModule on exports
		/******/
		/******/ /******/ __webpack_require__.r = function (exports) {
			/******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
				/******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
				/******/
			}
			/******/ Object.defineProperty(exports, '__esModule', { value: true });
			/******/
		}; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
		/******/
		/******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (value, mode) {
			/******/ if (mode & 1) value = __webpack_require__(value);
			/******/ if (mode & 8) return value;
			/******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
			/******/ var ns = Object.create(null);
			/******/ __webpack_require__.r(ns);
			/******/ Object.defineProperty(ns, 'default', { enumerable: true, value: value });
			/******/ if (mode & 2 && typeof value != 'string')
				for (var key in value)
					__webpack_require__.d(
						ns,
						key,
						function (key) {
							return value[key];
						}.bind(null, key)
					);
			/******/ return ns;
			/******/
		}; // getDefaultExport function for compatibility with non-harmony modules
		/******/
		/******/ /******/ __webpack_require__.n = function (module) {
			/******/ var getter =
				module && module.__esModule
					? /******/ function getDefault() {
							return module['default'];
					  }
					: /******/ function getModuleExports() {
							return module;
					  };
			/******/ __webpack_require__.d(getter, 'a', getter);
			/******/ return getter;
			/******/
		}; // Object.prototype.hasOwnProperty.call
		/******/
		/******/ /******/ __webpack_require__.o = function (object, property) {
			return Object.prototype.hasOwnProperty.call(object, property);
		}; // __webpack_public_path__
		/******/
		/******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
		/******/
		/******/
		/******/ /******/ return __webpack_require__((__webpack_require__.s = './src/index.js'));
		/******/
	})(
		/************************************************************************/
		/******/ {
			/***/ './src/app.js':
				/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
				/*! no static exports found */
				/***/ function (module, exports, __webpack_require__) {
					eval(
						'// app.js\r\n\r\nmodule.exports = function(memory, game) {\r\n    if (!memory || !game) {\r\n        throw ERR_MESSAGE_INVALID_ARGS;\r\n    }\r\n\r\n    const MemoryManager = __webpack_require__(/*! ./common/memory.js */ "./src/common/memory.js");\r\n    this.memoryManager = new MemoryManager(memory);\r\n    \r\n    const OperationManager = __webpack_require__(/*! ./colony/services/operation.js */ "./src/colony/services/operation.js");\r\n    this.operationManager = new OperationManager(this.memoryManager, game);\r\n\r\n    const ResourceManager = __webpack_require__(/*! ./colony/services/resource.js */ "./src/colony/services/resource.js");\r\n    this.resourceManager = new ResourceManager(this.memoryManager, game);\r\n\r\n    const SpawnManager = __webpack_require__(/*! ./colony/services/resource.js */ "./src/colony/services/resource.js");\r\n    this.spawnManager = new SpawnManager({game: game, memoryManager: this.memoryManager, resourceManager: this.resourceManager});\r\n\r\n    const ColonyManager = __webpack_require__(/*! ./colony/colony.js */ "./src/colony/colony.js");\r\n    this.colonyManager = new ColonyManager({\r\n        game: game,\r\n        resourceManager: this.resourceManager,\r\n        memoryManager: this.memoryManager,\r\n        operationManager: this.operationManager,\r\n        spawnManager : this.spawnManager\r\n    });\r\n\r\n    // run function will activate every loop\r\n    this.run = function() {\r\n        this.colonyManager.processColonies();\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./src/app.js?'
					);

					/***/
				},

			/***/ './src/colony/colony.js':
				/*!******************************!*\
  !*** ./src/colony/colony.js ***!
  \******************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						'// colony-manager.js\r\n\r\nmodule.exports = function(args){//game, memoryManager, operationManager, resourceManager, structureMapper, creepManager) {\r\n\tthis.game = args.game;\t\r\n\tthis.memory = args.memoryManager;\r\n\tthis.operationManager = args.operationManager;\r\n\tthis.resourceManager = args.resourceManager;\r\n\tthis.spawnManager = args.spawnManager;\r\n\t// this.structureMapper = args.structureMapper;\r\n\t// this.creepManager = args.creepManager;\r\n\r\n\tthis.processColonies = function(){\r\n\t\tlet colonies = this.memory.getAll(OBJECT_TYPE_COLONY);\r\n\r\n\t\t// if no colonies map existing owned rooms\r\n        if (!colonies) {\r\n            colonies = this.mapColonies();\r\n        }\r\n\r\n        for (const i in colonies) {\r\n\t\t\tlet colony = colonies[i];\r\n\t\t\tvar result = this.runColony(colony);\r\n        }\r\n\t}\r\n\r\n\tthis.mapColonies = function() {\r\n        for (const i in this.game.rooms) {\r\n\t\t\tconst room = this.game.rooms[i];\r\n\t\t\t\r\n            if (this.isRoomColony(room)) {\r\n\t\t\t\tvar colony = this.createColony(room)\r\n\t\t\t\tif(colony){\r\n\t\t\t\t\tcolony.roomName = room.name;\r\n\t\t\t\t\troom.memory.colonyId = colony.id;\r\n\t\t\t\t\tthis.memory.save(colony);\r\n\t\t\t\t\tthis.assignColonyResources(colony);\r\n\t\t\t\t}\r\n\t\t\t\telse{\r\n\t\t\t\t\tlogger.warning("Failed to create colony for room " + room.name)\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\telse{\r\n\t\t\t\tlogger.warning("Room " + room.name + " is not a colony.");\r\n\t\t\t}\r\n        }\r\n\r\n        return this.memory.getAll(OBJECT_TYPE_COLONY);\r\n\t};\r\n\r\n\tthis.assignColonyResources = function(colony) {\r\n\t\t// verify last resource check\r\n\t\tif (!colony.lastResourceCheck || \r\n\t\t\tcolony.lastResourceCheck.level < this.game.rooms[colony.mainRoom].controller.level) {\r\n\t\t\t// find rooms for colony\r\n\t\t\tthis.assignColonySources(colony);\r\n\r\n\t\t\t// TODO\r\n\t\t\t// not a problem until later levels\r\n\t\t\tthis.assignColonyMinerals(colony);\r\n\r\n\t\t\tcolony.lastResourceCheck = this.game.time;\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t// Function will assign sources to colony\r\n\tthis.assignColonySources = function(colony) {\r\n\t\tconst room = this.game.rooms[colony.roomName];\r\n\r\n\t\tconst sources = room.find(FIND_SOURCES);\r\n\r\n\t\tfor (let i = 0; i < sources.length; i++) {\r\n\t\t\tconst source = sources[i];\r\n\t\t\t// add sources to colony\r\n\t\t\tif(!this.addSourceToColony(colony, source)){\r\n\t\t\t\tlogger.warning("colonyManager.assignColonySources(colony) - Failed to add source to colony.")\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\tthis.assignColonyMinerals = function(colony){\r\n\t\tif(colony){\r\n\t\t\tconst room = this.game.rooms[colony.roomName];\r\n\r\n\t\t\tconst minerals = room.find(FIND_MINERALS);\r\n\t\r\n\t\t\tfor (let i = 0; i < minerals.length; i++) {\r\n\t\t\t\tconst mineral = minerals[i];\r\n\t\t\t\t// add sources to colony\r\n\t\t\t\tif(!this.addMineralToColony(colony, mineral)){\r\n\t\t\t\t\tlogger.warning("colonyManager.assignColonyMinerals(colony) - Failed to assign mineral " + mineral.id + \r\n\t\t\t\t\t" of type " + mineral.mineralType + " to colony " + colony.id);\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\telse{\r\n\t\t\tlogger.warning("colonyManager.assignColonyMinerals(colony) - Invalid parameters passsed.");\r\n\t\t\tlogger.log("colony - " + JSON.stringify(colony));\r\n\t\t}\r\n\r\n\t}\r\n\r\n\t//TODO\r\n\tthis.addMineralToColony = function(colony, mineral) {\r\n\t\t// if (colony && mineral) {\r\n\t\t\t\r\n\r\n\t\t// \tvar mineralMemory = this.createMineralMemory(source);\r\n\r\n\t\t// \tif(mineralMemory){\r\n\t\t// \t\tif (!colony.minerals) {\r\n\t\t// \t\t\tcolony.minerals = {};\r\n\t\t// \t\t}\r\n\t\r\n\t\t// \t\tif(!colony.minerals[mineral.mineralType]){\r\n\t\t// \t\t\tcolony.minerals[mineral.mineralType] = [];\r\n\t\t// \t\t}\r\n\r\n\t\t// \t\tcolony.minerals[mineral.mineralType].push(mineral.id);\r\n\r\n\t\t// \t\tthis.memory.save(colony);\r\n\r\n\t\t// \t\tvar mineralOperation = this.assignSourceOperation(sourceMemory);\r\n\t\t// \t\tif(sourceOperation){\r\n\t\t// \t\t\tif(!helper.objExists(colony.operations.resourceOperations[RESOURCE_ENERGY])){\r\n\t\t// \t\t\t\tcolony.operations.resourceOperations[RESOURCE_ENERGY] = [];\r\n\t\t// \t\t\t}\r\n\t\t// \t\t\tcolony.operations.resourceOperations[RESOURCE_ENERGY].push(sourceOperation.id);\r\n\t\t// \t\t\treturn memory.save(colony);\r\n\t\t// \t\t}\r\n\t\t// \t\telse{\r\n\t\t// \t\t\tlogger.warning("colonyManager.addMineralToColony(colony, mineral) - Failed to assign Source Operation to source " + source.id);\r\n\t\t// \t\t}\r\n\t\t// \t}\r\n\t\t// \telse{\r\n\t\t// \t\tlogger.warning("colonyManager.addMineralToColony(colony, mineral) - Failed to create source memory for source " + source.id);\r\n\t\t// \t}\r\n\t\t// }\r\n\t\t// else{\r\n\t\t// \tlogger.warning("colonyManager.addMineralToColony(colony, mineral) - Invalid parameters given.");\r\n\t\t// \tlogger.log("colony - " + JSON.stringify(colony));\r\n\t\t// \tlogger.log("mineral - " + JSON.stringify(mineral));\r\n\t\t// }\r\n\r\n\t\treturn false;\r\n\t};\r\n\r\n\r\n\r\n\t// Use this method to create a colony object json object from a room\r\n\tthis.createColony = function(room) {\r\n\t\tlet colony = {\r\n\t\t\tid: 0,\r\n\t\t\tobjectType: OBJECT_TYPE_COLONY,\r\n\t\t\toperations: { resourceOperations: {} },\r\n\t\t\tstructureMap: this.createNewStructureMap(),\r\n\t\t\troomName: room.name,\r\n\t\t\tremoteRoomNames: [],\r\n\t\t\tresourceRequests: {},\r\n\t\t\tspawnQueues: {\r\n\t\t\t\tPRIORITY_HIGH: [],\r\n\t\t\t\tPRIORITY_MEDIUM: [],\r\n\t\t\t\tPRIORITY_LOW: []\r\n\t\t\t}\r\n\t\t};\r\n\r\n\t\t// save colony to get colony id\r\n\t\treturn this.memory.save(colony);\r\n\t};\r\n\r\n\tthis.isRoomColony = function(room){\r\n\r\n\t\tif ((helper.objExists(room.controller) &&\r\n\t\troom.controller.my)){\r\n\t\t\treturn true;\r\n\t\t}\r\n\t\telse{\r\n\t\t\tconst spawns = room.find(FIND_MY_STRUCTURES, {\r\n\t\t\t\tfilter: { structureType: STRUCTURE_SPAWN }\r\n\t\t\t});\r\n\r\n\t\t\tfor(var i in spawns){\r\n\t\t\t\tvar spawn = spawns[i];\r\n\t\t\t\tif(spawn.my){\r\n\t\t\t\t\treturn true;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\treturn false;\r\n\t}\r\n\r\n\tthis.addRoomToColony = function(colony, room) {\r\n\t\t// add if it doesn\'t exist\r\n\t\t//this.memory(OBJECT_TYPE_ROOMS, this.room.name)\r\n\t\tif (!room.memory.colonyId) {\r\n\t\t\troom.memory.colonyId = colony.id;\r\n\t\t\tcolony.rooms.push(room);\r\n\t\t\tthis.memory.save(colony);\r\n\t\t} else {\r\n\t\t\tconsole.log("Warning: this room is already assigned to a colony " + room.memory.colonyId + " cannot assign to " + colony.id);\r\n\t\t\t//TODO: Add logic to handle room transfer\r\n\t\t\t// check colony still exists\r\n\t\t\t// check room is actually part of colony\r\n\t\t}\r\n\t};\r\n\r\n\tthis.addSourceToColony = function(colony, source) {\r\n\t\tif (colony && source) {\r\n\t\t\tif (!colony.sources) {\r\n\t\t\t\tcolony.sources = {};\r\n\t\t\t}\r\n\r\n\t\t\tvar sourceMemory = this.createResourceMemory(source);\r\n\r\n\t\t\tif(sourceMemory){\r\n\t\t\t\tcolony.sources[source.id] = { id: source.id };\r\n\t\t\t\tthis.memory.save(colony);\r\n\t\t\t\tvar sourceOperation = this.assignSourceOperation(sourceMemory);\r\n\t\t\t\tif(sourceOperation){\r\n\t\t\t\t\tif(!helper.objExists(colony.operations.resourceOperations[RESOURCE_ENERGY])){\r\n\t\t\t\t\t\tcolony.operations.resourceOperations[RESOURCE_ENERGY] = [];\r\n\t\t\t\t\t}\r\n\t\t\t\t\tcolony.operations.resourceOperations[RESOURCE_ENERGY].push(sourceOperation.id);\r\n\t\t\t\t\treturn this.memory.save(colony);\r\n\t\t\t\t}\r\n\t\t\t\telse{\r\n\t\t\t\t\tlogger.warning("colonyManager.addSourceToColony(colony, source) - Failed to assign Source Operation to source " + source.id);\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\telse{\r\n\t\t\t\tlogger.warning("colonyManager.addSourceToColony(colony, source) - Failed to create source memory for source " + source.id);\r\n\t\t\t}\r\n\t\t}\r\n\t\telse{\r\n\t\t\tlogger.warning("colonyManager.addSourceToColony(colony, source) - Invalid parameters given.");\r\n\t\t\tlogger.log("colony - " + JSON.stringify(colony));\r\n\t\t\tlogger.log("source - " + JSON.stringify(source));\r\n\t\t}\r\n\r\n\t\treturn false;\r\n\t};\r\n\r\n\r\n\tthis.assignSourceOperation = function (sourceMemory){\r\n\t\t// if no operation assigned\r\n\t\tif (sourceMemory && !sourceMemory.operationId) {\r\n\t\t\t//create operation\r\n\t\t\tconst source = this.game.getObjectById(sourceMemory.id);\r\n\t\t\tif(source){\r\n\t\t\t\tlet colony = this.memory.getById(OBJECT_TYPE_COLONY, sourceMemory.colonyId);\r\n\t\t\t\tlet sourceOperation = this.operationManager.createSourceOperation(source);\r\n\r\n\t\t\t\tif(sourceOperation){\r\n\t\t\t\t\t// save source memory with operation id\r\n\t\t\t\t\tsourceMemory.operationId = sourceOperation.id;\r\n\t\t\t\t\tthis.memory.save(sourceMemory);\r\n\t\t\t\t\t\r\n\t\t\t\t\treturn sourceMemory;\r\n\t\t\t\t}\r\n\t\t\t\telse{\r\n\t\t\t\t\tlog.logWarning("Failed to create source operation.");\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\telse{\r\n\t\t\t\tlog.logWarning("Couldn\'t find source with id " + sourceMemory.id);\r\n\t\t\t}\r\n\t\t\t\r\n\t\t}\r\n\t\telse{\r\n\t\t\tlog.logWarning("Invalid parameters passed.");\r\n\t\t\tlog.log("sourceMemory - " + JSON.stringify(sourceMemory));\r\n\t\t}\r\n\r\n\t\treturn false;\r\n\t}\r\n\r\n\tthis.runColony = function(colony){\r\n\t\t// start run colony\r\n\t\t// Resource check\r\n\t\tthis.checkColonyResourceRequirements(colony);\r\n\r\n\t\t// check spawn queues and spawn creeps\r\n\t\tthis.processSpawning(colony);\r\n\r\n\t\tthis.processResourceRequestsType(colony);\r\n\t}\r\n\r\n\t// // this function performs all colony activities\r\n\t// this.run = function(colony) {\r\n\t// \t// start run colony\r\n\t// \t// Resource check\r\n\t// \tthis.checkColonyResourceRequirements(colony);\r\n\r\n\t// \t//process resources\r\n\t// \t//this.processColonyResources(colony);\r\n\r\n\t// \t// check spawn queues and spawn creeps\r\n\t// \tthis.processSpawning(colony);\r\n\t// \t// resource requests\r\n\t// \tthis.processResourceRequests(colony);\r\n\t// \t// priorities\r\n\t// \t// resource out\r\n\t// };\t\r\n\r\n\t// // Function will assign minerals to colony\r\n\t// this.checkColonyMinerals = function(colony) {\r\n\t// \t//TODO: add minderal logic\r\n\t// \t//const minerals = room.find(FIND_MINERALS);\r\n\t// };\r\n\r\n\t// this.addSourceOperations = function(colony) {\r\n\t// \t// cycle through all the sources and determine if they have an operation. If not create one.\r\n\t// \tfor (const sourceId in colony.sources) {\r\n\t// \t\tlet sourceMemory = this.memory.getById(OBJECT_TYPE_SOURCE_MEMORY, sourceId);\r\n\r\n\t// \t\t// check source memory exists\r\n\t// \t\tif (!sourceMemory) {\r\n\t// \t\t\tconst source = this.game.getObjectById(sourceId);\r\n\t// \t\t\tif (source) {\r\n\t// \t\t\t\tsourceMemory = this.createSourceMemory(source);\r\n\t// \t\t\t}\r\n\t// \t\t}\r\n\r\n\t// \t\t// if no operation assigned\r\n\t// \t\tif (sourceMemory && !sourceMemory.operationId) {\r\n\t// \t\t\t//create operation\r\n\t// \t\t\tconst source = this.game.getObjectById(sourceId);\r\n\t// \t\t\tlet sourceOperation = this.operationManager.createSourceOperation(source);\r\n\r\n\t// \t\t\t// save source memory with operation id\r\n\t// \t\t\tsourceMemory.operationId = sourceOperation.id;\r\n\t// \t\t\tmemory.save(sourceMemory);\r\n\t// \t\t}\r\n\t// \t}\r\n\t// };\r\n\r\n\tthis.createResourceMemory = function(resource){\r\n\t\tif (resource.room.memory.colonyId) {\r\n\t\t\tvar resourceType = RESOURCE_ENERGY;\r\n\t\t\tif(resource.mineralType){\r\n\t\t\t\tresourceType = resource.mineralType;\r\n\t\t\t}\r\n\r\n\t\t\treturn this.memory.save({\r\n\t\t\t\tid: resource.id,\r\n\t\t\t\tobjectType: OBJECT_TYPE_RESOURCE,\r\n\t\t\t\tresourceType: resourceType,\r\n\t\t\t\toperationId: 0,\r\n\t\t\t\tcolonyId: resource.room.memory.colonyId\r\n\t\t\t});\r\n\t\t}\r\n\r\n\t\treturn false;\r\n\t}\r\n\r\n\tthis.getColonyRooms = function(colony) {\r\n\t\tif (!colony.rooms) {\r\n\t\t\tlet rooms = [];\r\n\t\t\tfor (let i = 0; i < colony.rooms.length; i++) {\r\n\t\t\t\tconst roomName = colony.rooms[i];\r\n\t\t\t\trooms.push(this.game.rooms[roomName]);\r\n\t\t\t}\r\n\t\t\treturn rooms;\r\n\t\t}\r\n\t};\r\n\r\n\tthis.checkColonyResourceRequirements = function(colony) {\r\n\t\t// add check if cpu is limited\r\n\t\t//if (!colony.lastResourceCheck || colony.lastResourceCheck) {\r\n\t\t//}\r\n\t\t// check buildings in colony\r\n\t\tif (!colony.structureMap) {\r\n\t\t\tthis.generateColonyStructureMap(colony);\r\n\t\t}\r\n\r\n\t\tthis.resourceManager.checkColonyResourceRequirements(colony);\r\n\t};\r\n\r\n\tthis.processSpawning = function(colony) {\r\n\t\t// get all available spawns\r\n\t\tlet spawns = [];\r\n\t\tfor (const i in colony.structureMap[STRUCTURE_SPAWN]) {\r\n\t\t\tlet spawn = this.game.getObjectById(colony.structureMap[STRUCTURE_SPAWN][i].id);\r\n\r\n\t\t\t// Check spawn is not currently spawning and is not already assigned a creep to spawn\r\n\t\t\tif (spawn.spawning === null && !spawn.memory.creepToSpawn) {\r\n\t\t\t\tspawns.push(spawn);\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\tif (spawns.length > 0) {\r\n\t\t\t// check colony spawn queues\r\n\t\t\tlet areCreepsToSpawn = true;\r\n\t\t\tfor (let j = 0; j < spawns.length && areCreepsToSpawn; j++) {\r\n\t\t\t\tlet spawn = spawns[j];\r\n\t\t\t\tlet creepToSpawn = this.getNextCreepFromSpawnQueue(colony);\r\n\t\t\t\t// assign to spawn\r\n\t\t\t\tif(creepToSpawn){\r\n\t\t\t\t\tspawn.memory.creepToSpawn = creepToSpawn;\r\n\t\t\t\t\tthis.spawnManager.spawnCreep(spawn);\r\n\t\t\t\t}\r\n\t\t\t\telse{\r\n\t\t\t\t\t// ran out of creeps to spawn so bail\r\n\t\t\t\t\tareCreepsToSpawn = false;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\tthis.getNextCreepFromSpawnQueue = function(colony){\r\n\t\tif(colony){\r\n\t\t\t// get spawn queues\r\n\t\t\t// high\r\n\t\t\tlet highQueue = colony.spawnQueue[PRIORITY_HIGH];\r\n\t\t\tif(highQueue){\r\n\t\t\t\treturn highQueue.shift();\r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t// medium\r\n\t\t\tlet medQueue = colony.spawnQueue[PRIORITY_MEDIUM];\r\n\t\t\tif(medQueue){\r\n\t\t\t\treturn medQueue.shift();\r\n\t\t\t}\r\n\t\t\t\r\n\t\t\t// low\r\n\t\t\tlet lowQueue = colony.spawnQueue[PRIORITY_LOW];\r\n\t\t\tif(lowQueue){\r\n\t\t\t\treturn lowQueue.shift();\r\n\t\t\t}\r\n\t\t}\r\n\t\telse{\r\n\t\t\tlogger.warning("Invalid parameter Colony:");\r\n\t\t\tlogger.log(JSON.stringify(colony));\r\n\t\t}\r\n\t}\r\n\r\n\tthis.processSourceOperations = function(colony) {\r\n\t\t// cycle sources\r\n\t\tfor (const id in colony.sources) {\r\n\t\t\tlet sourceMemory = this.memory.getById(OBJECT_TYPE_SOURCE_MEMORY, id);\r\n\t\t\tif (sourceMemory.operationId) {\r\n\t\t\t\tlet sourceOperation = this.memory.getById(OBJECT_TYPE_SOURCE_OPERATION, sourceMemory.operationId);\r\n\t\t\t\tthis.operationManager.processSourceOperation(sourceOperation);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\t/* STRUCTURE MAP FUNCTIONS */\r\n\r\n\tthis.generateColonyStructureMap = function(colony) {\r\n\t\tcolony.structureMap = this.createNewStructureMap();\r\n\t\t// find all buildings and assign to memory\r\n\t\tif (!colony.rooms) {\r\n\t\t\t// no rooms have been added to the colony yet so find original\r\n\t\t\tconst room = this.game.rooms[colony.id];\r\n\t\t\t// add room to colony rooms\r\n\t\t\tcolony.rooms.push(room.name);\r\n\t\t\tthis.addRoomStructuresToColonyStructureMap(room, colony);\r\n\t\t} else {\r\n\t\t\t// check all rooms\r\n\t\t\tfor (let i = 0; i < colony.rooms.length; i++) {\r\n\t\t\t\tconst room = colony.rooms[i];\r\n\t\t\t\tthis.addRoomStructuresToColonyStructureMap(room, colony);\r\n\t\t\t}\r\n\t\t}\r\n\t};\r\n\r\n\tthis.addRoomStructuresToColonyStructureMap = function(room, colony) {\r\n\t\tconst structures = room.find(FIND_MY_STRUCTURES);\r\n\t\t//add each structure to structure map\r\n\t\tfor (const i in structures) {\r\n\t\t\tconst structure = structures[i];\r\n\t\t\tcolony.structureMap[structure.structureType][structure.id] = this.generateStructureMapItemFromStructure(structure);\r\n\t\t}\r\n\t};\r\n\r\n\tthis.createNewStructureMap = function() {\r\n\t\treturn {\r\n\t\t\tspawn: {},\r\n\t\t\textension: {},\r\n\t\t\troad: {},\r\n\t\t\tconstructedWall: {},\r\n\t\t\trampart: {},\r\n\t\t\tkeeperLair: {},\r\n\t\t\tportal: {},\r\n\t\t\tcontroller: {},\r\n\t\t\tlink: {},\r\n\t\t\tstorage: {},\r\n\t\t\ttower: {},\r\n\t\t\tobserver: {},\r\n\t\t\tpowerBank: {},\r\n\t\t\tpowerSpawn: {},\r\n\t\t\textractor: {},\r\n\t\t\tlab: {},\r\n\t\t\tterminal: {},\r\n\t\t\tcontainer: {},\r\n\t\t\tnuker: {}\r\n\t\t};\r\n\t};\r\n\r\n\t// method will create a structure map item object from structure.\r\n\tthis.generateStructureMapItemFromStructure = function(structure) {\r\n\t\treturn {\r\n\t\t\tid: structure.id,\r\n\t\t\tpos: structure.pos\r\n\t\t};\r\n\t};\r\n\r\n\t// function that will check all resource requests and assign any available creeps\r\n\tthis.processResourceRequestsType = function(colony) {\r\n\t\t\r\n\t\tfor(var type in colony.resourceRequests){\r\n\t\t\tvar resourceRequestType = colony.resourceRequests[type];\r\n\t\t\t\r\n\t\t\tvar highPriorityRequests = resourceRequestType[PRIORITY_HIGH];\r\n\t\t\tthis.processResourceRequests(highPriorityRequests);\r\n\t\t\tvar mediumPriorityRequests = resourceRequestType[PRIORITY_MEDIUM];\r\n\t\t\tthis.processResourceRequests(mediumPriorityRequests);\r\n\t\t\tvar lowPriorityRequests = resourceRequestType[PRIORITY_LOW];\r\n\t\t\tthis.processResourceRequests(lowPriorityRequests);\r\n\t\t}\r\n\t};\r\n\r\n\tthis.processResourceRequests = function(resourceRequests){\r\n\t\tif(resourceRequests){\r\n\t\t\tfor(const i in resourceRequests){\r\n\t\t\t\tvar resourceRequest = resourceRequests[i];\r\n\r\n\t\t\t\t// prefer a transporter over utility\r\n\t\t\t\tvar creep = this.getNextAvailableCreep(colony, CREEP_TYPE_TRANSPORTER);\r\n\r\n\t\t\t\tif(!creep){\r\n\t\t\t\t\tcreep = this.getNextAvailableCreep(colony, CREEP_TYPE_UTILITY);\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif(creep){\r\n\t\t\t\t\tthis.assignResourceRequestToCreep(resourceRequest, creep);\r\n\t\t\t\t}\r\n\t\t\t\telse{\r\n\t\t\t\t\t// TODO no creeps so create a spawning request\r\n\t\t\t\t}\r\n\t\t\t\t\r\n\t\t\t\tthrow new Error("TODO");\r\n\t\t\t}\r\n\t\t}\r\n\t\telse{\r\n\t\t\tlogger.warning("Invalid parameter resourceRequests");\r\n\t\t\tlogger.log(JSON.stringify(resourceRequests));\r\n\t\t}\r\n\t}\r\n\r\n\tthis.getNextAvailableCreep = function(colony, creepType){\r\n\t\tif(colony){\r\n\t\t\tlet creepFound = false,\r\n\t\t\t\tnoCreeps = false;\r\n\t\t\twhile(!creepFound){\r\n\t\t\t\tvar creepName = this.getNextFreeCreepFrom(colony, creepType);\r\n\r\n\t\t\t\t// creepName found in queue\r\n\t\t\t\tif(creepName){\r\n\t\t\t\t\tvar creep = this.game.creeps[creepName];\r\n\t\t\t\t\tif(creep){\r\n\t\t\t\t\t\treturn creep;\r\n\t\t\t\t\t}\r\n\t\t\t\t\telse{\r\n\t\t\t\t\t\tlogger.warning("Missing Creep detected name: " + creepName);\r\n\t\t\t\t\t\t// TODO need a missing creep handler\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t\telse{\r\n\t\t\t\t\t// no creep name found so queue empty\r\n\t\t\t\t\treturn;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\telse{\r\n\t\t\tlogger.warning("Invalid parameter colony");\r\n\t\t\tlogger.log(JSON.stringify(colony));\r\n\t\t}\r\n\t}\r\n\r\n\r\n\r\n\tthis.assignResourceRequestToCreep= function(resourceRequest, creep){\r\n\r\n\t\tthrow new Error("TODO")\r\n\t}\r\n\r\n\t// function to check if there are any available creeps in the free queue\r\n\tthis.areAnyCreepsFree = function(colony, creepType) {\r\n\t\t// initialise creepQueues\r\n\t\tif (!colony.creepQueues) {\r\n\t\t\tcolony.creepQueues = {};\r\n\t\t}\r\n\r\n\t\tif (!colony.creepQueues[creepType]) {\r\n\t\t\tcolony.creepQueues[creepType] = {\r\n\t\t\t\tCOLONY_CREEP_QUEUE_FREE: [],\r\n\t\t\t\tCOLONY_CREEP_QUEUE_BUSY: []\r\n\t\t\t};\r\n\t\t}\r\n\r\n\t\treturn colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].length > 0;\r\n\t};\r\n\r\n\tthis.getNextFreeCreepFrom = function(colony, creepType){\r\n\t\t// initialise creepQueues\r\n\t\tif (!colony.creepQueues) {\r\n\t\t\tcolony.creepQueues = {};\r\n\t\t}\r\n\r\n\t\tif (!colony.creepQueues[creepType]) {\r\n\t\t\tcolony.creepQueues[creepType] = {\r\n\t\t\t\tCOLONY_CREEP_QUEUE_FREE: [],\r\n\t\t\t\tCOLONY_CREEP_QUEUE_BUSY: []\r\n\t\t\t};\r\n\t\t}\r\n\r\n\t\tif(colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE]){\r\n\t\t\tvar creep = colony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].shift();\r\n\t\t\tcolony.creepQueues[creepType][COLONY_CREEP_QUEUE_FREE].push(creep);\r\n\t\t\tthis.memory.save(colony);\r\n\t\t\treturn creep;\r\n\t\t}\r\n\r\n\t\treturn;\r\n\t}\r\n};\r\n\n\n//# sourceURL=webpack:///./src/colony/colony.js?'
					);

					/***/
				},

			/***/ './src/colony/services/operation.js':
				/*!******************************************!*\
  !*** ./src/colony/services/operation.js ***!
  \******************************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						'// resource-manager.js\r\n\r\nmodule.exports = function(memoryManager, game) {\r\n    this.memoryManager = memoryManager;\r\n    this.game = game;\r\n\r\n    this.createSourceOperation = function(source) {\r\n        if(source && source.id && source.room.memory.colonyId){\r\n            return this.memoryManager.save({\r\n                id: 0,\r\n                objectType: OBJECT_TYPE_OPERATION,\r\n                operationType: OPERATION_TYPE_SOURCE,\r\n                sourceId: source.id,\r\n                colonyId: source.room.memory.colonyId\r\n            });\r\n        }\r\n        else{\r\n            logger.warning("invalid parameters passed!");\r\n            logger.log("source: " + JSON.stringify(source));\r\n        }\r\n    };\r\n\r\n    this.processSourceOperation = function(sourceOperation) {\r\n        //TODO\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./src/colony/services/operation.js?'
					);

					/***/
				},

			/***/ './src/colony/services/resource.js':
				/*!*****************************************!*\
  !*** ./src/colony/services/resource.js ***!
  \*****************************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						'// resource-manager.js\r\n\r\nmodule.exports = function(memoryManager, game) {\r\n\tthis.memoryManager = memoryManager;\r\n\tthis.game = game;\r\n\r\n\tthis.createResourceRequest = function(args){//colonyId, pos, amount, type, priority) {\r\n\t\t// validate parameters\r\n\t\tif (args.colonyId && args.pos && args.type && args.priority) {\r\n\t\t\tlet colony = this.memoryManager.getById(OBJECT_TYPE_COLONY, args.colonyId);\r\n\t\t\tif (!args.priority) {\r\n\t\t\t\targs.priority = PRIORITY_LOW;\r\n\t\t\t}\r\n\t\t\tthis.checkColonyResourceRequests(colony, args.type, args.priority);\r\n\r\n\t\t\tcolony.resourceRequests[args.type][args.priority].push({\r\n\t\t\t\tdestinationPos: args.pos,\r\n\t\t\t\tamount: args.amount\r\n\t\t\t});\r\n\r\n\t\t\treturn this.memoryManager.save(colony);\r\n\t\t} else {\r\n\t\t\tlogger.warning("Invalid parameters passed");\r\n\t\t\tlogger.log("args: " + JSON.stringify(args));\r\n\t\t}\r\n\t};\r\n\r\n\t\r\n\t// this.assignCreepsToResourceRequests = function(colony, creepNames) {\r\n\t// \t//TODO\r\n\t// \tlet resourceRequests;\r\n\r\n\t// \twhile (creepNames.length > 0) {}\r\n\t// };\r\n\r\n\tthis.checkColonyResourceRequests = function(colony, type, priority) {\r\n\t\tif (!colony.resourceRequests) {\r\n\t\t\tcolony.resourceRequests = {};\r\n\t\t}\r\n\r\n\t\tif (!colony.resourceRequests[type]) {\r\n\t\t\tcolony.resourceRequests[type] = {};\r\n\t\t}\r\n\r\n\t\tif (!colony.resourceRequests[type][priority]) {\r\n\t\t\tcolony.resourceRequests[type][priority] = [];\r\n\t\t}\r\n\t};\r\n\r\n\tthis.getColonyResourceRequests = function(colony, type, priority) {\r\n\t\tthis.checkColonyResourceRequests(colony, type, priority);\r\n\t\treturn colony.resourceRequests[type][priority];\r\n\t};\r\n\r\n\t// search structure map to find all structures and check what resources they need\r\n\tthis.checkColonyResourceRequirements = function(colony) {\r\n\t\tif (colony.structureMap) {\r\n\t\t\tfor (const i in colony.structureMap) {\r\n\t\t\t\tconst structureMapItem = colony.structureMap[i];\r\n\t\t\t\tfor (const id in structureMapItem) {\r\n\t\t\t\t\tconst structure = this.game.getObjectById(id);\r\n\t\t\t\t\tlet resourceRequest = null;\r\n\t\t\t\t\tswitch (structure.structureType) {\r\n\t\t\t\t\t\tcase STRUCTURE_SPAWN:\r\n\t\t\t\t\t\t\tresourceRequest = this.determineSpawnRequirements(structure);\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase STRUCTURE_CONTROLLER:\r\n\t\t\t\t\t\t\tresourceRequest = this.determineControllerRequirements(structure);\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t}\r\n\r\n\t\t\t\t\tif(!resourceRequest){\r\n\t\t\t\t\t\tlogger.warning("Failed to determine resource requirements for.")\r\n\t\t\t\t\t\tlogger.log("structure: " + JSON.stringify(structure));\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t\t// save all changes to colony\r\n\t\tthis.memoryManager.save(colony);\r\n\t};\r\n\r\n\tthis.determineSpawnRequirements = function(spawn) {\r\n\t\t// check if a creep is scheduled to be spawned & hasn\'t made a request yet\r\n\t\tif (spawn.memory.creepToSpawn && !spawn.memory.requestId) {\r\n\t\t\tlet amount = spawn.energyCapacity - spawn.energy;\r\n\t\t\treturn this.createResourceRequest(spawn.room.colonyId, spawn.pos, amount, RESOURCE_ENERGY, spawn.memory.creepToSpawn.priority);\r\n\t\t}\r\n\t};\r\n\r\n\tthis.determineControllerRequirements = function(controller) {\r\n\t\t// check if controller is max level\r\n\t\tif (controller.level < 8) {\r\n\t\t\treturn this.createResourceRequest(controller.room.colonyId, controller.pos, 0, RESOURCE_ENERGY, PRIORITY_LOW);\r\n\t\t}\r\n\t\t//\r\n\t};\r\n};\r\n\n\n//# sourceURL=webpack:///./src/colony/services/resource.js?'
					);

					/***/
				},

			/***/ './src/common/constants.js':
				/*!*********************************!*\
  !*** ./src/common/constants.js ***!
  \*********************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						'/** constants.js **/\r\nglobal.CREEP_TEMPLATES = {\r\n\tCREEP_TYPE_UTILITY: {\r\n\t\tMOVE: 0.3,\r\n\t\tWORK: 0.3,\r\n\t\tCARRY: 0.3,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_MINER: {\r\n\t\tMOVE: 0.1,\r\n\t\tWORK: 0.9,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_TRANSPORTER: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0.5,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_CLAIMER: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0.5\r\n\t},\r\n\tCREEP_TYPE_MELEE: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0.5,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_RANGED: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0.5,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_TANK: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0.25,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0.25,\r\n\t\tHEAL: 0,\r\n\t\tCLAIM: 0\r\n\t},\r\n\tCREEP_TYPE_HEALER: {\r\n\t\tMOVE: 0.5,\r\n\t\tWORK: 0,\r\n\t\tCARRY: 0,\r\n\t\tATTACK: 0,\r\n\t\tRANGED_ATTACK: 0,\r\n\t\tTOUGH: 0,\r\n\t\tHEAL: 0.5,\r\n\t\tCLAIM: 0\r\n\t}\r\n};\r\n\r\n\r\nglobal.CREEP_TYPE_UTILITY = "utility";\r\nglobal.CREEP_TYPE_MINER = "miner";\r\nglobal.CREEP_TYPE_TRANSPORTER = "transporter";\r\nglobal.CREEP_TYPE_CLAIMER = "claimer";\r\nglobal.CREEP_TYPE_MELEE = "melee";\r\nglobal.CREEP_TYPE_RANGED = "ranged";\r\nglobal.CREEP_TYPE_TANK = "tank";\r\nglobal.CREEP_TYPE_HEALER = "healer";\r\n\r\nglobal.COLONY_CREEP_QUEUE_FREE = "free";\r\nglobal.COLONY_CREEP_QUEUE_BUSY = "busy";\r\n\r\nglobal.ERR_MESSAGE_INVALID_ARGS = "Invalid arguments have been found!";\r\n\r\nglobal.OBJECT_TYPE_COLONY = "colony";\r\nglobal.OBJECT_TYPE_RESOURCE = "resource";\r\nglobal.OBJECT_TYPE_SOURCE_OPERATION = "sourceOperation";\r\nglobal.OBJECT_TYPE_OPERATION = "operation";\r\n//global.OBJECT_TYPE_SOURCE_MEMORY = "sourceMemory";\r\nglobal.OBJECT_TYPE_CREEP_ID = "creepId";\r\n\r\nglobal.OPERATION_TYPE_SOURCE = "source";\r\n\r\nglobal.PRIORITY_LOW = "low";\r\nglobal.PRIORITY_MEDIUM = "medium";\r\nglobal.PRIORITY_HIGH = "high";\r\n\r\nglobal.RESULT_FAILED = 0;\r\nglobal.RESULT_OK = 1;\r\n\r\nif(!RESOURCE_ENERGY){\r\n\tglobal.RESOURCE_ENERGY = "energy";\r\n}\r\n\r\n\r\n\r\n//     MOVE: "move",\r\n//     WORK: "work",\r\n//     CARRY: "carry",\r\n//     ATTACK: "attack",\r\n//     RANGED_ATTACK: "ranged_attack",\r\n//     TOUGH: "tough",\r\n//     HEAL: "heal",\r\n//     CLAIM: "claim",\r\n\n\n//# sourceURL=webpack:///./src/common/constants.js?'
					);

					/***/
				},

			/***/ './src/common/dateHelper.js':
				/*!**********************************!*\
  !*** ./src/common/dateHelper.js ***!
  \**********************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						"module.exports = function(){\r\n\r\n    this.getCurrentDateTime = function (){\r\n        return new Date();\r\n    }\r\n\r\n    this.getCurrentDateTimeAsString = function (){\r\n        var date = new Date();\r\n        var sp = '-';\r\n        var dd = date.getDate();\r\n        var mm = date.getMonth()+1; //As January is 0.\r\n        var yyyy = date.getFullYear();\r\n\r\n        if(dd<10) dd='0'+dd;\r\n        if(mm<10) mm='0'+mm;\r\n        return (mm+sp+dd+sp+yyyy);\r\n    }\r\n}\n\n//# sourceURL=webpack:///./src/common/dateHelper.js?"
					);

					/***/
				},

			/***/ './src/common/helper.js':
				/*!******************************!*\
  !*** ./src/common/helper.js ***!
  \******************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						"module.exports = function(){\r\n\r\n    this.objExists = function (obj){\r\n        return (typeof obj !== \"undefined\" &&\r\n            obj !== null);\r\n    }\r\n\r\n    this.getCurrentDateTimeAsString = function (){\r\n        var date = new Date();\r\n        var sp = '-';\r\n        var dd = date.getDate();\r\n        var mm = date.getMonth()+1; //As January is 0.\r\n        var yyyy = date.getFullYear();\r\n\r\n        if(dd<10) dd='0'+dd;\r\n        if(mm<10) mm='0'+mm;\r\n        return (mm+sp+dd+sp+yyyy);\r\n    }\r\n\r\n    this.getFuncName = function(fn){\r\n        var f = typeof fn == 'function';\r\n        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\\(]+)/));\r\n        return (!f && 'not a function') || (s && s[1] || 'anonymous');\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack:///./src/common/helper.js?"
					);

					/***/
				},

			/***/ './src/common/logger.js':
				/*!******************************!*\
  !*** ./src/common/logger.js ***!
  \******************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						"module.exports = function(dateHelper){\r\n\r\n    if(!dateHelper){\r\n        throw new Error(ERR_MESSAGE_INVALID_ARGS);\r\n    }\r\n\r\n    this.dateHelper = dateHelper;\r\n\r\n    this.LOG_TYPES = {\r\n        ERROR : 'error',\r\n        WARNING : 'warning',\r\n        INFO : 'info'\r\n    }\r\n\r\n    this.attachLogger = function (obj, notRecursive) {\r\n        let name, fn;\r\n        for (name in obj) {\r\n            fn = obj[name];\r\n            if (typeof fn === 'function') {\r\n                obj[name] = (function(name, fn) {\r\n                    var args = arguments;\r\n                    return function() {\r\n                        (function(name, fn) {\r\n                            console.log(\"calling \" + name);\r\n                       }).apply(this, args);\r\n                        return fn.apply(this, arguments);\r\n                    }\r\n                })(name, fn);\r\n            } else if(typeof fn === 'object' && !notRecursive){\r\n                this.attachLogger(fn, true);\r\n            }\r\n        }\r\n    }\r\n\r\n    this.log = function (message, logType){\r\n        //message = this.dateHelper.getCurrentDateTimeAsString() + ': ' + message;\r\n        switch(logType){\r\n            case this.LOG_TYPES.ERROR:\r\n                this.logError(message);\r\n                break;\r\n            case this.LOG_TYPES.WARNING:\r\n                this.logWarning(message);\r\n                break;\r\n            default:\r\n                console.log(message);\r\n                break;\r\n        }\r\n    }\r\n\r\n    this.logException = function (error){\r\n        this.logError('An error has occured!');\r\n        this.log('message: ' + error.message );\r\n        this.log('name: ' + error.name );\r\n        this.log('error occured on file: ' + error.filename + ' line: ' + error.lineNumber + ' column: ' + error.columnNumber );\r\n        this.log('stacktrace ' + error.stack );\r\n    }\r\n\r\n    this.logError = function (error){\r\n        console.log('ERROR: ' + message);\r\n    }\r\n\r\n    this.logWarning = function (message){\r\n        console.log('WARNING: ' + message);\r\n    }\r\n};\n\n//# sourceURL=webpack:///./src/common/logger.js?"
					);

					/***/
				},

			/***/ './src/common/memory.js':
				/*!******************************!*\
  !*** ./src/common/memory.js ***!
  \******************************/
				/*! no static exports found */
				/***/ function (module, exports) {
					eval(
						'// memory-manager.js\r\nmodule.exports = function(memory) {\r\n\r\n    if(!memory){\r\n        throw ERR_MESSAGE_INVALID_ARGS;\r\n    }\r\n\r\n    this.memory = memory;\r\n\r\n    this.getAll = function(objectType) {\r\n        return this.memory[objectType];\r\n    };\r\n\r\n    this.getById = function(objectType, id) {\r\n        return this.memory[objectType][id];\r\n    };\r\n    // add function calls to memory here\r\n\r\n    this.save = function(object) {\r\n        if (!object.objectType) {\r\n            throw new Error("Error: object does not have a valid object type.");\r\n        }\r\n        if (!this.memory[object.objectType]) {\r\n            this.memory[object.objectType] = {};\r\n        }\r\n\r\n        // new object\r\n        if (!object.id) {\r\n            // generate id\r\n            object.id = this.getNextId(object.objectType);\r\n        }\r\n        this.memory[object.objectType][object.id] = object;\r\n        return object;\r\n    };\r\n\r\n    this.getNextId = function(objectType) {\r\n        if (!this.memory.objectIds) {\r\n            this.memory.objectIds = {};\r\n        }\r\n        if (!this.memory.objectIds[objectType]) {\r\n            this.memory.objectIds[objectType] = 0;\r\n        }\r\n        this.memory.objectIds[objectType]++;\r\n        return this.memory.objectIds[objectType];\r\n    };\r\n\r\n    this.getNextCreepName = function() {\r\n        return "Creep_" + this.getNextId(OBJECT_TYPE_CREEP_ID);\r\n    };\r\n};\r\n\n\n//# sourceURL=webpack:///./src/common/memory.js?'
					);

					/***/
				},

			/***/ './src/index.js':
				/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
				/*! no static exports found */
				/***/ function (module, exports, __webpack_require__) {
					eval(
						'module.exports.loop = function() {\r\n\r\n\tvar Logger = __webpack_require__(/*! ./common/logger.js */ "./src/common/logger.js");\r\n\tvar DateHelper = __webpack_require__(/*! ./common/dateHelper.js */ "./src/common/dateHelper.js");\r\n\tvar Helper = __webpack_require__(/*! ./common/helper.js */ "./src/common/helper.js");\r\n\tglobal.helper = new Helper();\r\n\tglobal.logger = new Logger(new DateHelper());\r\n\r\n\tlogger.log("loop start");\r\n\t__webpack_require__(/*! ./common/constants */ "./src/common/constants.js");\r\n\t\r\n\tvar App = __webpack_require__(/*! ./app */ "./src/app.js");\r\n\tvar app = new App(Memory, Game, logger);\r\n\r\n\ttry{\r\n\t\tlogger.attachLogger(app);\r\n\t\tapp.run();\r\n\t}\r\n\tcatch(error){\r\n\t\tlogger.logException(error);\r\n\t}\r\n\r\n\tlogger.log("loop end");\r\n};\r\n\n\n//# sourceURL=webpack:///./src/index.js?'
					);

					/***/
				},

			/******/
		}
	)
);
