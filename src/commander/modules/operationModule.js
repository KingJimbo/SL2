// resource-manager.js

module.exports = function () {
	this.initialiseSourceOperation = function ({ colonyId, sourceId }) {
		let colony = _Modules.memory.getById(OBJECT_TYPE_COLONY, colonyId);
		let source = _Modules.game.getObjectById(sourceId);
		let sourceOperation = null;

		if (source && source.id && colonyId) {
			sourceOperation = _Modules.memory.save({
				id: 0,
				objectType: OBJECT_TYPE_OPERATION,
				operationType: OPERATION_TYPE_SOURCE,
				sourceId: source.id,
				colonyId: colonyId,
				level: 0,
				roles: {},
				structures: {},
				paths: {},
			});

			if (!colony.operationIds) {
				colony.operationIds = { source: {} };
			}

			if (!colony.operationIds.source) {
				colony.operationIds.source = {};
			}

			colony.operationIds.source[`${sourceOperation.id}`] = sourceOperation.id;
			colony = _Modules.memory.save(colony);
		} else {
			logger.warning('invalid parameters passed!');
			logger.log('source: ' + JSON.stringify(source));
		}

		// how does the operation know how to operate?
		// needs creeps, creeps will have roles
		// will use structures
		// these will depend between room levels
	};

	this.runSourceOperation = ({ sourceOperationId }) => {
		let sourceOperation = _Modules.memory.getById(OBJECT_TYPE_OPERATION, sourceOperationId);

		if (!sourceOperation) {
			return;
		}

		let source = _Modules.game.getObjectById(sourceOperation.sourceId);

		if (!source) {
			return;
		}

		if (sourceOperation.level < source.room.controller.level) {
			sourceOperation = _Modules.resource.calculateSourceOperationRequirements(sourceOperationId);
		}

		let rolesToFill = sourceOperation.roles.foreach((role) => {
			if (!role.creepId & !role.pending) {
				_Modules.spawnQueue.addCreepToColonySpawnQueue(sourceOperation.colonyId, role.memory, role.body);
				role.pending = true;
			}
		});
	};

	this.createSourceOperation = function (source) {
		if (source && source.id && source.room.memory.colonyId) {
			return this.memoryManager.save({
				id: 0,
				objectType: OBJECT_TYPE_OPERATION,
				operationType: OPERATION_TYPE_SOURCE,
				sourceId: source.id,
				colonyId: source.room.memory.colonyId,
			});
		} else {
			logger.warning('invalid parameters passed!');
			logger.log('source: ' + JSON.stringify(source));
		}
	};

	this.processSourceOperation = function (sourceOperation) {
		//TODO
	};
};
