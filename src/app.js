// app.js

const { runSourceOperation, runCreep, runBuildOperation } = require("./actions/run.js");
const { getCreepBody } = require("./actions/creep.js");
const { createSourceOperation } = require("./actions/operationSource.js");
const { getObjects, getObject } = require("./actions/memory.js");
const { checkOperationCreeps } = require("./actions/operationCreeps.js");
const { OBJECT_TYPE } = require("./common/constants.js");
const { hasRoomThreats } = require("./actions/room.js");
const resource = App.modules.resource;

module.exports = function () {
	if (!Memory.sources) {
		Memory.sources = {};
	}

	if (!Memory.counts) {
		Memory.counts = {};
	}

	const Move = require("./modules/move.js");
	this.move = new Move();

	const RoomSurveyor = require("./modules/roomSurveyor");
	this.roomSurveyor = new RoomSurveyor(Memory, Game);

	const RoomBuildModule = require("./modules/roomBuildModule");
	this.roomBuildModule = new RoomBuildModule();

	// run function will activate every loop
	this.run = () => {
		this.runRooms();

		this.runOperations();

		this.runCreeps();
	};

	this.runRooms = () => {
		for (const i in Game.rooms) {
			let room = Game.rooms[i];

			if (hasRoomThreats(room)) {
				// has threats to take sufficient action?
				// will need to access global threat response after all rooms processed.
			}

			if (room.controller.my) {
				// do survey if not done before or current version is newer than last survey
				if (
					!room.memory.structureMapVersion ||
					(room.memory.structureMapVersion && this.roomSurveyor.surveyVersion > room.memory.structureMapVersion)
				) {
					this.roomSurveyor.surveyRoomForStructures(room);
				}

				//console.log(`room.memory.structuresBuiltLastCheckedRoomLevel ${room.memory.structuresBuiltLastCheckedRoomLevel}`);
				//console.log(`room.controller.level ${room.controller.level}`);
				if (!room.memory.structuresBuiltLastCheckedRoomLevel || room.controller.level > room.memory.structuresBuiltLastCheckedRoomLevel) {
					this.roomBuildModule.createBuildOperations(room);
					room.memory.structuresBuiltLastCheckedRoomLevel = room.controller.level;
				}

				//this.roomBuildModule.managedConstructionSites(room);

				if (!room.memory.sources) {
					room.memory.sources = {};

					let sources = room.find(FIND_SOURCES);

					if (sources) {
						sources.forEach((source) => {
							createSourceOperation(source);
						});
					}
				}

				let spawns = room.find(FIND_MY_STRUCTURES, {
					filter: { structureType: STRUCTURE_SPAWN },
				});

				if (spawns) {
					spawns.forEach((spawn) => {
						if (!spawn.memory.creepToSpawn) {
							return;
						}

						const creepBodyResponse = getCreepBody(spawn.memory.creepToSpawn.memory.type, spawn.room.energyCapacityAvailable);
						// console.log('creep body type result:');
						//console.log(JSON.stringify(creepBodyResponse));

						const spawnCapacityUsed = spawn.store.getUsedCapacity(RESOURCE_ENERGY);
						if (creepBodyResponse.cost > spawnCapacityUsed) {
							//console.log(`not enough energy to spawnCreep | cost:${creepBodyResponse.cost} | energy:${spawnCapacityUsed}`);

							let resourceOrderId = resource.getStructureResourceOrderId(spawn, RESOURCE_ENERGY);

							if (resourceOrderId) {
								const resourceOrder = resource.getResourceOrder(resourceOrderId);

								if (resourceOrder) {
									if (!resource.orderIsValid(resourceOrder)) {
										resource.deleteOrder(resourceOrder);
										resourceOrderId = null;
									}
								}
							}

							if (!resourceOrderId) {
								resource.createResourceOrder(room, spawn.id, RESOURCE_ENERGY, creepBodyResponse.cost - spawnCapacityUsed);
							}
						} else {
							var spawnCreepResult = spawn.spawnCreep(creepBodyResponse.creepBody, this.getNextCreepName(), {
								memory: spawn.memory.creepToSpawn.memory,
							});

							//console.log(`spawnCreepResult: ${spawnCreepResult}`);
						}
					});
				}
			}
		}
	};

	this.runOperations = () => {
		let operations = getObjects(OBJECT_TYPE.OPERATION);

		if (!operations) {
			console.log(`No operations found! operations ${JSON.stringify(operations)}`);
			return;
		}

		for (const operationId in operations) {
			let operation = operations[operationId];

			if (!operation.operationType) {
				throw new Error(`operation doesn't contain an operation type!`);
			}

			checkOperationCreeps(operation);

			switch (operation.operationType) {
				case OPERATION_TYPE.BUILD:
					// do operation
					runBuildOperation(operation);
					break;
				case OPERATION_TYPE.SOURCE:
					runSourceOperation(operation);
					break;
				default:
					throw new Error(`operation type ${operation.operationType} not currently supported.`);
			}
		}
	};

	this.runCreeps = () => {
		for (const name in Game.creeps) {
			let creep = Game.creeps[name];
			runCreep(creep);
		}

		//clean up creep memory
		for (const name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
			}
		}
	};

	this.getAccessiblePositions = (pos) => {
		//console.log('Start App.getAccessiblePositions');
		//test
		if (!pos) {
			console.log("getAccessiblePositions invalid parameter");
		}

		var room = Game.rooms[pos.roomName];
		var terrain = room.getTerrain();
		var accessiblePositions = [];

		let surroundingPositions = [
			{ x: pos.x - 1, y: pos.y - 1 },
			{ x: pos.x - 1, y: pos.y },
			{ x: pos.x - 1, y: pos.y + 1 },
			{ x: pos.x, y: pos.y - 1 },
			//{ x: pos.x, y: pos.y },
			{ x: pos.x, y: pos.y + 1 },
			{ x: pos.x + 1, y: pos.y - 1 },
			{ x: pos.x + 1, y: pos.y },
			{ x: pos.x + 1, y: pos.y + 1 },
		];

		surroundingPositions.forEach((pos) => {
			const terrainGet = terrain.get(pos.x, pos.y);
			const isAccessible = pos.x >= 0 && pos.x <= 49 && pos.y >= 0 && pos.y <= 49 && terrainGet === 0;
			//console.log(`terrain.get: ${terrainGet} for ${pos.x},${pos.y} isAccessible: ${isAccessible}`);

			if (isAccessible) {
				accessiblePositions.push(pos);
			}
		});

		return accessiblePositions;
	};

	this.getNextCreepName = () => {
		//console.log('Start App.getNextCreepName');

		if (!Memory.settings) {
			Memory.settings = {
				creepCount: 0,
			};
		}

		Memory.settings.creepCount++;

		return `Creep${Memory.settings.creepCount}`;
	};
};
