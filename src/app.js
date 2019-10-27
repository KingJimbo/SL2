// app.js

module.exports = function(memory, game) {
    if (!memory || !game) {
        throw ERR_MESSAGE_INVALID_ARGS;
    }

    const MemoryManager = require("./common/memory.js");
    this.memoryManager = new MemoryManager(memory);
    
    const OperationManager = require("./colony/services/operation.js");
    this.operationManager = new OperationManager(this.memoryManager, game);

    const ResourceManager = require("./colony/services/resource.js");
    this.resourceManager = new ResourceManager(this.memoryManager, game);

    const SpawnManager = require("./colony/services/resource.js");
    this.spawnManager = new SpawnManager({game: game, memoryManager: this.memoryManager, resourceManager: this.resourceManager});

    const ColonyManager = require("./colony/colony.js");
    this.colonyManager = new ColonyManager({
        game: game,
        resourceManager: this.resourceManager,
        memoryManager: this.memoryManager,
        operationManager: this.operationManager,
        spawnManager = this.spawnManager
    });

    // run function will activate every loop
    this.run = function() {
        this.colonyManager.processColonies();
    };
};
