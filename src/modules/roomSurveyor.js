const { COORDINATES_MAX_SIZE } = require("../common/constants");
const { STRUCTURE_ROAD } = require("../testing/constants");

module.exports = function (memory, game) {
	this.memory = memory;
	this.game = game;
	this.surveyVersion = 0.1;

	this.sources = [];
	this.minerals = [];
	this.exits = [];
	this.roomTerrain = null;
	this.room = null;

	var Helper = require("../common/helper");
	this.helper = new Helper();

	this.surveyRoom = function (room) {
		if (room) {
			this.room = room;

			if (this.room.memory.structureMapVersion && this.surveyVersion <= this.room.memory.structureMapVersion) {
				return;
			}

			this.roomSurveyData = {
				room: room.name,
				progressPos: { x: 0, y: 0 },
				exitPathPosCounts: {},
				positionData: {},
				totalExits: 0,
			};

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

			const lookAtArray = room.lookAtArea(0, 0, COORDINATES_MAX_SIZE, COORDINATES_MAX_SIZE, true); // as array
			console.log(`lookAtArray = ${JSON.stringify(lookAtArray.length)}`);

			for (const i in lookAtArray) {
				const lookAtItem = lookAtArray[i];

				if (lookAtItem.type === LOOK_TERRAIN) {
					this.roomSurveyData.positionData[this.helper.getPosName(lookAtItem.x, lookAtItem.y)] = this.checkPosition(lookAtItem);
				}
			}

			//console.log("setting structure map");
			this.generateStructureMap(this.roomSurveyData);

			//this.memory.roomSurveyData = this.roomSurveyData;

			room.memory.structureMap = this.roomSurveyData.structureMap;
			room.memory.structureMapGeneratedTime = this.game.time;
			room.memory.structureMapVersion = this.surveyVersion;
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
			var distanceData = this.getPositionDistanceData(this.room.getPositionAt(pos.x, pos.y));

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

	this.getPositionDistanceData = function (posToCheck) {
		//console.log("getPositionDistanceData");
		console.log(`posToCheck: ${JSON.stringify(posToCheck)}`);

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

		if (!this.helper.isPosNearEdge(posToCheck.x, posToCheck.y)) {
			let pos = new RoomPosition(posToCheck.x, posToCheck.y, this.room.name);

			for (const i in this.sources) {
				const source = this.sources[i];
				const searchObject = { pos: source.pos, range: 1 };
				// console.log(`pos: ${JSON.stringify(pos)}`);
				// console.log(`searchObject: ${JSON.stringify(searchObject)}`);
				var ret = PathFinder.search(pos, searchObject);
				var ret = PathFinder.search(pos, { pos: source, range: 1 });
				positionDistanceData.distances.sources.push({ id: source.id, cost: ret.cost });
				positionDistanceData.totalDistance += ret.cost;
			}

			// //console.log("getPositionDistanceData got sources");

			this.minerals.forEach(function (mineral) {
				var ret = PathFinder.search(pos, { pos: mineral.pos, range: 1 });
				positionDistanceData.distances.mineral = { id: mineral.id, cost: ret.cost };
				positionDistanceData.totalDistance += ret.cost;
			});

			//console.log("getPositionDistanceData got minerals");

			// for (const i in this.exits) {
			// 	const exit = this.exits[i];
			// 	//console.log(`exit: ${JSON.stringify(exit)}`);
			// 	var ret = PathFinder.search(pos, { pos: exit, range: 1 });

			// 	if (ret) {
			// 		positionDistanceData.distances.exits.push({ id: this.helper.getPosName(exit.x, exit.y), cost: ret.cost });

			// 		if (!positionDistanceData.totalExitDistance) {
			// 			positionDistanceData.totalExitDistance = 0;
			// 		}
			// 		positionDistanceData.totalExitDistance += ret.cost;

			// 		if (positionDistanceData.closestExit === 0) {
			// 			positionDistanceData.closestExit = ret.cost;
			// 		} else if (positionDistanceData.closestExit > ret.cost) {
			// 			positionDistanceData.closestExit = ret.cost;
			// 		}

			// 		if (ret.path) {
			// 			for (let j in ret.path) {
			// 				const pathPos = ret.path[j];
			// 				let id = this.helper.getPosName(pathPos.x, pathPos.y);
			// 				this.roomSurveyData.exitPathPosCounts[id]
			// 					? this.roomSurveyData.exitPathPosCounts[id]++
			// 					: (this.roomSurveyData.exitPathPosCounts[id] = 1);
			// 			}
			// 		} else {
			// 			console.log(`No path found to exit for ${JSON.stringify(exit)}`);
			// 		}
			// 	}
			// }

			//console.log("getPositionDistanceData got exits");

			//console.log(`pos: ${JSON.stringify(pos)}`);
			//console.log(`roomController: ${JSON.stringify(room.controller)}`);

			// var ret = PathFinder.search(pos, { pos: room.controller.pos, range: 1 });
			// positionDistanceData.distances.controller = { id: room.controller.id, cost: ret.cost };
			// positionDistanceData.totalDistance += ret.cost;

			//console.log("getPositionDistanceData end");
		}

		return positionDistanceData;
	};

	this.generateStructureMap = (surveyData) => {
		const weights = {
			spawn: { nearSource: 0.3, nearSources: 0.3, defendability: 0.3, nearController: 0.3 },
		};

		let nearestSourceDistance = 1000,
			bestSpawnWeight = 10000,
			idealSpawnPosition = null;

		for (const i in surveyData.positionData) {
			let positionData = surveyData.positionData[i],
				totalSourceDistance = 1000,
				posNearestSourceDistance = 1000,
				exitPathCount = 10000,
				controllerDistance = 1000;

			if (positionData.canTravel && positionData.canBuild) {
				let totalSourceDistancePossible = 0;
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
					totalSourceDistancePossible += distance.cost;
				});

				if (totalSourceDistancePossible) {
					totalSourceDistance = totalSourceDistancePossible;
				}

				let controllerDistancePossible = positionData.distances.controller.cost;

				if (controllerDistancePossible) {
					controllerDistance = controllerDistancePossible;
				}

				let exitPathCountPossible = this.getSurroundingPositionExitPathCounts(positionData.x, positionData.y);

				if (exitPathCountPossible) {
					exitPathCount = exitPathCountPossible;
				}

				const weightNearestSourceDistance = weights.spawn.nearSource * posNearestSourceDistance,
					weightTotalNearestSourceDistance = weights.spawn.nearSources * totalSourceDistance,
					weightControllerDistance = weights.spawn.nearController * controllerDistance,
					weightDefendability = weights.spawn.defendability * exitPathCount;

				// console.log(`posNearestSourceDistance: ${JSON.stringify(posNearestSourceDistance)}`);
				// console.log(`totalSourceDistance: ${JSON.stringify(totalSourceDistance)}`);
				// console.log(`controllerDistance: ${JSON.stringify(controllerDistance)}`);
				// console.log(`exitPathCount: ${JSON.stringify(exitPathCount)}`);

				let spawnWeight = weightNearestSourceDistance + weightTotalNearestSourceDistance + weightControllerDistance + weightDefendability;

				positionData.weightNearestSourceDistance = weightNearestSourceDistance;
				positionData.weightTotalNearestSourceDistance = weightTotalNearestSourceDistance;
				positionData.weightControllerDistance = weightControllerDistance;
				positionData.weightDefendability = weightDefendability;
				positionData.spawnWeight = spawnWeight;

				//console.log(`spawnWeight: ${JSON.stringify(spawnWeight)}`);

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
	};

	this.mapStructures = (structureArray, idealSpawnPosition) => {
		let centrePositions = [idealSpawnPosition];
		let positionsChecked = {};

		while (structureArray && structureArray.length > 0 && centrePositions && centrePositions.length > 0) {
			let centrePosition = centrePositions.shift();
			const centrePositionId = this.helper.getPosName(centrePosition.x, centrePosition.y);

			// console.log(`centrePositions: ${JSON.stringify(centrePositions)}`);
			// console.log(`centrePosition: ${JSON.stringify(centrePosition)}`);

			const centrePositionData = this.roomSurveyData.positionData[centrePositionId];
			// console.log(`positionData: ${JSON.stringify(this.roomSurveyData.positionData)}`);
			// console.log(`centrePositionData: ${JSON.stringify(centrePositionData)}`);

			if (centrePositionData && centrePositionData.canTravel) {
				if (!this.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
					this.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
				}
				this.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: centrePosition.x, y: centrePosition.y });
				global.debug.colorPositionByStructure(new RoomPosition(centrePosition.x, centrePosition.y, this.roomSurveyData.room), STRUCTURE_ROAD);
			}

			const blockPositions = this.getDefaultBaseTemplatePositionBlock(centrePosition);

			//console.log(`blockPositions: ${JSON.stringify(blockPositions)}`);

			for (const i in blockPositions) {
				const blockPosition = blockPositions[i],
					blockPositionId = this.helper.getPosName(blockPosition.x, blockPosition.y);

				//console.log(`blockPosition: ${JSON.stringify(blockPosition)}`);

				const blockPositionData = this.roomSurveyData.positionData[blockPositionId];

				if (blockPositionData) {
					if (blockPosition.isRoad && blockPositionData.canTravel) {
						// add road structure
						if (!this.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
							this.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
						}
						this.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: blockPosition.x, y: blockPosition.y });
						// global.debug.colorPositionByStructure(
						// 	new RoomPosition(blockPosition.x, blockPosition.y, this.roomSurveyData.room),
						// 	STRUCTURE_ROAD
						// );

						// find connecting block centre & add to centrePositions
						let connectingBlockCentrePosition = this.getPositionFromDirection(blockPosition, blockPosition.direction, 2);

						//console.log(`connectingBlockCentrePosition: ${JSON.stringify(connectingBlockCentrePosition)}`);

						if (connectingBlockCentrePosition) {
							connectingBlockCentrePosition.isRoad = true;
							const connectingBlockCentrePositionId = this.helper.getPosName(blockPosition.x, blockPosition.y);
							//console.log(`connectingBlockCentrePositionId: ${JSON.stringify(connectingBlockCentrePositionId)}`);
							if (!positionsChecked[connectingBlockCentrePositionId]) {
								//console.log(`connectingBlockCentrePosition: ${JSON.stringify(connectingBlockCentrePosition)}`);
								centrePositions.push(connectingBlockCentrePosition);
							}
						}
					} else if (blockPositionData && blockPositionData.canBuild) {
						let strucType = this.structureArray.shift();

						if (!strucType) {
							break;
						}

						if (!this.roomSurveyData.structureMap[strucType]) {
							this.roomSurveyData.structureMap[strucType] = [];
						}

						this.roomSurveyData.structureMap[strucType].push({ x: blockPosition.x, y: blockPosition.y });
						// global.debug.colorPositionByStructure(
						// 	new RoomPosition(blockPosition.x, blockPosition.y, this.roomSurveyData.room),
						// 	strucType
						// );
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
				//console.log(`return null`);
				return null;
		}

		if (this.helper.isPosNearEdge(x, y)) {
			//console.log(`near edge`);
			return null;
		}

		let returnedPosition = { x, y, direction };
		//console.log(`returnedPosition: ${JSON.stringify(returnedPosition)}`);

		return returnedPosition;
	};

	// this.getSurroundingPositions = (x, y) => {
	// 	let topPos = { x: x, y: y + 1, direction: TOP },
	// 		leftPos = { x: x - 1, y, direction: LEFT },
	// 		rightPos = { x: x, y: y + 1, direction: RIGHT },
	// 		bottomPos = { x: x, y: y - 1, direction: BOTTOM },
	// 		topRightPos = { x: x + 1, y: y + 1, direction: TOP_RIGHT },
	// 		topLeftPos = { x: x - 1, y: y + 1, direction: TOP_LEFT },
	// 		bottomLeftPos = { x: x - 1, y: y - 1, direction: BOTTOM_LEFT },
	// 		bottomRightPos = { x: x + 1, y: y - 1, direction: BOTTOM_RIGHT };

	// 	return [topPos, rightPos, bottomPos, leftPos, topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
	// };

	// this.getStructurePositions = (x, y) => {
	// 	let topPos = { x: x, y: y + 1, direction: TOP },
	// 		leftPos = { x: x - 1, y, direction: LEFT },
	// 		rightPos = { x: x, y: y + 1, direction: RIGHT },
	// 		bottomPos = { x: x, y: y - 1, direction: BOTTOM };

	// 	return [topPos, rightPos, bottomPos, leftPos];
	// };

	// this.getRoadPositions = (x, y) => {
	// 	let topRightPos = { x: x + 1, y: y + 1, direction: TOP_RIGHT },
	// 		topLeftPos = { x: x - 1, y: y + 1, direction: TOP_LEFT },
	// 		bottomLeftPos = { x: x - 1, y: y - 1, direction: BOTTOM_LEFT },
	// 		bottomRightPos = { x: x + 1, y: y - 1, direction: BOTTOM_RIGHT };

	// 	return [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
	// };

	// this.isLinearDirection = (direction) => {
	// 	switch (direction) {
	// 		case TOP:
	// 			return true;
	// 		case TOP_RIGHT:
	// 			return false;
	// 		case RIGHT:
	// 			return true;
	// 		case BOTTOM_RIGHT:
	// 			return false;
	// 		case BOTTOM:
	// 			return true;
	// 		case BOTTOM_LEFT:
	// 			return false;
	// 		case LEFT:
	// 			return true;
	// 		case TOP_LEFT:
	// 			return false;
	// 		default:
	// 			return false;
	// 	}
	// };

	// this.isRoadPosition = (originalPosition, positionToBeChecked) => {
	// 	// determine previous parent direction
	// 	//var direction = this.getDirectionOfPositionFromPosition(originalPosition, positionToBeChecked);
	// 	// check what type of road
	// 	switch (originalPosition.basePositionType) {
	// 		case BASE_POSITION_TYPES.CROSS_ROAD:
	// 			return this.isLinearDirection(positionToBeChecked.direction);
	// 		case BASE_POSITION_TYPES.CONNECTING_ROAD_ONE:
	// 			return originalPosition.direction === positionToBeChecked.direction;
	// 		case BASE_POSITION_TYPES.CONNECTING_ROAD_TWO:
	// 			return originalPosition.direction === positionToBeChecked.direction;
	// 		default:
	// 			return false;
	// 	}
	// };

	// this.createNewStructureMap = function () {
	// 	return {
	// 		spawn: {},
	// 		extension: {},
	// 		road: {},
	// 		constructedWall: {},
	// 		rampart: {},
	// 		controller: {},
	// 		link: {},
	// 		storage: {},
	// 		tower: {},
	// 		observer: {},
	// 		powerSpawn: {},
	// 		extractor: {},
	// 		lab: {},
	// 		terminal: {},
	// 		container: {},
	// 		nuker: {},
	// 	};
	// };

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
};
