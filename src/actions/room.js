const { isANumber, getRoom, getAccessiblePositions } = require("../actions/common");
const { OBJECT_TYPE } = require("../common/constants");
const { FIND_SOURCES } = require("../testing/constants");
const { getObject } = require("./memory");
const { createSourceOperation } = require("./operationSource");
const { getIdleCreep, addCreepToRoomSpawnQueue, addCreepToSpawn } = require("./roomCreepRequisition");

module.exports = {
	isRoomStructureInitialised: (structureType, x, y, roomName) => {
		console.log(`isRoomStructureInitialised start`);
		console.log(`structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		if (!roomName || !isANumber(x) || !isANumber(y) || !structureType) {
			throw new Error(`Invalid paramters: structureType ${structureType}, x ${x}, y ${y}, roomName ${roomName}`);
		}
		console.log(`isRoomStructureInitialised isvalid`);

		let room = getRoom(roomName);

		console.log(`room: ${JSON.stringify(room)}`);

		if (!room) {
			throw new Error(`Couldn't find room ${roomName}`);
		}

		if (!room.memory.positionInformation) {
			console.log(`No room positionInformation found`);
			return false;
		}

		const objects = room.lookAt(x, y);
		var foundObject = null;

		if (objects) {
			objects.forEach((object) => {
				if (object.structureType && object.structureType === structureType) {
					foundObject = object;
				}
			});
		}

		return foundObject ? true : false;
	},
	requestCreep: (room, type, memory) => {
		if (!room || !type || !memory) {
			console.log("requestCreep: invalid parameters!");
			return false;
		}

		let creep = getIdleCreep(room, type, memory);

		if (creep) {
			return creep;
		}

		return addCreepToRoomSpawnQueue(room, type, memory);
	},

	hasRoomThreats: (room) => {
		if (!room) {
			throw new Error("Invalid parameters!");
		}

		// reset every time
		room.memory.threats = {
			hasThreats: false,
			threatPositions: [],
			threatLevel: 0,
			creeps: {},
			powerCreeps: {},
		};

		// TODO make more advanced threat detection and response
		// some sort of player segregation
		// global threat level
		// manage global response

		const creepThreatFilter = (creep) => {
			if (!creep) {
				return false;
			}

			// probably need to track creep strength (i.e. threat level)
			const threatValue = creep.getActiveBodyparts(ATTACK) + creep.getActiveBodyparts(RANGED_ATTACK);
			const isHostile = threatValue > 0;

			if (isHostile) {
				creep.room.memory.threats.creeps[creep.id] = creep.id;

				creep.room.memory.threats.threatPositions.push(creep.pos);

				creep.room.memory.threats.threatLevel += threatValue;
			}

			return isHostile;
		};

		const hostileCreeps = room.find(FIND_HOSTILE_CREEPS, {
			filter: creepThreatFilter,
		});

		const hostilePowerCreeps = room.find(FIND_POWER_CREEPS, {
			filter: creepThreatFilter,
		});

		if (hostileCreeps || hostilePowerCreeps) {
			room.memory.threats.hasThreats = true;
		}

		return room.memory.threats.hasThreats;
	},

	positionHasNearbyThreat: (pos) => {
		if (!pos || !pos.x || !pos.y || !pos.roomName) {
			throw new Error(`Invalid parameters pos ${JSON.stringify(pos)}`);
		}

		let room = Game.rooms[pos.roomName];

		if (!room) {
			throw new Error(`Can't find room ${pos.roomName}`);
		}

		if (!room.memory.threats.hasThreats) {
			return false;
		}

		var roomPosition = new RoomPosition(pos.x, pos.y, pos.roomName);

		for (const i in room.memory.threats.threatPositions) {
			const threatPos = room.memory.threats.threatPositions[i];
			const threatPosition = new RoomPosition(threatPos.x, threatPos.y, threatPos.roomName);
			const pathFinderResponse = PathFinder.search(threatPosition, { pos: roomPosition, range: 1 });

			console.log(`pathFinderResponse ${JSON.stringify(pathFinderResponse)}`);

			if (pathFinderResponse && !pathFinderResponse.inComplete && pathFinderResponse.path.length < HOSTILE_CREEP_PROXIMITY_DISTANCE) {
				return true;
			}
		}

		return false;
	},

	checkSources: (room) => {
		if (!room) {
			throw new Error("Invalid parameters");
		}

		if (!room.memory.sources) {
			room.memory.sources = {};

			let sources = room.find(FIND_SOURCES);

			if (sources) {
				//console.log(`sources ${JSON.stringify(sources)}`);
				sources.forEach((source) => {
					createSourceOperation(source);
				});
			}

			return;
		}

		if (room.memory.sources) {
			//console.log(`room.memory.sources ${JSON.stringify(room.memory.sources)}`);
			for (var sourceId in room.memory.sources) {
				let sourceData = room.memory.sources[sourceId];

				if (sourceData) {
					let operation = null;

					if (sourceData.operationId) {
						operation = getObject(OBJECT_TYPE.OPERATION, sourceData.operationId);
					}

					if (!operation) {
						delete room.memory.sources[sourceId].operationId;

						let source = Game.getObjectById(sourceId);
						createSourceOperation(source);
					}
				}
			}
		}
	},

	checkCreeps: (room) => {
		if (!room) {
			throw new Error("Invalid Parameters");
		}

		if (!room.memory.creepRoles) {
			throw new Error("No creep roles detected");
		}

		for (const creepRoleName in room.memory.creepRoles) {
			const creepRole = room.memory.creepRoles[creepRoleName];

			if (creepRole && creepRole.noCreepsRequired) {
				// find creeps belonging to this role TODO make more efficient
				const creeps = room.find(FIND_MY_CREEPS, {
					filter: (creep) => {
						return creep.memory.role && creep.memory.role === creepRoleName;
					},
				});

				console.log(`creepRole ${JSON.stringify(creepRole)}, creeps ${JSON.stringify(creeps)}`);

				if (creeps && creeps.length < creepRole.noCreepsRequired) {
					for (var i = 0; i < creepRole.noCreepsRequired - creeps.length; i++) {
						if (!addCreepToSpawn(room.name, CREEP_ROLES_TYPES[creepRoleName], { role: creepRoleName, room: room.name })) {
							console.log("failed to add creep to spawn");
							return;
						}
					}
				}
			}
		}
	},

	createRoomCreepRoles: (room) => {
		if (!room) {
			throw new Error("Invalid Parameters");
		}

		if (!room.memory.creepRoles) {
			room.memory.creepRoles = {};
		}

		let sources = null;

		for (const creepRole in ROOM_CREEP_ROLE_SPAWN_CONDITIONS) {
			const creepRoleSpawnConditions = ROOM_CREEP_ROLE_SPAWN_CONDITIONS[creepRole];

			if (!creepRoleSpawnConditions) {
				throw new Error(`can't find creepRoleSpawnConditions for ${creepRole}`);
			}

			var isCreepRoleValidToSpawn = null;
			var noCreepsRequired = 0;

			console.log(`creepRole ${creepRole}`);

			creepRoleSpawnConditions.forEach((spawnConditions) => {
				var conditionResults = [];

				console.log(`spawnConditions ${JSON.stringify(spawnConditions)}`);

				for (var i = 0; i < spawnConditions.conditions.length; i++) {
					const spawnCondition = spawnConditions.conditions[i];
					let conditionResult = false;
					let conditionValueResult = 0;

					switch (spawnCondition.valueType) {
						case CONDITION_VALUE_TYPES.CONTRTRUCTION_SITE:
							const sites = room.find(FIND_MY_CONSTRUCTION_SITES);

							if (sites) {
								conditionValueResult = sites.length;
							}

							break;
						case CONDITION_VALUE_TYPES.CONTROLLER_LEVEL:
							conditionValueResult = room.controller.level;
							break;
						case CONDITION_VALUE_TYPES.CREEP_ROLE:
							const creeps = room.find(FIND_MY_CREEPS, {
								filter: (creep) => {
									return creep.memory.role === spawnCondition.creepRole;
								},
							});

							if (creeps) {
								conditionValueResult = creeps.length;
							}
							break;
						case CONDITION_VALUE_TYPES.ENERGY_TRANSPORT_REQUIRED:
							// TODO
							break;
						case CONDITION_VALUE_TYPES.ROOM_TOTAL_ENERGY_CAPACITY:
							conditionValueResult = room.energyCapacityAvailable;
							break;
						case CONDITION_VALUE_TYPES.SOURCE:
							sources = room.find(FIND_SOURCES);

							if (sources) {
								conditionValueResult = sources.length;
							}
							break;
						case CONDITION_VALUE_TYPES.SOURCE_ACCESS:
							sources = room.find(FIND_SOURCES);
							var accessPositionTotal = 0;

							if (sources) {
								//console.log(`sources ${JSON.stringify(sources)}`);
								sources.forEach((source) => {
									const freePos = getAccessiblePositions(source.pos);
									if (freePos) {
										if (!room.memory.sources) {
											room.memory.sources = {};
										}

										if (!room.memory.sources[source.id]) {
											room.memory.sources[source.id] = {
												noRequiredCreeps: freePos.length,
												currentCreeps: null,
											};
										}

										accessPositionTotal += freePos.length;
									}
								});
							}
							break;
						case CONDITION_VALUE_TYPES.STRUCTURE_TYPE:
							var structures = room.find(FIND_MY_STRUCTURES);

							if (structures) {
								conditionValueResult = structures.length;
							}
							break;
						default:
							throw new Error(`Value type not supported ${spawnCondition.valueType}`);
					}

					switch (spawnCondition.condition) {
						case CONDITIONS.EQUALS:
							if (conditionValueResult === spawnCondition.value) {
								conditionResult = true;
							}
							break;
						case CONDITIONS.LESS_THAN:
							if (conditionValueResult < spawnCondition.value) {
								conditionResult = true;
							}
							break;
						case CONDITIONS.GREATER_THAN:
							if (conditionValueResult > spawnCondition.value) {
								conditionResult = true;
							}
							break;
						case CONDITIONS.LESS_THAN_OR_EQUAL:
							if (conditionValueResult <= spawnCondition.value) {
								conditionResult = true;
							}
							break;
						case CONDITIONS.GREATER_THAN_OR_EQUAL:
							if (conditionValueResult >= spawnCondition.value) {
								conditionResult = true;
							}
							break;
						default:
							throw new Error(`Condition type not supported ${spawnCondition.condition}`);
					}

					conditionResults.push(conditionResult);
				}

				switch (spawnConditions.operator) {
					case CONDITION_OPERATORS.AND:
						conditionResults.forEach((condition) => {
							if (condition === false) {
								isCreepRoleValidToSpawn = false;
							}
						});

						if (isCreepRoleValidToSpawn === null) {
							isCreepRoleValidToSpawn = true;
						}
						break;
					case CONDITION_OPERATORS.OR:
						conditionResults.forEach((condition) => {
							if (condition === true) {
								isCreepRoleValidToSpawn = true;
							}
						});

						if (isCreepRoleValidToSpawn === null) {
							isCreepRoleValidToSpawn = false;
						}
						break;
					default:
						throw new Error(`Operator not supported ${spawnConditions.operator}`);
				}

				console.log(`conditionResults ${JSON.stringify(conditionResults)} `);
			});

			if (!isCreepRoleValidToSpawn) {
				delete room.memory.creepRoles[creepRole];
			}

			if (isCreepRoleValidToSpawn) {
				const numberCondition = ROOM_CREEP_NUMBER_CONDITIONS[creepRole];

				if (!numberCondition) {
					console.log(`No creep no. defined for ${creepRole}.`);
					break;
				}

				var noCreepsRequired = 0;

				console.log(`numberCondition ${JSON.stringify(numberCondition)}.`);

				switch (numberCondition.valueType) {
					case CONDITION_VALUE_TYPES.CONTRTRUCTION_SITE:
						const sites = room.find(FIND_MY_CONSTRUCTION_SITES);

						if (sites) {
							noCreepsRequired = sites.length;
						}

						break;
					case CONDITION_VALUE_TYPES.CONTROLLER_LEVEL:
						conditionValueResult = room.controller.level;
						break;
					case CONDITION_VALUE_TYPES.CREEP_ROLE:
						const creeps = room.find(FIND_MY_CREEPS, {
							filter: (creep) => {
								return creep.memory.role === spawnCondition.creepRole;
							},
						});

						if (creeps) {
							noCreepsRequired = creeps.length;
						}
						break;
					case CONDITION_VALUE_TYPES.ENERGY_TRANSPORT_REQUIRED:
						// TODO
						break;
					case CONDITION_VALUE_TYPES.ROOM_TOTAL_ENERGY_CAPACITY:
						noCreepsRequired = room.energyCapacityAvailable;
						break;
					case CONDITION_VALUE_TYPES.SOURCE:
						if (!sources) {
							sources = room.find(FIND_SOURCES);
						}

						if (sources) {
							noCreepsRequired = sources.length;
						}
						break;
					case CONDITION_VALUE_TYPES.SOURCE_ACCESS:
						if (!sources) {
							sources = room.find(FIND_SOURCES);
						}

						if (sources) {
							//console.log(`sources ${JSON.stringify(sources)}`);
							sources.forEach((source) => {
								const freePos = getAccessiblePositions(source.pos);
								if (freePos) {
									noCreepsRequired += freePos.length;
								}
							});
						}
						break;
					case CONDITION_VALUE_TYPES.STRUCTURE_TYPE:
						var structures = room.find(FIND_MY_STRUCTURES);

						if (structures) {
							conditionValueResult = structures.length;
						}
						break;
					default:
						throw new Error(`Value type not supported ${numberCondition["valueType"]}`);
				}

				room.memory.creepRoles[creepRole] = {
					noCreepsRequired: noCreepsRequired,
				};
			}
		}
	},

	findNextFreeSource: (room) => {
		const sources = room.find(FIND_SOURCES);

		if (sources) {
			for (const i in sources) {
				const source = sources[i];

				// check room memory for source data

				if (!room.memory.sources) {
					room.memory.sources = {};
				}

				var sourceData = room.memory.sources[source.id];

				if (!sourceData) {
					return source;
				}

				if (!sourceData.noRequiredCreeps) {
					const freePos = getAccessiblePositions(source.pos);

					sourceData.noRequiredCreeps = freePos.length;

					room.memory.sources[source.id] = sourceData;

					return source;
				}

				let creepNames = Object.keys(sourceData.currentCreeps);

				if (!creepNames) {
					return source;
				}

				creepNames.forEach((creepName) => {
					let creep = Game.creeps[creepName];

					if (!creep) {
						delete room.memory.sources[source.id].currentCreeps[creepName];
					}
				});

				creepNames = Object.keys(sourceData.currentCreeps);

				if (creepNames.length < sourceData.noRequiredCreeps) {
					return source;
				}
			}
		}

		return null;
	},
};
