(() => {
	const { getAccessiblePositions } = require("../common/position");
	var { creepRequisitionModule } = global.App;

	let roomModule = {
		runRooms: () => {
			for (const i in Game.rooms) {
				let room = Game.rooms[i];

				roomModule.runRoom(room);
			}
		}, // runRooms END

		runRoom: (room) => {
			if (roomModule.surveyRoomThreats(room)) {
				// do any initial threat actions
			}

			if (room.controller.my) {
				let { roomSurveyModule } = global.App;

				roomSurveyModule.surveyRoomForStructures(room);

				// delete requests and start fresh every time
				//delete room.memory.resourceRequests;

				room.memory.requests = {
					build: {},
					claimController: {},
					dismantle: {},
					drop: {},
					harvest: {},
					pickup: {},
					repair: {},
					reserveController: {},
					signController: {},
					transfer: {},
					upgradeController: {},
					withdraw: {},
				};

				//roomModule.createRoomCreepRoles(room);

				//roomModule.checkCreeps(room);

				roomModule.checkRoomSites(room);

				roomModule.checkRoomStructures(room);
			}
		}, // runRoom

		/// Survey a room for any hostile creeps and assign threats to room memory
		surveyRoomThreats: (room) => {
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
		}, // surveyRoomThreats END

		checkRoomSites: (room) => {
			// don't add construction site orders until level 2
			if (room.controller.level > 1) {
				let sites = room.find(FIND_MY_CONSTRUCTION_SITES);

				//console.log(`sites ${JSON.stringify(sites)}`);

				if (!sites || sites.length === 0) {
					//console.log(`build next site`);
					roomModule.buildNextSite(room);

					sites = room.find(FIND_MY_CONSTRUCTION_SITES);

					if (!sites || sites.length === 0) {
						roomModule.addCommonRoads(room);
					}

					return;
				}

				const { resourceModule } = global.App;

				sites.forEach((site) => {
					const progressLeft = site.progressTotal - site.progress;

					if (progressLeft > 0) {
						if (process.env.NODE_ENV === "development") {
							console.log(`adding site request`);
						}

						resourceModule.addStructureResourceRequest(site, RESOURCE_ENERGY, progressLeft);
					}
				});
			}
		}, // checkRoomSites END

		checkRoomStructures: (room) => {
			// don't add construction site orders until level 2
			const structures = room.find(FIND_MY_STRUCTURES);

			//console.log(`sites ${JSON.stringify(sites)}`);

			if (!structures || structures.length === 0) {
				if (process.env.NODE_ENV === "development") {
					console.log("No structures found!");
				}

				return;
			}

			const { resourceModule, spawnModule, structureModule } = global.App;

			structures.forEach((structure) => {
				structureModule.checkStructure(structure);

				switch (structure.structureType) {
					case STRUCTURE_SPAWN:
						spawnModule.runSpawn(structure);
						break;
					case STRUCTURE_EXTENSION:
						structureModule.runExtension(structure);
						break;
					case STRUCTURE_ROAD:
						structureModule.runRoad(structure);
						break;
					case STRUCTURE_WALL:
						structureModule.runWall(structure);
						break;
					case STRUCTURE_RAMPART:
						structureModule.runRampart(structure);
						break;
					// case STRUCTURE_LINK:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					// case STRUCTURE_STORAGE:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					case STRUCTURE_TOWER:
						structureModule.runTower(structure);
						break;
					// case STRUCTURE_OBSERVER:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					// case STRUCTURE_POWER_SPAWN:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					// case STRUCTURE_EXTRACTOR:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					// case STRUCTURE_LAB:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					// case STRUCTURE_TERMINAL:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					case STRUCTURE_CONTAINER:
						structureModule.runContainer(structure);
						break;
					// case STRUCTURE_NUKER:
					// 	spawnModule.runSpawn(structure);
					// 	break;
					// case STRUCTURE_FACTORY:
					// 	spawnModule.runSpawn(structure);
					//     break;
					default:
						// do nothing
						if (process.env.NODE_ENV === "development") {
							console.log(`We don't currently do anything with structure type: ${structure.structureType}`);
						}
						break;
				}
			});
		}, // checkRoomStructures END

		buildNextSite: (room) => {
			if (!room || !room.memory.structureMap) {
				throw new Error(`Invalid structureMap! room ${JSON.stringify(room)}`);
			}

			let structureBuilt = false,
				structureIndex = 0;

			while (!structureBuilt && structureIndex < STRUCTURE_PRIORITY.length) {
				const structureType = STRUCTURE_PRIORITY[structureIndex];
				let structTypeArray = [];

				if (process.env.NODE_ENV === "development") {
					console.log(`structureType: ${structureType}`);
				}

				if (!room.memory.structureMap[structureType]) {
					console.log(`No room structureMap contains no structureType of ${structureType}`);
					structureIndex++;
					continue;
				}

				let availableNoOfStructures = CONTROLLER_STRUCTURES[structureType][room.controller.level],
					totalCurrentStructures = 0;
				if (process.env.NODE_ENV === "development") {
					console.log(`availableNoOfStructures: ${availableNoOfStructures}`);
				}

				const structures = room.find(FIND_MY_STRUCTURES, {
					filter: { structureType },
				});

				if (process.env.NODE_ENV === "development") {
					console.log(`structures found ${JSON.stringify(structures)}`);
				}

				if (structures) {
					totalCurrentStructures = structures.length;
				}

				if (availableNoOfStructures - totalCurrentStructures < 1) {
					structureIndex++;
					continue;
				}

				if (structureType === STRUCTURE_ROAD) {
					let positionKeys = Object.keys(room.memory.roadPositions);

					if (positionKeys) {
						positionKeys.forEach((positionKey) => {
							const roadPosition = room.memory.roadPositions[positionKey];

							structTypeArray.push(roadPosition);
						});
					}

					structTypeArray = [...structTypeArray, room.memory.structureMap[structureType].slice(0, availableNoOfStructures)];
				} else {
					structTypeArray = room.memory.structureMap[structureType].slice(0, availableNoOfStructures);
				}

				if (process.env.NODE_ENV === "development") {
					console.log(`structTypeArray: ${JSON.stringify(structTypeArray)}`);
				}

				while (structTypeArray && structTypeArray.length) {
					const structurePosition = structTypeArray.shift();

					if (process.env.NODE_ENV === "development") {
						console.log(`structurePosition: ${JSON.stringify(structurePosition)}`);
					}

					if (structurePosition) {
						var lookAtResponse = room.lookAt(structurePosition.x, structurePosition.y);

						if (lookAtResponse) {
							var structureFound = false;
							lookAtResponse.forEach((object) => {
								if (object.type === LOOK_STRUCTURES || (object.type === LOOK_CONSTRUCTION_SITES && object.structure)) {
									const structure = object.structure;

									// remove an existing road to make way for structure
									if (!WALKABLE_STRUCTURES.includes(structureType) && structure.structureType === STRUCTURE_ROAD) {
										structure.destroy();
									}

									if (structure.structureType === structureType) {
										if (process.env.NODE_ENV === "development") {
											console.log(`structureFound = true object: ${JSON.stringify(object)}`);
										}
										structureFound = true;
									}
								}
							});

							if (!structureFound) {
								const createSiteResponse = room.createConstructionSite(structurePosition.x, structurePosition.y, structureType);
								if (process.env.NODE_ENV === "development") {
									console.log(`createSiteResponse: ${JSON.stringify(createSiteResponse)}`);
								}

								switch (createSiteResponse) {
									case OK:
										structureBuilt = true;
										return;
									case ERR_FULL:
										return;
									default:
										console.log(`Failed to create construction site response = ${createSiteResponse}`);
								}
							}
						}
					}
				}

				structureIndex++;
			}
		}, // buildNextSite END

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

				if (process.env.NODE_ENV === "development") {
					console.log(`creepRole ${creepRole}`);
				}

				creepRoleSpawnConditions.forEach((spawnConditions) => {
					var conditionResults = [];

					if (process.env.NODE_ENV === "development") {
						console.log(`spawnConditions ${JSON.stringify(spawnConditions)}`);
					}

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
									sources.forEach((source) => {
										if (!roomModule.positionHasNearbyThreat(source.pos)) {
											conditionValueResult++;
										}
									});
								}
								break;
							case CONDITION_VALUE_TYPES.SOURCE_ACCESS:
								sources = room.find(FIND_SOURCES);

								if (sources) {
									//console.log(`sources ${JSON.stringify(sources)}`);
									sources.forEach((source) => {
										if (!roomModule.positionHasNearbyThreat(source.pos)) {
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

												conditionValueResult += freePos.length;
											}
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

					if (process.env.NODE_ENV === "development") {
						console.log(`conditionResults ${JSON.stringify(conditionResults)} `);
					}
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

					if (process.env.NODE_ENV === "development") {
						console.log(`numberCondition ${JSON.stringify(numberCondition)}.`);
					}

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
								sources.forEach((source) => {
									if (!roomModule.positionHasNearbyThreat(source.pos)) {
										noCreepsRequired++;
									}
								});
							}
							break;
						case CONDITION_VALUE_TYPES.SOURCE_WITH_CONTAINER:
							if (!sources) {
								sources = room.find(FIND_SOURCES);
							}

							if (process.env.NODE_ENV === "development") {
								console.log(`sources ${JSON.stringify(sources)}`);
							}

							if (sources) {
								sources.forEach((source) => {
									if (!roomModule.positionHasNearbyThreat(source.pos)) {
										const containers = room.find(FIND_STRUCTURES, {
											filter: { structureType: STRUCTURE_CONTAINER },
										});

										if (process.env.NODE_ENV === "development") {
											console.log(`containers ${JSON.stringify(containers)}`);
										}

										if (containers) {
											for (const i in containers) {
												const container = containers[i];

												if (container.pos.isNearTo(source)) {
													if (process.env.NODE_ENV === "development") {
														console.log(`containers hits is near to`);
													}
													noCreepsRequired++;
													break;
												}
											}
										}
									}
								});
							}
							break;
						case CONDITION_VALUE_TYPES.SOURCE_ACCESS:
							if (!sources) {
								sources = room.find(FIND_SOURCES);
							}

							if (sources) {
								if (process.env.NODE_ENV === "development") {
									console.log(`sources ${JSON.stringify(sources)}`);
								}

								sources.forEach((source) => {
									if (!roomModule.positionHasNearbyThreat(source.pos)) {
										const freePos = getAccessiblePositions(source.pos);
										if (freePos) {
											noCreepsRequired += freePos.length;
										}
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
		}, // createRoomCreepRoles END

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

					if (process.env.NODE_ENV === "development") {
						console.log(`creepRole ${JSON.stringify(creepRole)}, creeps ${JSON.stringify(creeps)}`);
					}

					if (creeps && creeps.length < creepRole.noCreepsRequired) {
						if (process.env.NODE_ENV === "development") {
							console.log(`if (creeps && creeps.length < creepRole.noCreepsRequired) SUCCESS`);
						}

						for (var i = 0; i < creepRole.noCreepsRequired - creeps.length; i++) {
							let noIdleCreeps = false;
							let creep = null;
							if (!noIdleCreeps) {
								if (process.env.NODE_ENV === "development") {
									console.log(`get idle creep`);
								}
								creep = creepRequisitionModule.getIdleCreep(room.name, CREEP_ROLES_TYPES[creepRoleName]);
							}

							if (creep) {
								if (process.env.NODE_ENV === "development") {
									console.log(`creep found ${JSON.stringify(creep)}`);
								}

								creep.memory.room = room.name;
								creep.memory.role = creepRoleName;

								if (process.env.NODE_ENV === "development") {
									console.log(`creep memory ${JSON.stringify(creep.memory)}`);
								}
							} else {
								noIdleCreeps = true;
								if (process.env.NODE_ENV === "development") {
									console.log(`creep not found`);
								}

								if (
									!creepRequisitionModule.addCreepToSpawn(room.name, CREEP_ROLES_TYPES[creepRoleName], {
										role: creepRoleName,
										room: room.name,
									})
								) {
									if (process.env.NODE_ENV === "development") {
										console.log("failed to add creep to spawn");
									}

									break;
								}
							}
						}
					}
				}
			}
		}, // checkCreeps END

		findNextFreeSource: (room) => {
			const sources = room.find(FIND_SOURCES);

			if (sources) {
				for (const i in sources) {
					const source = sources[i];

					if (roomModule.positionHasNearbyThreat(source.pos)) {
						continue;
					}

					// check room memory for source data

					if (!room.memory.sources) {
						room.memory.sources = {};
					}

					var sourceData = room.memory.sources[source.id];

					if (!sourceData) {
						console.log(`No source Data found for ${source.id}`);
						return source;
					}

					if (!sourceData.noRequiredCreeps) {
						const freePos = getAccessiblePositions(source.pos);

						sourceData.noRequiredCreeps = freePos.length;

						room.memory.sources[source.id] = sourceData;

						console.log(`No required no creeps detected for ${JSON.stringify(sourceData)}`);

						return source;
					}

					let creepNames = Object.keys(sourceData.currentCreeps);

					console.log(`creepNames ${JSON.stringify(creepNames)}`);

					if (!creepNames) {
						console.log(`No creep names detected for ${JSON.stringify(sourceData)}`);
						return source;
					}

					creepNames.forEach((creepName) => {
						let creep = Game.creeps[creepName];

						if (!creep) {
							console.log(`Deleting creep name ${JSON.stringify(creepName)}`);
							delete room.memory.sources[source.id].currentCreeps[creepName];
						}
					});

					creepNames = Object.keys(sourceData.currentCreeps);

					console.log(`creepNames ${JSON.stringify(creepNames)}`);

					if (creepNames.length < sourceData.noRequiredCreeps) {
						return source;
					}
				}
			}

			return null;
		}, // findNextFreeSource END

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

				//console.log(`pathFinderResponse ${JSON.stringify(pathFinderResponse)}`);

				if (pathFinderResponse && !pathFinderResponse.inComplete && pathFinderResponse.path.length < HOSTILE_CREEP_PROXIMITY_DISTANCE) {
					return true;
				}
			}

			return false;
		}, // positionHasNearbyThreat

		addCommonRoads: (room) => {
			// calculate source paths
			if (room.memory.roadPositionsAddedTime && room.memory.roadPositionsAddedTime + ROOM_ROAD_POSITION_ADDED_TIME < Game.time) {
				const { getPosName } = require("../common/position");
				room.memory.roadPositions = {};
				const sources = room.find(FIND_SOURCES);

				if (sources) {
					sources.forEach((source) => {
						// to spawn

						const spawns = source.room.find(FIND_MY_STRUCTURES, {
							filter: { STRUCTURE_SPAWN },
						});

						if (spawns) {
							spawns.forEach((spawn) => {
								var spawnResult = PathFinder.search(spawn.pos, { pos: source.pos, range: 1 });

								if (!spawnResult.incomplete && spawnResult.path) {
									spawnResult.path.forEach((pos) => {
										room.memory.roadPositions[getPosName(pos.x, pos.y)] = pos;
									});
								}
							});
						}

						// to controller
						var controllerResult = PathFinder.search(source.room.controller.pos, { pos: source.pos, range: 1 });

						if (!controllerResult.incomplete && controllerResult.path) {
							controllerResult.path.forEach((pos) => {
								room.memory.roadPositions[getPosName(pos.x, pos.y)] = pos;
							});
						}
					});
				}
			}
		},

		getSourceMemory: (sourceId) => {
			const source = Game.getObjectById(sourceId);

			if (source) {
				if (!source.room.memory.sources) {
					source.room.memory.sources = {};
				}

				return source.room.memory.sources[source.id];
			}
		},

		updateSourceMemory: (source, memory) => {
			if (!source.room.memory.sources) {
				source.room.memory.sources = {};
			}

			source.room.memory.sources[source.id] = memory;
		},
	};

	global.App.roomModule = roomModule;
})();

module.exports = global.App.roomModule;
