// spawn-manager.js

module.exports = function(game, memoryManager, resourceManager) {
    this.game = game;
    this.memoryManager = memoryManager;
    this.resourceManager = resourceManager;

    this.spawnCreeps = function() {
        // cycle all colony spawners and spawn creeps
        let colonies = this.memoryManager.getAll(OBJECT_TYPE_COLONY);

        for (const colonyId in colonies) {
            let colony = colonies[colonyId];

            for (const spawnId in colony.structureMap.spawn) {
                let spawn = this.game.getObjectById(spawnId);

                this.spawnCreep(spawn);
            }
        }
    };

    this.spawnCreep = function(spawn) {
        // check spawn for creep template
        if (
            spawn &&
            spawn.memory &&
            spawn.memory.creepToSpawn &&
            spawn.memory.creepToSpawn.type &&
            spawn.memory.creepToSpawn.memory
        ) {
            if (!spawn.memory.creepToSpawn.body) {
                // calculate creep body
                const creepTemplate =
                    CREEP_TEMPLATES[spawn.memory.creepToSpawn.type];
                let creepBody = [],
                    bodyCostTotal = 0;
                for (const bodyPart in creepTemplate) {
                    // use spawn max energy to calculate max creep body possible
                    const creepTemplateItem = creepTemplate[bodyPart];
                    if (creepTemplateItem.value > 0) {
                        let bodyCost = BODYPART_COST[bodyPart],
                            bodyToSpend =
                                spawn.energyCapacity * creepTemplateItem.value,
                            // Round down to nearest whole no. as you don't get half a body part.
                            bodyNo = Math.floor(bodyToSpend / bodyCost);
                        if (bodyNo === 0) {
                            // no enough to add body part so return invalid target error
                            return ERR_INVALID_TARGET;
                        }

                        for (let i = 0; i < bodyNo; i++) {
                            creepBody.push(bodyPart);
                            bodyCostTotal += bodyCost;
                        }
                    }
                }
                spawn.memory.creepToSpawn.body = creepBody;
                spawn.memory.creepToSpawn.cost = bodyCostTotal;
            }

            // Double check if total capacity is enough
            if (spawn.memory.creepToSpawn.cost < spawn.energyCapacity) {
                return ERR_INVALID_TARGET;
            }

            // check if enough energy.
            if (spawn.energy < spawn.memory.creepToSpawn.cost) {
                // not enough energy so make an energy request
                // ignore if request already exists or request no longer exists
                if (
                    !spawn.memory.requestId ||
                    (spawn.memory.requestId &&
                        !this.memoryManager.getById(
                            OBJECT_TYPE_ENERGY_REQUEST,
                            spawn.memory.requestId
                        ))
                ) {
                    //TODO
                    let energyRequest = this.resourceManager.createEnergyRequest(
                        spawn.id, // destination
                        spawn.energyCapacity - spawn.energy, //energy amount
                        spawn.memory.colonyId // colony
                    );

                    if (energyRequest !== ERR_INVALID_ARGS) {
                        spawn.memory.requestId = energyRequest.id;
                    } else {
                        throw "Warning: Invalid arguments given. spawnManager.spawnCreep(spawn)";
                    }
                }
            } else {
                // spawn creep
                spawn.spawnCreep(
                    spawn.memory.creepToSpawn.body,
                    this.memoryManager.getNextCreepName(),
                    { memory: spawn.memory.creepToSpawn.memory }
                );
                // clean up
                spawn.memory.creepToSpawn = null;
                spawn.memory.requestId = 0;

                // delete request? (maybe not handle that here)

                // return success code
                return OK;
            }
        }

        // invalid parameters
        return ERR_INVALID_ARGS;
    };
};
