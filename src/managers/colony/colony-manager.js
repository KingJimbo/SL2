// colony-manager.js

module.exports = function(game, resourceManager) {
    this.game = game;
    this.resourceManager = resourceManager;

    // Use this method to create a colony object json object from a room
    this.createColony = function(room) {
        return {
            id: room.name,
            structureMap: this.createNewStructureMap(),
            rooms: []
        };
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

    this.getColonyResourceRequirements = function(colony) {
        // what requires resources
        // energy
        // - Controller
        // - Spawn

        // check buildings in colony
        if (!colony.structureMap) {
            colony.structureMap = this.createNewStructureMap();
            // find all buildings and assign to memory
            if (!colony.rooms) {
                // no rooms have been added to the colony yet so find original
                const room = this.game.rooms[colony.id];
                // add room to colony rooms
                colony.rooms.push(room.name);
                const structures = room.find(FIND_MY_STRUCTURES);
                for(const i in structures){
                    const structure = structures[i];
                    colony.structureMap[structure.structureType][structure.id] = {id: structure.id, pos: structure.pos};
                }

            } else {
                // check all rooms
                for(let i=0; i < colony.rooms.length; i++){
                    const room = colony.rooms[i];
                    const structures = room.find(FIND_MY_STRUCTURES);
                    for(const i in structures){
                        const structure = structures[i];
                        colony.structureMap[structure.structureType][structure.id] = {id: structure.id, pos: structure.pos};
                    }
                }
            }
        } else {
        }
    };

    this.createNewStructureMap = function() {
        return {
            "spawn":{},
            "extension":{},
            "road":{},
            "constructedWall":{},
            "rampart":{},
            "keeperLair":{},
            "portal":{},
            "controller":{},
            "link":{},
            "storage":{},
            "tower":{},
            "observer":{},
            "powerBank":{},
            "powerSpawn":{},
            "extractor":{},
            "lab":{},
            "terminal":{},
            "container":{},
            "nuker":{}
        };
    };

    // method will create a structure map item object from structure.
    this.generateStructureMapItemFromStructure = function(structure){
        return{
            id = structure.id,
            stru
        }
    }
};
