// resource-manager.js

module.exports = function(memoryManager, game) {
    this.memoryManager = memoryManager;
    this.game = game;

    this.createSourceOperation = function(source) {
        return this.memoryManager.save({
            id: 0,
            objectType: OBJECT_TYPE_SOURCE_OPERATION,
            sourceId: source.id,
            colonyId: source.room.memory.colonyId
        });
    };

    this.processSourceOperation = function(sourceOperation) {
        //TODO
    };
};
