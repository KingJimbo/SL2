// room.js

module.exports = function ({ game, memoryManager, resourceManager, operationManager }) {
	this.memory = memoryManager;
	this.game = game;
	this.resourceManager = resourceManager;
	this.operationManager = operationManager;

	this.mapRoomToColony = function (room) {
		if (this.isRoomColony(room)) {
			var colony = this.createColony(room);
			if (colony) {
				colony.roomName = room.name;
				room.memory.colonyId = colony.id;
				colony = this.memory.save(colony);
				// this.assignColonyResources(colony);
			} else {
				logger.warning('Failed to create colony for room ' + room.name);
			}
		} else {
			logger.warning('Room ' + room.name + ' is not a colony.');
		}
	};

	this.isRoomColony = function (room) {
		if (helper.objExists(room.controller) && room.controller.my) {
			return true;
		} else {
			const spawns = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_SPAWN },
			});

			for (var i in spawns) {
				var spawn = spawns[i];
				if (spawn.my) {
					return true;
				}
			}
		}
		return false;
	};

	// Use this method to create a colony object json object from a room
	this.createColony = function (room) {
		let colony = {
			id: 0,
			objectType: OBJECT_TYPE_COLONY,
			operations: { resourceOperations: {} },
			structureMap: this.createNewStructureMap(),
			roomName: room.name,
			remoteRoomNames: [],
			resourceRequests: {},
			spawnQueues: {
				PRIORITY_HIGH: [],
				PRIORITY_MEDIUM: [],
				PRIORITY_LOW: [],
			},
		};

		// save colony to get colony id
		return this.memory.save(colony);
	};

	this.createNewStructureMap = function () {
		return {
			spawn: {},
			extension: {},
			road: {},
			constructedWall: {},
			rampart: {},
			keeperLair: {},
			portal: {},
			controller: {},
			link: {},
			storage: {},
			tower: {},
			observer: {},
			powerBank: {},
			powerSpawn: {},
			extractor: {},
			lab: {},
			terminal: {},
			container: {},
			nuker: {},
		};
	};

	this.addRoomToColony = function (colony, room) {
		// add if it doesn't exist
		//this.memory(OBJECT_TYPE_ROOMS, this.room.name)
		if (!room.memory.colonyId) {
			room.memory.colonyId = colony.id;
			colony.rooms.push(room);
			this.memory.save(colony);
		} else {
			console.log('Warning: this room is already assigned to a colony ' + room.memory.colonyId + ' cannot assign to ' + colony.id);
			//TODO: Add logic to handle room transfer
			// check colony still exists
			// check room is actually part of colony
		}
	};

	this.assignSourceOperation = function (sourceMemory) {
		// if no operation assigned
		if (sourceMemory && !sourceMemory.operationId) {
			//create operation
			const source = this.game.getObjectById(sourceMemory.id);
			if (source) {
				let colony = this.memory.getById(OBJECT_TYPE_COLONY, sourceMemory.colonyId);
				let sourceOperation = this.operationManager.createSourceOperation(source);

				if (sourceOperation) {
					// save source memory with operation id
					sourceMemory.operationId = sourceOperation.id;
					this.memory.save(sourceMemory);

					return sourceMemory;
				} else {
					log.logWarning('Failed to create source operation.');
				}
			} else {
				log.logWarning("Couldn't find source with id " + sourceMemory.id);
			}
		} else {
			log.logWarning('Invalid parameters passed.');
			log.log('sourceMemory - ' + JSON.stringify(sourceMemory));
		}

		return false;
	};

	/* STRUCTURE MAP FUNCTIONS */

	this.generateColonyStructureMap = function (colony) {
		colony.structureMap = this.createNewStructureMap();
		// find all buildings and assign to memory
		if (!colony.rooms) {
			// no rooms have been added to the colony yet so find original
			const room = this.game.rooms[colony.id];
			// add room to colony rooms
			colony.rooms.push(room.name);
			this.addRoomStructuresToColonyStructureMap(room, colony);
		} else {
			// check all rooms
			for (let i = 0; i < colony.rooms.length; i++) {
				const room = colony.rooms[i];
				this.addRoomStructuresToColonyStructureMap(room, colony);
			}
		}
	};

	this.addRoomStructuresToColonyStructureMap = function (room, colony) {
		const structures = room.find(FIND_MY_STRUCTURES);
		//add each structure to structure map
		for (const i in structures) {
			const structure = structures[i];
			colony.structureMap[structure.structureType][structure.id] = this.generateStructureMapItemFromStructure(structure);
		}
	};

	// method will create a structure map item object from structure.
	this.generateStructureMapItemFromStructure = function (structure) {
		return {
			id: structure.id,
			pos: structure.pos,
		};
	};
};
