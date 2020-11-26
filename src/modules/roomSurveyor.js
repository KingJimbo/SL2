const { STRUCTURE_ROAD } = require("../testing/constants");

module.exports = function (memory, game) {
	this.memory = memory;
	this.game = game;

	this.sources = [];
	this.minerals = [];
	this.exits = [];
	this.roomTerrain = null;

	var Helper = require("../common/helper");
	this.helper = new Helper();

	this.surveyRoom = function (room) {
		/*
        grade a room on
        - resources (sources, minerals)
        - resource placement (far apart)
        - controller placement in conjunction with resources
        - free space
        - defendability (room accessibility, solid rock placement)

        approach
        - scan each block in the room
        - determine the best path between resources and controller
        - use that as a basis of base placement

    */

		// x, y 0 - 49

		if (room) {
			if (this.memory.roomSurveyData) {
				this.roomSurveyData = this.memory.roomSurveyData;
			} else {
				this.roomSurveyData = {
					room: room.name,
					progressPos: { x: 0, y: 0 },
					exitPathPosCounts: {},
					positionData: {},
					totalExits: 0,
				};
			}

			let x = this.roomSurveyData.progressPos.x,
				y = this.roomSurveyData.progressPos.x;

			if (!this.roomTerrain) {
				this.roomTerrain = room.getTerrain();
			}

			//console.log(`terrainData = ${JSON.stringify(this.roomTerrain)}`);

			this.sources = room.find(FIND_SOURCES);

			//console.log(`sources = ${JSON.stringify(this.sources)}`);

			this.minerals = room.find(FIND_MINERALS);

			//console.log(`minerals = ${JSON.stringify(this.minerals)}`);

			this.exits = room.find(FIND_EXIT);

			//console.log(`exits = ${JSON.stringify(this.exits)}`);

			this.roomSurveyData.totalExits = this.exits.length;

			let increment = 0;

			// scan each position
			while (increment < COORDINATES_MAX_SIZE) {
				//console.log(`increment = ${JSON.stringify(increment)}`);
				if (increment === 0) {
					// check position

					//console.log(`first coordinate ${x}:${y} `);
					var roomPosition = room.getPositionAt(x, y);
					//console.log(`roomPosition = ${JSON.stringify(roomPosition)}`);
					this.roomSurveyData.positionData[this.helper.getPosName(x, y)] = this.checkPosition(room.getPositionAt(x, y));
				}

				increment++;

				x = increment;
				// check position
				//console.log(`first coordinate ${x}:${y} `);
				var roomPosition = room.getPositionAt(x, y);
				//console.log(`roomPosition = ${JSON.stringify(roomPosition)}`);
				this.roomSurveyData.positionData[this.helper.getPosName(x, y)] = this.checkPosition(room.getPositionAt(x, y));

				y = increment;
				//console.log(`second coordinate ${x}:${y} `);
				roomPosition = room.getPositionAt(x, y);
				//console.log(`roomPosition = ${JSON.stringify(roomPosition)}`);
				this.roomSurveyData.positionData[this.helper.getPosName(x, y)] = this.checkPosition(room.getPositionAt(x, y));

				//console.log("setting memory");
				//console.log(`increment = ${JSON.stringify(increment)}`);
				this.memory.roomSurveyData = this.roomSurveyData;
			}

			//console.log("setting structure map");
			this.generateStructureMap(this.roomSurveyData);

			this.memory.roomSurveyData = this.roomSurveyData;

			room.memory.surveyData = this.roomSurveyData;
		}

		console.log(`roomSurveyData = ${JSON.stringify(this.roomSurveyData)}`);
		return this.roomSurveyData;
	};

	this.checkPosition = function (pos) {
		//console.log(`checkPostitionStart pos = ${JSON.stringify(pos)}`);
		let posSurveyData = {
			canBuild: true,
			canTravel: true,
			x: pos.x,
			y: pos.y,
		};

		var terrainData = this.checkPositionTerrain(pos);

		posSurveyData = { ...posSurveyData, ...terrainData };

		if (posSurveyData.canTravel) {
			var distanceData = this.getPositionDistanceData(pos);

			posSurveyData = { ...posSurveyData, ...distanceData };
		}

		return posSurveyData;
	};

	this.checkPositionTerrain = function (pos) {
		//console.log("checkPositionTerrain");
		const posTerrain = this.roomTerrain.get(pos.x, pos.y);
		//console.log(`posTerrain: ${JSON.stringify(posTerrain)}`);
		switch (posTerrain) {
			case 0: //plain
				//console.log("checkPositionTerrain Plain");
				return { canBuild: !this.helper.isPosNearEdge(pos.x, pos.y), terrain: "Plain" };
			case TERRAIN_MASK_WALL: //wall
				//console.log("checkPositionTerrain Wall");
				return { canBuild: false, canTravel: false, terrain: "Wall" };
			case TERRAIN_MASK_SWAMP: //swamp
				//console.log("checkPositionTerrain Swamp");
				return { canBuild: !this.helper.isPosNearEdge(pos.x, pos.y), canTravel: false, terrain: "Swamp" };
		}
	};

	this.getPositionDistanceData = function (pos) {
		//console.log("getPositionDistanceData");
		let room = this.game.rooms[pos.roomName];

		let positionDistanceData = {
			distances: {
				sources: [],
				mineral: [],
				controller: [],
				exits: [],
			},
			totalDistance: 0,
			closestExit: 0,
		};

		this.sources.forEach(function (source) {
			var ret = PathFinder.search(pos, { pos: source.pos, range: 1 });
			positionDistanceData.distances.sources.push({ id: source.id, cost: ret.cost });
			positionDistanceData.totalDistance += ret.cost;
		});

		//console.log("getPositionDistanceData got sources");

		this.minerals.forEach(function (mineral) {
			var ret = PathFinder.search(pos, { pos: mineral.pos, range: 1 });
			positionDistanceData.distances.mineral = { id: mineral.id, cost: ret.cost };
			positionDistanceData.totalDistance += ret.cost;
		});

		//console.log("getPositionDistanceData got minerals");

		for (const i in this.exits) {
			const exit = this.exits[i];
			//console.log(`exit: ${JSON.stringify(exit)}`);
			var ret = PathFinder.search(pos, { pos: exit, range: 1 });

			if (ret) {
				positionDistanceData.distances.exits.push({ id: this.helper.getPosName(exit.x, exit.y), cost: ret.cost });

				if (!positionDistanceData.totalExitDistance) {
					positionDistanceData.totalExitDistance = 0;
				}
				positionDistanceData.totalExitDistance += ret.cost;

				if (positionDistanceData.closestExit === 0) {
					positionDistanceData.closestExit = ret.cost;
				} else if (positionDistanceData.closestExit > ret.cost) {
					positionDistanceData.closestExit = ret.cost;
				}

				if (ret.path) {
					for (let j in ret.path) {
						const pathPos = ret.path[j];
						let id = this.helper.getPosName(pathPos.x, pathPos.y);
						this.roomSurveyData.exitPathPosCounts[id]
							? this.roomSurveyData.exitPathPosCounts[id]++
							: (this.roomSurveyData.exitPathPosCounts[id] = 1);
					}
				} else {
					console.log(`No path found to exit for ${JSON.stringify(exit)}`);
				}
			}
		}

		//console.log("getPositionDistanceData got exits");

		//console.log(`pos: ${JSON.stringify(pos)}`);
		//console.log(`roomController: ${JSON.stringify(room.controller)}`);

		var ret = PathFinder.search(pos, { pos: room.controller.pos, range: 1 });
		positionDistanceData.distances.controller = { id: room.controller.id, cost: ret.cost };
		positionDistanceData.totalDistance += ret.cost;

		//console.log("getPositionDistanceData end");

		return positionDistanceData;
	};

	this.generateStructureMap = (surveyData) => {
		const weights = {
			spawn: { nearSource: 0.3, nearSources: 0.3, defendability: 0.3, nearController: 0.3 },
		};
		// how to determine best placement
		// find best placement for
		//
		// STRUCTURE_SPAWN: "spawn",
		// ideally between sources and preferably in a defensive position near controller
		let nearestSourceDistance = 1000,
			nearestSourceDistancePosId = null,
			nearestTotalSourceDistance = 1000,
			bestSpawnWeight = 1000,
			idealSpawnPosition = null;

		for (const i in surveyData.positionData) {
			let positionData = surveyData.positionData[i],
				totalSourceDistance = 0,
				posNearestSourceDistance = 1000;

			if (positionData.canTravel && positionData.canBuild) {
				//console.log(`positionData = ${JSON.stringify(positionData)}`);
				positionData.distances.sources.forEach((distance) => {
					// checking globally nearest source distance
					if (distance.cost < nearestSourceDistance) {
						nearestSourceDistance = distance.cost;
						posNearestSourceDistance = distance.cost;
					}

					// checking locally nearest source distance
					if (distance.cost < posNearestSourceDistance) {
						posNearestSourceDistance = distance.cost;
					}

					// finding total source distance
					totalSourceDistance += distance.cost;
				});

				let controllerDistance = positionData.distances.controller.cost;

				let exitPathCount = this.getSurroundingPositionExitPathCounts(positionData.x, positionData.y);

				const weightNearestSourceDistance = weights.spawn.nearSource * posNearestSourceDistance,
					weightTotalNearestSourceDistance = weights.spawn.nearSources * totalSourceDistance,
					weightControllerDistance = weights.spawn.nearController * controllerDistance,
					weightDefendability = weights.spawn.defendability * exitPathCount;

				let spawnWeight = weightNearestSourceDistance + weightTotalNearestSourceDistance + weightControllerDistance + weightDefendability;

				positionData.weightNearestSourceDistance = weightNearestSourceDistance;
				positionData.weightTotalNearestSourceDistance = weightTotalNearestSourceDistance;
				positionData.weightControllerDistance = weightControllerDistance;
				positionData.weightDefendability = weightDefendability;
				positionData.spawnWeight = spawnWeight;

				if (spawnWeight < bestSpawnWeight) {
					bestSpawnWeight = spawnWeight;
					idealSpawnPosition = { id: i, x: positionData.x, y: positionData.y, basePositionType: BASE_POSITION_TYPES.CROSS_ROAD };
				}
			}
		}

		if (!idealSpawnPosition) {
			console.log("generateStructureMap: can not find ideal spawn position!");
			return;
		}

		//surveyData.structureMap = this.createNewStructureMap();
		surveyData.structureMap = {};

		let structureArray = [];
		//console.log(`RESOURCE_ORDER_STRUCTURE_PRIORITY: ${JSON.stringify(RESOURCE_ORDER_STRUCTURE_PRIORITY)}`);
		for (const j in RESOURCE_ORDER_STRUCTURE_PRIORITY) {
			//console.log(`type: ${JSON.stringify(type)}`);
			//console.log(`CONTROLLER_STRUCTURES: ${JSON.stringify(CONTROLLER_STRUCTURES)}`);
			const type = RESOURCE_ORDER_STRUCTURE_PRIORITY[j];
			let structureMax = CONTROLLER_STRUCTURES[type][8];

			for (var i = 0; i < structureMax; i++) {
				structureArray.push(type);
			}
		}

		this.structureArray = structureArray;
		console.log(`structureArray: ${JSON.stringify(structureArray)}`);

		this.mapStructures(this.structureArray, idealSpawnPosition);

		// let roadPositionsToCheck = [idealSpawnPosition];
		// let positionsChecked = {};

		// if (!this.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
		// 	this.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
		// }

		// if (this.structureArray && idealSpawnPosition) {
		// 	while (this.structureArray && roadPositionsToCheck && roadPositionsToCheck.length > 0) {
		// 		//console.log(`positionsToCheck = ${JSON.stringify(positionsToCheck)}`);
		// 		// let surroundingPositions = this.getSurroundingPositions(idealSpawnPosition.x, idealSpawnPosition.y);

		// 		// for (const i in surroundingPositions) {
		// 		//     var position = surroundingPositions[i];
		// 		//     this.assessPosForStructure(idealSpawnPosition.x, idealSpawnPosition.y);
		// 		// }

		// 		const positionToCheck = roadPositionsToCheck.shift();

		// 		if (positionToCheck) {
		// 			//console.log(`positionToCheck = ${JSON.stringify(positionToCheck)}`);

		// 			let canBePlaced = true,
		// 				id = this.helper.getPosName(positionToCheck.x, positionToCheck.y),
		// 				positionData = this.roomSurveyData.positionData[id];

		// 			if (!positionsChecked[id]) {
		// 				positionsChecked[id] = id;

		// 				//console.log(`positionData = ${JSON.stringify(positionData)}`);

		// 				if (positionData) {
		// 					// check each surrounding pos to see if you  can build on it

		// 					this.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: positionToCheck.x, y: positionToCheck.y });
		// 					global.debug.colorPositionByStructure(
		// 						new RoomPosition(positionToCheck.x, positionToCheck.y, this.roomSurveyData.room),
		// 						STRUCTURE_ROAD
		// 					);

		// 					const surroundingPositions = this.getSurroundingPositions(positionToCheck.x, positionToCheck.y);

		// 					for (const i in surroundingPositions) {
		// 						// check is position has been checked or not and add to array to be checked if not
		// 						const surroundingPos = surroundingPositions[i],
		// 							surroundingPosId = this.helper.getPosName(surroundingPos.x, surroundingPos.y);

		// 						if (!positionsChecked[surroundingPosId]) {
		// 							const surroundingPosData = this.roomSurveyData.positionData[surroundingPosId];

		// 							if (this.isRoadPosition(positionToCheck, surroundingPos)) {
		// 								// Road
		// 								if (surroundingPosData && surroundingPosData.canTravel) {
		// 									switch (positionToCheck.basePositionType) {
		// 										case BASE_POSITION_TYPES.CROSS_ROAD:
		// 											surroundingPos.basePositionType = BASE_POSITION_TYPES.CONNECTING_ROAD_ONE;
		// 											break;
		// 										case BASE_POSITION_TYPES.CONNECTING_ROAD_ONE:
		// 											surroundingPos.basePositionType = BASE_POSITION_TYPES.CONNECTING_ROAD_TWO;
		// 											break;
		// 										default:
		// 											surroundingPos.basePositionType = BASE_POSITION_TYPES.CROSS_ROAD;
		// 											break;
		// 									}

		// 									surroundingPos.parentPos = positionToCheck;
		// 									roadPositionsToCheck.push(surroundingPos);
		// 								}
		// 							} else {
		// 								// Structure
		// 								if (surroundingPosData && surroundingPosData.canBuild) {
		// 									let strucType = this.structureArray.shift();

		// 									if (!this.roomSurveyData.structureMap[strucType]) {
		// 										this.roomSurveyData.structureMap[strucType] = [];
		// 									}

		// 									this.roomSurveyData.structureMap[strucType].push({ x: surroundingPos.x, y: surroundingPos.y });
		// 									global.debug.colorPositionByStructure(
		// 										new RoomPosition(surroundingPos.x, surroundingPos.y, this.roomSurveyData.room),
		// 										strucType
		// 									);
		// 								}
		// 							}
		// 						}
		// 					}

		// 					// if (canBePlaced) {
		// 					// 	let strucType = this.structureArray.shift();

		// 					// 	if (!this.roomSurveyData.structureMap[strucType]) {
		// 					// 		this.roomSurveyData.structureMap[strucType] = [];
		// 					// 	}

		// 					// 	this.roomSurveyData.structureMap[strucType].push({ x: positionToCheck.x, y: positionToCheck.y });
		// 					// 	global.debug.colorPositionByStructure(
		// 					// 		new RoomPosition(positionToCheck.x, positionToCheck.y, this.roomSurveyData.room),
		// 					// 		strucType
		// 					// 	);
		// 					// 	//console.log(`positionData = ${JSON.stringify(this.roomSurveyData.positionData)}`);
		// 					// 	//console.log(`structureMap = ${JSON.stringify(this.roomSurveyData.structureMap)}`);
		// 					// 	positionData.hasStructure = true;
		// 					// 	this.roomSurveyData.positionData[id] = positionData;
		// 					// }
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		// let variance = 0,
		// 	structuresPlacedCount = 0,
		// 	currentX = idealSpawnPosition.x,
		// 	currentY = idealSpawnPosition.y,
		// 	startX = idealSpawnPosition.x,
		// 	startY = idealSpawnPosition.y,
		// 	possiblePos = [],
		// 	allPosTraversed = [];

		// //console.log(`structureArray: ${JSON.stringify(structureArray)}`);
		// //console.log(`idealSpawnPosition: ${JSON.stringify(idealSpawnPosition)}`);

		// //this.assessPosForStructure(currentX, currentY);
		// //allPosTraversed.push({ x: idealSpawnPosition.x, y: idealSpawnPosition.y });
		// //possiblePos.push({ x: idealSpawnPosition.x, y: idealSpawnPosition.y });
		// structuresPlacedCount++;

		// if (this.structureArray && idealSpawnPosition) {
		// 	while (
		// 		//structuresPlacedCount < structureArray.length &&
		// 		variance < COORDINATES_MAX_SIZE &&
		// 		this.structureArray
		// 	) {
		// 		// get corner pos
		// 		startX++;
		// 		startY++;
		// 		currentX = startX;
		// 		currentY = startY;
		// 		variance = variance + 2;
		// 		//allPosTraversed.push({ x: currentX, y: currentY });

		// 		if (currentX <= COORDINATES_MAX_SIZE && currentY <= COORDINATES_MAX_SIZE) {
		// 			//console.log(`${currentX},${currentY}`);
		// 			this.assessPosForStructure(currentX, currentY);
		// 			//possiblePos.push({ x: currentX, y: currentY });
		// 			structuresPlacedCount++;
		// 		}

		// 		//increase side length

		// 		for (var x = 0; x < variance; x++) {
		// 			currentX--;
		// 			//allPosTraversed.push({ x: currentX, y: currentY });
		// 			if (currentX <= COORDINATES_MAX_SIZE && currentY <= COORDINATES_MAX_SIZE) {
		// 				//console.log(`${currentX},${currentY}`);
		// 				this.assessPosForStructure(currentX, currentY);
		// 				//possiblePos.push({ x: currentX, y: currentY });
		// 				structuresPlacedCount++;
		// 			}
		// 		}

		// 		for (var y = 0; y < variance; y++) {
		// 			currentY--;
		// 			//allPosTraversed.push({ x: currentX, y: currentY });
		// 			if (currentX <= COORDINATES_MAX_SIZE && currentY <= COORDINATES_MAX_SIZE) {
		// 				//console.log(`${currentX},${currentY}`);
		// 				this.assessPosForStructure(currentX, currentY);
		// 				//possiblePos.push({ x: currentX, y: currentY });
		// 				structuresPlacedCount++;
		// 			}
		// 		}

		// 		for (var x = 0; x < variance; x++) {
		// 			currentX++;
		// 			//allPosTraversed.push({ x: currentX, y: currentY });
		// 			if (currentX <= COORDINATES_MAX_SIZE && currentY <= COORDINATES_MAX_SIZE) {
		// 				//console.log(`${currentX},${currentY}`);
		// 				this.assessPosForStructure(currentX, currentY);
		// 				//possiblePos.push({ x: currentX, y: currentY });
		// 				structuresPlacedCount++;
		// 			}
		// 		}

		// 		for (var y = 1; y < variance; y++) {
		// 			currentY++;
		// 			//allPosTraversed.push({ x: currentX, y: currentY });
		// 			if (currentX <= COORDINATES_MAX_SIZE && currentY <= COORDINATES_MAX_SIZE) {
		// 				//console.log(`${currentX},${currentY}`);
		// 				this.assessPosForStructure(currentX, currentY);
		// 				//possiblePos.push({ x: currentX, y: currentY });
		// 				structuresPlacedCount++;
		// 			}
		// 		}
		// 	}
		// }
		// if (possiblePos) {
		// 	console.log(`possiblePos: ${JSON.stringify(possiblePos)}`);
		// 	console.log(`possiblePos length: ${JSON.stringify(possiblePos.length)}`);
		// }

		// if (allPosTraversed) {
		// 	console.log(`allPosTraversed: ${JSON.stringify(allPosTraversed)}`);
		// 	console.log(`allPosTraversed length: ${JSON.stringify(allPosTraversed.length)}`);
		// }

		//
		// STRUCTURE_POWER_SPAWN: "powerSpawn",
		// near spawns
		//
		// STRUCTURE_STORAGE: "storage",
		// near spawns
		//
		// STRUCTURE_TERMINAL: "terminal",
		// near storage
		//
		// STRUCTURE_NUKER: "nuker",
		// near storage
		//
		// STRUCTURE_LAB: "lab",
		// near storage
		//
		// STRUCTURE_FACTORY: "factory",
		// near labs
		//
		// STRUCTURE_EXTENSION: "extension",
		// near spawns & sources
		// STRUCTURE_TOWER: "tower",
		// near spawns and extensions
		//
		// STRUCTURE_CONTAINER: "container",
		// near source align to nearest storage
		//
		// STRUCTURE_LINK: "link",
		// near container at source

		// STRUCTURE_EXTRACTOR: "extractor",
		// STRUCTURE_ROAD: "road",
		// STRUCTURE_WALL: "constructedWall",
		// STRUCTURE_RAMPART: "rampart",
		//
		// STRUCTURE_PORTAL: "portal",
		// STRUCTURE_KEEPER_LAIR: "keeperLair",
		// STRUCTURE_CONTROLLER: "controller",
		// STRUCTURE_OBSERVER: "observer",
		// STRUCTURE_POWER_BANK: "powerBank",
		// STRUCTURE_INVADER_CORE: "invaderCore",
	};

	this.mapStructures = (structureArray, idealSpawnPosition) => {
		let centrePositions = [idealSpawnPosition];
		let positionsChecked = {};

		while (structureArray && structureArray.length > 0 && centrePositions && centrePositions.length > 0) {
			let centrePosition = centrePositions.shift();
			const centrePositionId = this.helper.getPosName(centrePosition.x, centrePosition.y);

			console.log(`centrePositions: ${JSON.stringify(centrePositions)}`);
			console.log(`centrePosition: ${JSON.stringify(centrePosition)}`);

			const centrePositionData = this.roomSurveyData.positionData[centrePositionId];
			console.log(`positionData: ${JSON.stringify(this.roomSurveyData.positionData)}`);
			console.log(`centrePositionData: ${JSON.stringify(centrePositionData)}`);

			if (centrePositionData && centrePositionData.canTravel) {
				if (!this.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
					this.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
				}
				this.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: centrePosition.x, y: centrePosition.y });
				global.debug.colorPositionByStructure(new RoomPosition(centrePosition.x, centrePosition.y, this.roomSurveyData.room), STRUCTURE_ROAD);
			}

			const blockPositions = this.getDefaultBaseTemplatePositionBlock(centrePosition);

			console.log(`blockPositions: ${JSON.stringify(blockPositions)}`);

			for (const i in blockPositions) {
				const blockPosition = blockPositions[i],
					blockPositionId = this.helper.getPosName(blockPosition.x, blockPosition.y);

				console.log(`blockPosition: ${JSON.stringify(blockPosition)}`);

				const blockPositionData = this.roomSurveyData.positionData[blockPositionId];

				if (blockPositionData) {
					if (blockPosition.isRoad && blockPositionData.canTravel) {
						// add road structure
						if (!this.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
							this.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
						}
						this.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: blockPosition.x, y: blockPosition.y });
						global.debug.colorPositionByStructure(
							new RoomPosition(blockPosition.x, blockPosition.y, this.roomSurveyData.room),
							STRUCTURE_ROAD
						);

						// find connecting block centre & add to centrePositions
						let connectingBlockCentrePosition = this.getPositionFromDirection(blockPosition, blockPosition.direction, 2);

						console.log(`connectingBlockCentrePosition: ${JSON.stringify(connectingBlockCentrePosition)}`);

						if (connectingBlockCentrePosition) {
							connectingBlockCentrePosition.isRoad = true;
							const connectingBlockCentrePositionId = this.helper.getPosName(blockPosition.x, blockPosition.y);
							console.log(`connectingBlockCentrePositionId: ${JSON.stringify(connectingBlockCentrePositionId)}`);
							if (!positionsChecked[connectingBlockCentrePositionId]) {
								console.log(`connectingBlockCentrePosition: ${JSON.stringify(connectingBlockCentrePosition)}`);
								centrePositions.push(connectingBlockCentrePosition);
							}
						}
					} else if (blockPositionData && blockPositionData.canBuild) {
						let strucType = this.structureArray.shift();

						if (!this.roomSurveyData.structureMap[strucType]) {
							this.roomSurveyData.structureMap[strucType] = [];
						}

						this.roomSurveyData.structureMap[strucType].push({ x: blockPosition.x, y: blockPosition.y });
						global.debug.colorPositionByStructure(
							new RoomPosition(blockPosition.x, blockPosition.y, this.roomSurveyData.room),
							strucType
						);
					}
				}
			}
		}
	};

	this.getDefaultBaseTemplatePositionBlock = (centrePosition) => {
		let positionArray = [];

		if (!centrePosition) {
			return positionArray;
		}

		let topLeftPosition = this.getPositionFromDirection(centrePosition, TOP_LEFT);
		if (topLeftPosition) {
			topLeftPosition.isRoad = false;
			positionArray.push(topLeftPosition);
		}

		let topPosition = this.getPositionFromDirection(centrePosition, TOP);
		if (topPosition) {
			topPosition.isRoad = true;
			positionArray.push(topPosition);
		}

		let topRightPosition = this.getPositionFromDirection(centrePosition, TOP_RIGHT);
		if (topRightPosition) {
			topRightPosition.isRoad = false;
			positionArray.push(topRightPosition);
		}

		let leftPosition = this.getPositionFromDirection(centrePosition, LEFT);
		if (leftPosition) {
			leftPosition.isRoad = true;
			positionArray.push(leftPosition);
		}

		let rightPosition = this.getPositionFromDirection(centrePosition, RIGHT);
		if (rightPosition) {
			rightPosition.isRoad = true;
			positionArray.push(rightPosition);
		}

		let bottomLeftPosition = this.getPositionFromDirection(centrePosition, BOTTOM_LEFT);
		if (bottomLeftPosition) {
			bottomLeftPosition.isRoad = false;
			positionArray.push(bottomLeftPosition);
		}

		let bottomPosition = this.getPositionFromDirection(centrePosition, BOTTOM);
		if (bottomPosition) {
			bottomPosition.isRoad = true;
			positionArray.push(bottomPosition);
		}

		let bottomRightPosition = this.getPositionFromDirection(centrePosition, BOTTOM_RIGHT);
		if (bottomRightPosition) {
			bottomRightPosition.isRoad = false;
			positionArray.push(bottomRightPosition);
		}

		return positionArray;
	};

	// this.getConnectingBlockCentrePosition = (position) => {
	// 	if (!position) {
	// 		return null;
	// 	}

	// 	let x = position.x,
	// 		y = position.y;

	// 	switch (position.direction) {
	// 		case TOP:
	// 			y + 2;
	// 			break;
	// 		case TOP_RIGHT:
	// 			x + 2;
	// 			y + 2;
	// 			break;
	// 		case RIGHT:
	// 			x + 2;
	// 			break;
	// 		case BOTTOM_RIGHT:
	// 			x + 2;
	// 			y - 2;
	// 			break;
	// 		case BOTTOM:
	// 			y - 2;
	// 			break;
	// 		case BOTTOM_LEFT:
	// 			x - 2;
	// 			y - 2;
	// 			break;
	// 		case LEFT:
	// 			x - 2;
	// 			break;
	// 		case TOP_LEFT:
	// 			x - 2;
	// 			y + 2;
	// 			break;
	// 		default:
	// 			return null;
	// 	}

	// 	if (this.helper.isPosNearEdge(x, y)) {
	// 		return null;
	// 	}

	// 	return { x, y, direction };
	// };

	this.getPositionFromDirection = (originalPos, direction, distance) => {
		//console.log(`getPositionFromDirection: ${JSON.stringify(originalPos)}, ${JSON.stringify(direction)}, ${JSON.stringify(distance)}`);

		if (!originalPos) {
			return null;
		}

		if (!distance) {
			distance = 1;
		}

		let x = originalPos.x,
			y = originalPos.y;

		switch (direction) {
			case TOP:
				y += distance;
				break;
			case TOP_RIGHT:
				x += distance;
				y += distance;
				break;
			case RIGHT:
				x += distance;
				break;
			case BOTTOM_RIGHT:
				x += distance;
				y -= distance;
				break;
			case BOTTOM:
				y -= distance;
				break;
			case BOTTOM_LEFT:
				x -= distance;
				y -= distance;
				break;
			case LEFT:
				x -= distance;
				break;
			case TOP_LEFT:
				x -= distance;
				y += distance;
				break;
			default:
				console.log(`return null`);
				return null;
		}

		if (this.helper.isPosNearEdge(x, y)) {
			console.log(`near edge`);
			return null;
		}

		let returnedPosition = { x, y, direction };
		//console.log(`returnedPosition: ${JSON.stringify(returnedPosition)}`);

		return returnedPosition;
	};

	this.assessPosForStructure = (x, y) => {
		//console.log(`x: ${JSON.stringify(x)}, y:${JSON.stringify(y)}`);
		const canBePlaced = this.canStructureBePlaced(x, y);
		//console.log(`canBePlaced: ${JSON.stringify(canBePlaced)}`);
		return canBePlaced;
	};

	this.canStructureBePlaced = (x, y) => {
		let surroundingPositions = this.getSurroundingPositions(x, y),
			canBePlaced = true,
			id = this.helper.getPosName(x, y),
			positionData = this.roomSurveyData.positionData[id];

		//console.log(`positionData = ${JSON.stringify(positionData)}`);

		if (positionData) {
			// check each surrounding pos to see if you  can build on it
			// need to think of a better way of doing this. Checking surrounding positions to see where the current position is.

			for (const i in surroundingPositions) {
				const pos = surroundingPositions[i];
				if (!this.doesPositionHaveOtherAccess(pos.x, pos.y)) {
					canBePlaced = false;
					break;
				}
			}
			// surroundingPositions.every((pos) => {
			// 	if (this.doesPositionHaveOtherAccess(pos.x, pos.y)) {
			// 		canBePlaced = true;
			// 		return true;
			// 	}
			// });

			if (canBePlaced) {
				// current pos is the top right
				let strucType = this.structureArray.shift();

				if (!this.roomSurveyData.structureMap[strucType]) {
					this.roomSurveyData.structureMap[strucType] = [];
				}

				this.roomSurveyData.structureMap[strucType].push({ x, y });
				console.log(`positionData = ${JSON.stringify(this.roomSurveyData.positionData)}`);
				//console.log(`structureMap = ${JSON.stringify(this.roomSurveyData.structureMap)}`);
				positionData.hasStructure = true;
				this.roomSurveyData.positionData[id] = positionData;

				global.debug.colorPositionByStructure(new RoomPosition(x, y, this.roomSurveyData.room), strucType);
			}
		} else {
			canBePlaced = false;
		}

		return canBePlaced;
	};

	this.doesPositionHaveOtherAccess = (x, y) => {
		let surroundingPositions = this.getSurroundingPositions(x, y),
			hasOtherAccess = false;

		//console.log(`surroundingPositions: ${JSON.stringify(surroundingPositions)}`);

		for (const i in surroundingPositions) {
			let pos = surroundingPositions[i];
			let id = this.helper.getPosName(pos.x, pos.y),
				positionData = this.roomSurveyData.positionData[id];

			// position that you can travel over , doens't have
			if (positionData && positionData.canTravel && !positionData.hasStructure) {
				hasOtherAccess = true;
				break;
			}
		}

		// surroundingPositions.every((pos) => {
		// 	let id = this.helper.getPosName(pos.x, pos.y),
		// 		positionData = this.roomSurveyData.positionData[id];

		// 	// position that you can travel over , doens't have
		// 	if (positionData && positionData.canTravel && !positionData.hasStructure && pos.x != originX && pos.y != originY) {
		// 		hasOtherAccess = true;
		// 		return false;
		// 	}
		// });

		return hasOtherAccess;
	};

	this.getSurroundingPositions = (x, y) => {
		let topPos = { x: x, y: y + 1, direction: TOP },
			leftPos = { x: x - 1, y, direction: LEFT },
			rightPos = { x: x, y: y + 1, direction: RIGHT },
			bottomPos = { x: x, y: y - 1, direction: BOTTOM },
			topRightPos = { x: x + 1, y: y + 1, direction: TOP_RIGHT },
			topLeftPos = { x: x - 1, y: y + 1, direction: TOP_LEFT },
			bottomLeftPos = { x: x - 1, y: y - 1, direction: BOTTOM_LEFT },
			bottomRightPos = { x: x + 1, y: y - 1, direction: BOTTOM_RIGHT };

		return [topPos, rightPos, bottomPos, leftPos, topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
	};

	this.getStructurePositions = (x, y) => {
		let topPos = { x: x, y: y + 1, direction: TOP },
			leftPos = { x: x - 1, y, direction: LEFT },
			rightPos = { x: x, y: y + 1, direction: RIGHT },
			bottomPos = { x: x, y: y - 1, direction: BOTTOM };

		return [topPos, rightPos, bottomPos, leftPos];
	};

	this.getRoadPositions = (x, y) => {
		let topRightPos = { x: x + 1, y: y + 1, direction: TOP_RIGHT },
			topLeftPos = { x: x - 1, y: y + 1, direction: TOP_LEFT },
			bottomLeftPos = { x: x - 1, y: y - 1, direction: BOTTOM_LEFT },
			bottomRightPos = { x: x + 1, y: y - 1, direction: BOTTOM_RIGHT };

		return [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
	};

	this.isLinearDirection = (direction) => {
		switch (direction) {
			case TOP:
				return true;
			case TOP_RIGHT:
				return false;
			case RIGHT:
				return true;
			case BOTTOM_RIGHT:
				return false;
			case BOTTOM:
				return true;
			case BOTTOM_LEFT:
				return false;
			case LEFT:
				return true;
			case TOP_LEFT:
				return false;
			default:
				return false;
		}
	};

	this.isRoadPosition = (originalPosition, positionToBeChecked) => {
		// determine previous parent direction
		//var direction = this.getDirectionOfPositionFromPosition(originalPosition, positionToBeChecked);
		// check what type of road
		switch (originalPosition.basePositionType) {
			case BASE_POSITION_TYPES.CROSS_ROAD:
				return this.isLinearDirection(positionToBeChecked.direction);
			case BASE_POSITION_TYPES.CONNECTING_ROAD_ONE:
				return originalPosition.direction === positionToBeChecked.direction;
			case BASE_POSITION_TYPES.CONNECTING_ROAD_TWO:
				return originalPosition.direction === positionToBeChecked.direction;
			default:
				return false;
		}

		// switch (direction) {
		// 	case TOP:
		// 		return true;
		// 	case TOP_RIGHT:
		// 		return false;
		// 	case RIGHT:
		// 		return true;
		// 	case BOTTOM_RIGHT:
		// 		return false;
		// 	case BOTTOM:
		// 		return true;
		// 	case BOTTOM_LEFT:
		// 		return false;
		// 	case LEFT:
		// 		return true;
		// 	case TOP_LEFT:
		// 		return false;
		// 	default:
		// 		return false;
		// }
		// use direction to determine next road positions

		// switch (originalPosition.basePositionType) {
		// 	case BASE_POSITION_TYPES.CROSS_ROAD:
		//         return this.isLinearDirection(positionToBeChecked.direction);
		//     case BASE_POSITION_TYPES.CONNECTING_ROAD_ONE:

		// }
	};

	// this.getDirectionOfPositionFromPosition = (originalPosition, positionToBeChecked) => {
	// 	const x = originalPosition.x - positionToBeChecked.x,
	// 		y = originalPosition.y - positionToBeChecked.y;

	// 	if (x === 1 && y === 1) {
	// 		return BOTTOM_LEFT;
	// 	} else if (x === 1 && y === 0) {
	// 		return LEFT;
	// 	} else if (x === 1 && y === -1) {
	// 		return TOP_LEFT;
	// 	} else if (x === 0 && y === 1) {
	// 		return BOTTOM;
	// 	} else if (x === 0 && y === -1) {
	// 		return TOP;
	// 	} else if (x === -1 && y === -1) {
	// 		return TOP_RIGHT;
	// 	} else if (x === -1 && y === 0) {
	// 		return RIGHT;
	// 	} else if (x === -1 && y === 1) {
	// 		return BOTTOM_RIGHT;
	// 	} else {
	// 		return -1;
	// 	}
	// };

	this.createNewStructureMap = function () {
		return {
			spawn: {},
			extension: {},
			road: {},
			constructedWall: {},
			rampart: {},
			controller: {},
			link: {},
			storage: {},
			tower: {},
			observer: {},
			powerSpawn: {},
			extractor: {},
			lab: {},
			terminal: {},
			container: {},
			nuker: {},
		};
	};

	this.getSurroundingPositionExitPathCounts = (x, y) => {
		this.exitPositions = [
			{ x: x - 1, y: -1 },
			{ x: x, y: -1 },
			{ x: x + 1, y: -1 },
			{ x: x - 1, y },
			{ x: x + 1, y },
			{ x: x - 1, y: +1 },
			{ x: x, y: +1 },
			{ x: x + 1, y: +1 },
		];

		let count = 0;

		this.exitPositions.forEach((pos) => {
			//console.log(`pos: ${JSON.stringify(pos)}`);
			let id = this.helper.getPosName(pos.x, pos.y),
				positionData = this.roomSurveyData.positionData[id];
			//console.log(`id: ${JSON.stringify(id)}`);
			//console.log(`roomSurveyData.positionData: ${JSON.stringify(this.roomSurveyData.positionData)}`);

			if (positionData && positionData.canTravel) {
				var exitPathPosCount = this.roomSurveyData.exitPathPosCounts[id];
				if (exitPathPosCount) {
					count += exitPathPosCount;
				}
			}
		});

		return count;
	};

	this.identifyRoads = function (room) {
		// find sources and path to controller
	};

	this.structurePlacement = function (structure) {
		/* structure can only be placed if it's accessible
        what is accessible patterns
        how to define accessible?
        minimal
        - if two free spaces exist
        basic collection
        - three structures and there is enough free space for it still to be accessible

        we need to track 
        - road (mandatory free space) placement 
        - structures
        
        How to determine structure placement and order?
        - 

        coordinates
        -------------
        | 1 | 2 | 3 |
        -------------
        | 4 | o | 6 |
        -------------
        | 7 | 8 | 9 | 
		-------------
		
		--------------------------
        |  1 |  2 |  3 |  4 |  5 |
        --------------------------
        |  6 |  7 |  8 |  9 | 10 |
        --------------------------
        | 11 | 12 | 13 | 14 | 15 |
		--------------------------
		| 16 | 17 | 18 | 19 | 20 |
		--------------------------
		| 21 | 22 | 23 | 24 | 25 |
		--------------------------
		
		--------------------------
        |  S |  S |  3 |  4 |  5 |
        --------------------------
        |  S |  7 |  8 |  9 | 10 |
        --------------------------
        | 11 | 12 | 13 | 14 | 15 |
		--------------------------
		| 16 | 17 | 18 | 19 | 20 |
		--------------------------
		| 21 | 22 | 23 | 24 | 25 |
        --------------------------


    */
	};
};
