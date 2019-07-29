// resource-manager.js

module.exports = function(memoryManager, game) {
    this.memoryManager = memoryManager;
    this.game = game;

    this.createSourceOperation = function(source) {
        if(source && source.id && source.room.memory.colonyId){
            return this.memoryManager.save({
                id: 0,
                objectType: OBJECT_TYPE_OPERATION,
                operationType: OPERATION_TYPE_SOURCE,
                sourceId: source.id,
                colonyId: source.room.memory.colonyId
            });
        }
        else{
            logger.logWarning("invalid parameters passed!");
            logger.log("source: " + JSON.stringify(source));
        }
    };

    this.processSourceOperation = function(sourceOperation) {
        //TODO
    };
};
