// app.js

module.exports = function () {
	const Move = require('./modules/move.js');
	this.move = new Move();

	const CreepRequisitioner = require('./modules/creepRequisitioner.js');
	this.creepRequisitioner = new CreepRequisitioner();

	const Resource = require('./modules/resource.js');
	this.resource = new Resource();

	// run function will activate every loop
	this.run = () => {
		if (!Memory.sources) {
			Memory.sources = {};
		}

		if (!Memory.counts) {
			Memory.counts = {};
		}

		this.runRooms();

		this.runCreeps();
	};

	this.runRooms = () => {
		for (const i in Game.rooms) {
			let room = Game.rooms[i];
			//console.log(`runRooms room: ${room.name}`);

			let sources = room.find(FIND_SOURCES);
			//console.log('after finding sources');
			if (!sources) {
				console.log(`runRooms: no sources found! room: ${room.name}`);
			} else {
				//console.log(`runRooms: no. sources found: ${sources.length}`);
				for (let j = 0; j < sources.length; j++) {
					let source = sources[j];
					//console.log(`runRooms | source: ${source.id}`);

					if (!Memory.sources[source.id]) {
						const accessPos = this.getAccessiblePositions(source.pos);
						Memory.sources[source.id] = {
							noOfAccessPos: accessPos.length,
							creepsAssigned: 0,
							creepsPending: 0,
							creepIds: {},
						};
					}

					var sourceMemory = Memory.sources[source.id];

					if (!sourceMemory.creepIds) {
						sourceMemory.creepIds = {};
					}

					// clean up dead creeps from source memory
					for (const name in sourceMemory.creepIds) {
						var creepname = sourceMemory.creepIds[name];
						let creep = Game.creeps[creepname];

						if (!creep) {
							delete sourceMemory.creepIds[name];
						}
					}

					var noCreepIds = Object.keys(sourceMemory.creepIds).length;
					sourceMemory.creepsPending = sourceMemory.noOfAccessPos - noCreepIds;
					var creepsPending = sourceMemory.creepsPending;

					for (var q = 0; q < creepsPending; q++) {
						let creep = this.creepRequisitioner.getIdleCreep(source.room, CREEP_TYPES.UTILITY, {
							role: CREEP_ROLES.HARVESTER,
							sourceId: source.id,
						});

						if (creep) {
							sourceMemory.creepIds[creep.name] = creep.name;
							noCreepIds++;
							sourceMemory.creepsPending--;
						} else {
							break;
						}
					}

					if (sourceMemory.noOfAccessPos > sourceMemory.creepsPending + noCreepIds) {
						// console.log(
						// 	`sourceMemory.noOfAccessPos:${sourceMemory.noOfAccessPos} > sourceMemory.creepsPending:${sourceMemory.creepsPending}`
						// );

						while (sourceMemory.creepsPending + noCreepIds < sourceMemory.noOfAccessPos) {
							let creep = this.creepRequisitioner.addCreepToRoomSpawnQueue(source.room, CREEP_TYPES.UTILITY, {
								role: CREEP_ROLES.HARVESTER,
								sourceId: source.id,
							});

							// if response exists but isn't spawning resonse (1) must have found idle creep
							if (creep) {
								sourceMemory.creepsPending++;
							}
						}
					}

					Memory.sources[source.id] = sourceMemory;
				}
			}

			let spawns = room.find(FIND_MY_STRUCTURES, {
				filter: { structureType: STRUCTURE_SPAWN },
			});

			if (!spawns) {
				console.log(`runRooms: No spawns found! room: ${room.name}`);
			} else {
				if (room.memory.spawnQueue && room.memory.spawnQueue.length) {
					for (let i = 0; i < spawns.length; i++) {
						let spawn = spawns[i];
						if (!spawn.memory.creepToSpawn && room.memory.spawnQueue && room.memory.spawnQueue.length) {
							spawn.memory.creepToSpawn = room.memory.spawnQueue.shift();
						}
						if (spawn.memory.creepToSpawn) {
							const creepBodyResponse = this.getCreepBody(spawn.memory.creepToSpawn.bodyType, spawn.room.energyCapacityAvailable);
							// console.log('creep body type result:');
							// console.log(JSON.stringify(creepBodyResponse));

							const spawnCapacityUsed = spawn.store.getUsedCapacity(RESOURCE_ENERGY);
							if (creepBodyResponse.cost > spawnCapacityUsed) {
								//console.log(`not enough energy to spawnCreep | cost:${creepBodyResponse.cost} | energy:${spawnCapacityUsed}`);

								if (!this.resource.getStructureResourceOrderId(spawn, RESOURCE_ENERGY)) {
									this.resource.createResourceOrder(room, spawn.id, RESOURCE_ENERGY, creepBodyResponse.cost - spawnCapacityUsed);
								}
								// if (!room.memory.energyRequests) {
								// 	room.memory.energyRequests = [];
								// }

								// room.memory.energyRequests.push({ requesterId: spawn.id, amount: creepBodyResponse.cost - spawnCapacityUsed });
							} else {
								spawn.memory.creepToSpawn.memory.type = spawn.memory.creepToSpawn.bodyType;
								var spawnCreepResult = spawn.spawnCreep(creepBodyResponse.creepBody, this.getNextCreepName(), {
									memory: spawn.memory.creepToSpawn.memory,
								});

								//console.log(`spawnCreepResult: ${spawnCreepResult}`);
							}
						}
					}
				}
			}
		}
	};

	this.runCreeps = () => {
		//console.log(`No. of creeps: ${Object.keys(Game.creeps).length}`);

		for (const name in Game.creeps) {
			let creep = Game.creeps[name];
			if (!creep.memory.role) {
				//do somehting to reassign creep
				this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
			}

			if (!creep.memory.type || creep.memory.type === 'unknown') {
				creep.memory.type = CREEP_TYPES.UTILITY;
			}
			switch (creep.memory.role) {
				case 'idle':
					this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
					creep.moveTo(0, 0);
					break;
				case CREEP_ROLES.HARVESTER:
					if (!creep.memory.currentAction) {
						creep.store.getFreeCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY)
							? (creep.memory.currentAction = 'goToSource')
							: (creep.memory.currentAction = 'goToDestination');
					}

					switch (creep.memory.currentAction) {
						case 'goToSource':
							let source = Game.getObjectById(creep.memory.sourceId);

							if (!source) {
								this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
							} else {
								// check source
								let sourceMemory = Memory.sources[source.id];
								if (!sourceMemory.creepIds[creep.name]) {
									if (Object.keys(sourceMemory.creepIds) < sourceMemory.noOfAccessPos) {
										sourceMemory.creepIds[creep.name] = creep.name;
									} else {
										this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
									}
								}
							}

							creep.moveTo(source.pos);
							if (creep.pos.isNearTo(source.pos)) {
								creep.memory.currentAction = 'harvest';
								creep.harvest(Game.getObjectById(creep.memory.sourceId));
							}

							break;
						case 'harvest':
							if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
								creep.harvest(Game.getObjectById(creep.memory.sourceId));
							} else {
								if (!creep.memory.resourceOrderItemId) {
									this.resource.findNextResourceOrderToFulfill(
										creep.room,
										creep,
										RESOURCE_ENERGY,
										creep.store.getUsedCapacity(RESOURCE_ENERGY)
									);
								}

								creep.memory.currentAction = 'goToDestination';
								let destination = this.resource.getResourceOrderItemDestination(creep.memory.resourceOrderItemId);
								creep.moveTo(destination.pos);
							}

							break;
						case 'goToDestination':
							if (!creep.memory.resourceOrderItemId) {
								if (creep.store.getFreeCapacity(RESOURCE_ENERGY) !== 0) {
									creep.memory.currentAction = 'goToSource';
								} else {
									this.resource.findNextResourceOrderToFulfill(
										creep.room,
										creep,
										RESOURCE_ENERGY,
										creep.store.getUsedCapacity(RESOURCE_ENERGY)
									);
								}
							}

							if (creep.memory.resourceOrderItemId) {
								let destination = this.resource.getResourceOrderItemDestination(creep.memory.resourceOrderItemId);
								creep.moveTo(destination.pos);
								let isNear = creep.pos.isNearTo(destination.pos);

								if (isNear) {
									let transferResult = this.resource.fulfillResourceOrderItem(creep);

									if (transferResult !== OK) {
										console.log(`transferResult: ${tranferResult}`);
									}

									creep.memory.currentAction = 'goToSource';
								}
							}

							break;
					}

					break;
			}
		}
	};

	this.getAccessiblePositions = (pos) => {
		//console.log('Start App.getAccessiblePositions');
		if (!pos) {
			console.log('getAccessiblePositions invalid parameter');
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
			console.log('not enough energy capacity to generate creep template');
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
