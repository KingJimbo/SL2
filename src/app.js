// app.js

const { runSourceOperation, runCreep } = require("./actions/run.js");
const { createSourceOperation } = require("./actions/operationSource.js");

module.exports = function () {
	if (!Memory.sources) {
		Memory.sources = {};
	}

	if (!Memory.counts) {
		Memory.counts = {};
	}

	const Move = require("./modules/move.js");
	this.move = new Move();

	const CreepRequisitioner = require("./modules/creepRequisitioner.js");
	this.creepRequisitioner = new CreepRequisitioner();

	const Resource = require("./modules/resource.js");
	this.resource = new Resource();

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

			if (room.controller.my) {
				// do survey if not done before or current version is newer than last survey
				if (
					!room.memory.structureMapVersion ||
					(room.memory.structureMapVersion && this.roomSurveyor.surveyVersion > room.memory.structureMapVersion)
				) {
					this.roomSurveyor.surveyRoomForStructures(room);
				}

				if (!room.memory.structuresBuiltLastCheckedRoomLevel || room.controller.level > room.memory.structuresBuiltLastCheckedRoomLevel) {
					this.roomBuildModule.createBuildOperations(room);
				}

				this.roomBuildModule.managedConstructionSites(room);

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
						if (!spawn.creepToSpawn) {
							return;
						}

						const creepBodyResponse = this.getCreepBody(spawn.creepToSpawn.type, spawn.room.energyCapacityAvailable);
						// console.log('creep body type result:');
						// console.log(JSON.stringify(creepBodyResponse));

						const spawnCapacityUsed = spawn.store.getUsedCapacity(RESOURCE_ENERGY);
						if (creepBodyResponse.cost > spawnCapacityUsed) {
							console.log(`not enough energy to spawnCreep | cost:${creepBodyResponse.cost} | energy:${spawnCapacityUsed}`);

							if (!this.resource.getStructureResourceOrderId(spawn, RESOURCE_ENERGY)) {
								this.resource.createResourceOrder(room, spawn.id, RESOURCE_ENERGY, creepBodyResponse.cost - spawnCapacityUsed);
							}
						} else {
							spawnQueueItem.memory.type = spawnQueueItem.type;
							var spawnCreepResult = spawn.spawnCreep(creepBodyResponse.creepBody, this.getNextCreepName(), {
								memory: spawnQueueItem.memory,
							});

							console.log(`spawnCreepResult: ${spawnCreepResult}`);
						}
					});
				}
			}
		}
	};

	this.runOperations = () => {
		let operations = getObjects(OBJECT_TYPE.OPERATION);

		if (!operations || !operations.length) {
			console.log("No operations found!");
			return;
		}

		operations.forEach((operation) => {
			if (!operation.operationType) {
				throw new Error(`operation doesn't contain an operation type!`);
			}

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
		});
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

	this.getCreepBody = (creepType, availableEnergy) => {
		//console.log('Start App.getCreepBody');
		const creepTemplate = CREEP_BODIES[creepType];
		//console.log(`creep template: ${JSON.stringify(creepTemplate)}`);

		let currentCost = 0,
			creepBodyResponse = {
				creepBody: [],
				bodyCounts: {
					move: 0,
					work: 0,
					carry: 0,
					attack: 0,
					ranged_attack: 0,
					tough: 0,
					heal: 0,
					claim: 0,
					total: 0,
				},
				bodyTotal: 0,
				cost: 0,
			};

		let ratioCost = 0;

		for (const bodyPart in creepTemplate) {
			// use spawn max energy to calculate max creep body possible
			const creepTemplateItem = creepTemplate[bodyPart];

			//console.log(`creepTemplateItem: ${JSON.stringify(creepTemplateItem)}`);

			if (creepTemplateItem.value > 0) {
				let bodyCost = BODYPART_COST[bodyPart];
				// e.g. available energy * 0.3
				//bodyToSpend = availableEnergy * creepTemplateItem.value,
				// Round down to nearest whole no. as you don't get half a body part.
				//bodyNo = Math.floor(bodyToSpend / bodyCost);
				//console.log(`availableEnergy: ${availableEnergy}`);
				//console.log(`bodyPart: ${bodyPart} | bodyCost: ${bodyCost} | bodyToSpend: ${bodyToSpend} | bodyNo:${bodyNo}`);
				// if (bodyNo === 0) {
				// 	// no enough to add body part so return invalid target error
				// 	return ERR_INVALID_TARGET;
				// }

				// if (creepTemplateItem.max && bodyNo > creepTemplateItem.max) {
				// 	bodyNo = creepTemplateItem.max;
				// }

				ratioCost += bodyCost * creepTemplateItem.value;

				// for (let i = 0; i < creepTemplateItem.value; i++) {
				// 	// creepBodyResponse.creepBody.push(bodyPart);
				// 	// creepBodyResponse.bodyCounts[bodyPart]++;
				// 	// creepBodyResponse.bodyTotal++;
				// 	// creepBodyResponse.cost += bodyCost;
				// }
			}
		}

		let ratio = Math.floor(availableEnergy / ratioCost);

		if (ratio === 0) {
			console.log("not enough energy capacity to generate creep template");
			return;
		}

		for (const bodyPart in creepTemplate) {
			const creepTemplateItem = creepTemplate[bodyPart];

			if (creepTemplateItem.value > 0) {
				creepBodyResponse.bodyCounts[bodyPart] += ratio;
				creepBodyResponse.bodyTotal += ratio;

				creepBodyResponse.cost += BODYPART_COST[bodyPart] * ratio;

				for (var i = 0; i < ratio; i++) {
					creepBodyResponse.creepBody.push(bodyPart);
				}
			}
		}

		return creepBodyResponse;
	};
};
