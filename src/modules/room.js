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
				let { roomSurveyModule, resourceModule } = global.App;

				roomSurveyModule.surveyRoomForStructures(room);

				// delete requests and start fresh every time
				//delete room.memory.resourceRequests;

				resourceModule.cleanUpRequestMemory(room);

				roomModule.checkResourceObjects(room);

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

				//global.logger.log(`sites ${JSON.stringify(sites)}`);

				if (!sites || sites.length === 0) {
					//global.logger.log(`build next site`);
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
							global.logger.log(`adding site request`);
						}

						resourceModule.addBuildRequest(site);
					}
				});
			}
		}, // checkRoomSites END

		checkRoomStructures: (room) => {
			// don't add construction site orders until level 2
			const structures = room.find(FIND_MY_STRUCTURES);

			//global.logger.log(`sites ${JSON.stringify(sites)}`);

			if (!structures || structures.length === 0) {
				if (process.env.NODE_ENV === "development") {
					global.logger.log("No structures found!");
				}

				return;
			}

			const { spawnModule, structureModule } = global.App;

			structures.forEach((structure) => {
				structureModule.checkStructure(structure);

				switch (structure.structureType) {
					case STRUCTURE_SPAWN:
						//spawnModule.runSpawn(structure);
						structureModule.runSpawn(structure);
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
					case STRUCTURE_CONTROLLER:
						structureModule.runController(structure);
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
							global.logger.log(`We don't currently do anything with structure type: ${structure.structureType}`);
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
					global.logger.log(`structureType: ${structureType}`);
				}

				if (!room.memory.structureMap[structureType]) {
					global.logger.log(`No room structureMap contains no structureType of ${structureType}`);
					structureIndex++;
					continue;
				}

				let availableNoOfStructures = CONTROLLER_STRUCTURES[structureType][room.controller.level],
					totalCurrentStructures = 0;
				if (process.env.NODE_ENV === "development") {
					global.logger.log(`availableNoOfStructures: ${availableNoOfStructures}`);
				}

				const structures = room.find(FIND_MY_STRUCTURES, {
					filter: { structureType },
				});

				if (process.env.NODE_ENV === "development") {
					global.logger.log(`structures found ${JSON.stringify(structures)}`);
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
					global.logger.log(`structTypeArray: ${JSON.stringify(structTypeArray)}`);
				}

				while (structTypeArray && structTypeArray.length) {
					const structurePosition = structTypeArray.shift();

					if (process.env.NODE_ENV === "development") {
						global.logger.log(`structurePosition: ${JSON.stringify(structurePosition)}`);
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
											global.logger.log(`structureFound = true object: ${JSON.stringify(object)}`);
										}
										structureFound = true;
									}
								}
							});

							if (!structureFound) {
								const createSiteResponse = room.createConstructionSite(structurePosition.x, structurePosition.y, structureType);
								if (process.env.NODE_ENV === "development") {
									global.logger.log(`createSiteResponse: ${JSON.stringify(createSiteResponse)}`);
								}

								switch (createSiteResponse) {
									case OK:
										structureBuilt = true;
										return;
									case ERR_FULL:
										return;
									default:
										global.logger.log(`Failed to create construction site response = ${createSiteResponse}`);
								}
							}
						}
					}
				}

				structureIndex++;
			}
		}, // buildNextSite END

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

				//global.logger.log(`pathFinderResponse ${JSON.stringify(pathFinderResponse)}`);

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
		}, // addCommonRoads END

		getSourceMemory: (sourceId) => {
			const source = Game.getObjectById(sourceId);

			if (source) {
				if (!source.room.memory.sources) {
					source.room.memory.sources = {};
				}

				return source.room.memory.sources[source.id];
			}
		}, // getSourceMemory END

		updateSourceMemory: (source, memory) => {
			if (!source.room.memory.sources) {
				source.room.memory.sources = {};
			}

			source.room.memory.sources[source.id] = memory;
		}, // updateSourceMemory END

		checkResourceObjects: (room) => {
			const { resourceModule } = global.App;

			const sources = room.find(FIND_SOURCES);

			if (sources) {
				sources.forEach((source) => {
					resourceModule.addHarvestRequest(source, source.energy);
				});
			}

			if (room.controller.level > 3) {
				const storages = room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_STORAGE } });

				if (storages && storages.length > 0) {
					const minerals = room.find(FIND_MINERALS);

					if (minerals) {
						minerals.forEach((mineral) => {
							resourceModule.addHarvestRequest(mineral, mineral.mineralAmount);
						});
					}
				}
			}

			const droppedResources = room.find(FIND_DROPPED_RESOURCES);

			if (droppedResources) {
				droppedResources.forEach((droppedResource) => {
					resourceModule.addPickupRequest(droppedResource);
				});
			}
		}, // checkResourceObjects END
	};

	global.App.roomModule = roomModule;
})();

module.exports = global.App.roomModule;
