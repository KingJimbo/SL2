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
            spawnQueues: {
                PRIORITY_HIGH: [],
                PRIORITY_MEDIUM: [],
                PRIORITY_LOW: []
            }
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
        this.checkColonyResourceRequirements(colony);
        // check spawn queues and spawn creeps
        this.processSpawning(colony);
        // resource requests
        // priorities
        // resource out
    };

    this.checkColonyResourceRequirements = function(colony) {
        // add check if cpu is limited
        //if (!colony.lastResourceCheck || colony.lastResourceCheck) {
        //}
        // check buildings in colony
        if (!colony.structureMap) {
            this.generateColonyStructureMap(colony);
        }

        this.resourceManager.checkColonyResourceRequirements(colony);
    };

    this.processSpawning = function(colony) {
        // get all available spawns
        let spawns = [];
        for (const i in colony.structureMap[STRUCTURE_SPAWN]) {
            let spawn = this.game.getObjectById(
                colony.structureMap[STRUCTURE_SPAWN][i].id
            );

            // Check spawn is not currently spawning and is not already assigned a creep to spawn
            if (spawn.spawning === null && !spawn.memory.creepToSpawn) {
                spawns.push(spawn);
            }
        }

        if (spawns.length > 0) {
            // check colony spawn queues
            for (const i in colony.spawnQueues) {
                let spawnQueue = colony.spawnQueues[i];
                // check if any creeps are to be spawned.
                if (spawnQueue.length > 0) {
                }
            }
        }

        // select most appropriate spawn
        // pass creep template to spawn
        // cycle spawns and spawn creeps from templates
    };

    /* STRUCTURE MAP FUNCTIONS */

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
            colony.structureMap[structure.structureType][
                structure.id
            ] = this.generateStructureMapItemFromStructure(structure);
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
