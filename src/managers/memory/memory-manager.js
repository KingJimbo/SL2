// memory-manager.js

module.exports = function(memory) {
    this.memory = memory;

    // undefined check to see if initialisation required
    if (
        typeof this.memory === "undefined" ||
        typeof this.memory.settings === "undefined"
    ) {
        this.initialiseMemory();
    }

    this.initialiseMemory = function() {
        this.memory = {
            colonies: {}
        };
    };

    this.getAllColonies = function() {
        return this.memory.colonies;
    };

    this.addColony = function(colonyMemory) {
        this.memory.colonies[colony.id] = colonyMemory;
    };
    // add function calls to memory here
};
