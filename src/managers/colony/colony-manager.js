// colony-manager.js

module.exports = function(game, resourceManager, memoryManager) {
	this.game = game;
	this.resourceManager = resourceManager;
	this.memoryManager = memoryManager;

	// Use this method to create a colony object json object from a room
	this.createColony = function(room) {
		let colony = {
			id: 0,
			objectType: OBJECT_TYPE_COLONY,
			structureMap: this.createNewStructureMap(),
			mainRoom: room.name,
			rooms: [],
			resourceRequests: {},
			spawnQueues: {}
		};

		colony = this.memoryManager.save(colony);
		this.addRoomToColony(room);

		return colony;
	};

	this.addRoomToColony = function(colony, room) {
		// add if it doesn't exist
		if (!room.memory.colonyId) {
			this.room.memory.colonyId = colony.id;
			colony.rooms.push(room);
			this.memoryManager.save(colony);
		} else {
			console.log("Warning: this room is already assigned to a colony.");
			//TODO: Add logic to handle room transfer
		}
	};

	// this function performs all colony activities
	this.run = function(colony) {
		// start run colony
		// Resource check
		// buildings
		// check colony memory
		// creeps
		// resource requests
		// priorities
		// resource out
	};

	this.checkColonyResourceRequirements = function(colony) {
		// what requires resources
		// energy
		// - Controller
		// - Spawn

		// check buildings in colony
		if (!colony.structureMap) {
			this.generateColonyStructureMap(colony);
		}

		this.resourceManager.checkColonyResourceRequirements(colony);
	};

	this.generateColonyStructureMap = function(colony) {
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

	this.addRoomStructuresToColonyStructureMap = function(room, colony) {
		const structures = room.find(FIND_MY_STRUCTURES);
		//add each structure to structure map
		for (const i in structures) {
			const structure = structures[i];
			colony.structureMap[structure.structureType][structure.id] = this.generateStructureMapItemFromStructure(structure);
		}
	};

	this.createNewStructureMap = function() {
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
			nuker: {}
		};
	};

	// method will create a structure map item object from structure.
	this.generateStructureMapItemFromStructure = function(structure) {
		return {
			id: structure.id,
			pos: structure.pos
		};
	};
};
