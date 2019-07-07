// app.js

module.exports = function(memory, game) {
    if (!memory || !game) {
        throw ERR_MESSAGE_INVALID_ARGS;
    }

    const MemoryManager = require("./managers/memory.js");
    this.memoryManager = new MemoryManager(memory);

    //const ResourceManager = require("../managers/resource-manager.js");
    //this.resourceManager = new ResourceManager(this.memoryManager, this.game);

    const ColonyManager = require("./managers/colony-manager.js");
    this.colonyManager = new ColonyManager(
        game,
        //this.resourceManager,
        this.memoryManager
    );

    // run function will activate every loop
    this.run = function() {
        this.colonyManager.processColonies();
    };
};
