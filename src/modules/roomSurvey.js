(() => {
	const { getPosName, isPosNearEdge, getPositionFromDirection, getAccessiblePositions } = require("../common/position");
	let roomSurveyModule = {
		sources: [],
		minerals: [],
		exits: [],
		roomTerrain: null,
		room: null,
		surveyVersion: 0.1,

		roomSurveyData: {
			room: null,
			progressPos: { x: 0, y: 0 },
			exitPathPosCounts: {},
			positionData: {},
			totalExits: 0,
		},

		surveyRoomForStructures: (room) => {
			// surveyRoomForStructures
			if (
				room &&
				(!room.memory.structureMap ||
					!room.memory.structureMapVersion ||
					(room.memory.structureMapVersion && roomSurveyModule.surveyVersion > room.memory.structureMapVersion))
			) {
				roomSurveyModule.room = room;
				roomSurveyModule.roomSurveyData.room = room.name;

				if (!roomSurveyModule.roomTerrain) {
					roomSurveyModule.roomTerrain = room.getTerrain();
				}

				//console.log(`terrainData = ${JSON.stringify(this.roomTerrain)}`);

				roomSurveyModule.sources = room.find(FIND_SOURCES);

				//console.log(`sources = ${JSON.stringify(this.sources)}`);

				roomSurveyModule.minerals = room.find(FIND_MINERALS);

				//console.log(`minerals = ${JSON.stringify(this.minerals)}`);

				roomSurveyModule.exits = room.find(FIND_EXIT);

				//console.log(`exits = ${JSON.stringify(this.exits)}`);

				roomSurveyModule.roomSurveyData.totalExits = roomSurveyModule.exits.length;

				const lookAtArray = room.lookAtArea(0, 0, COORDINATES_MAX_SIZE, COORDINATES_MAX_SIZE, true); // as array
				//console.log(`lookAtArray = ${JSON.stringify(lookAtArray.length)}`);

				for (const i in lookAtArray) {
					const lookAtItem = lookAtArray[i];

					if (lookAtItem.type === LOOK_TERRAIN) {
						roomSurveyModule.roomSurveyData.positionData[getPosName(lookAtItem.x, lookAtItem.y)] = roomSurveyModule.checkPosition(
							lookAtItem
						);
					}
				}

				//console.log("setting structure map");
				roomSurveyModule.generateStructureMap(roomSurveyModule.roomSurveyData);

				console.log(`roomSurveyModule = ${JSON.stringify(roomSurveyModule)}`);

				room.memory.structureMap = roomSurveyModule.roomSurveyData.structureMap;
				room.memory.structureMapGeneratedTime = Game.time;
				room.memory.structureMapVersion = roomSurveyModule.surveyVersion;
			}
		}, // surveyRoomForStructures END

		checkPosition: (pos) => {
			//console.log(`checkPostitionStart pos = ${JSON.stringify(pos)}`);
			let posSurveyData = {
				canBuild: true,
				canTravel: true,
				x: pos.x,
				y: pos.y,
			};

			var terrainData = roomSurveyModule.checkPositionTerrain(pos);

			posSurveyData = { ...posSurveyData, ...terrainData };

			if (posSurveyData.canTravel) {
				var distanceData = roomSurveyModule.getPositionDistanceData(roomSurveyModule.room.getPositionAt(pos.x, pos.y));

				posSurveyData = { ...posSurveyData, ...distanceData };
			}

			return posSurveyData;
		}, // checkPosition END

		checkPositionTerrain: (pos) => {
			//console.log("checkPositionTerrain");
			const posTerrain = roomSurveyModule.roomTerrain.get(pos.x, pos.y);
			//console.log(`posTerrain: ${JSON.stringify(posTerrain)}`);
			switch (posTerrain) {
				case 0: //plain
					//console.log("checkPositionTerrain Plain");
					return { canBuild: !isPosNearEdge(pos.x, pos.y), terrain: "Plain" };
				case TERRAIN_MASK_WALL: //wall
					//console.log("checkPositionTerrain Wall");
					return { canBuild: false, canTravel: false, terrain: "Wall" };
				case TERRAIN_MASK_SWAMP: //swamp
					//console.log("checkPositionTerrain Swamp");
					return { canBuild: !isPosNearEdge(pos.x, pos.y), canTravel: false, terrain: "Swamp" };
			}
		}, // checkPositionTerrain END

		getPositionDistanceData: (posToCheck) => {
			//console.log("getPositionDistanceData");
			//console.log(`posToCheck: ${JSON.stringify(posToCheck)}`);

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

			if (!isPosNearEdge(posToCheck.x, posToCheck.y)) {
				let pos = new RoomPosition(posToCheck.x, posToCheck.y, roomSurveyModule.room.name);

				for (const i in roomSurveyModule.sources) {
					const source = roomSurveyModule.sources[i];
					const searchObject = { pos: source.pos, range: 1 };
					// console.log(`pos: ${JSON.stringify(pos)}`);
					// console.log(`searchObject: ${JSON.stringify(searchObject)}`);
					//var ret = PathFinder.search(pos, searchObject);
					var ret = PathFinder.search(pos, { pos: source.pos, range: 1 });
					positionDistanceData.distances.sources.push({ id: source.id, cost: ret.cost });
					positionDistanceData.totalDistance += ret.cost;
				}

				// //console.log("getPositionDistanceData got sources");

				roomSurveyModule.minerals.forEach((mineral) => {
					var ret = PathFinder.search(pos, { pos: mineral.pos, range: 1 });
					positionDistanceData.distances.mineral = { id: mineral.id, cost: ret.cost };
					positionDistanceData.totalDistance += ret.cost;
				});
			}

			return positionDistanceData;
		}, // getPositionDistanceData END

		generateStructureMap: (surveyData) => {
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

					let exitPathCountPossible = roomSurveyModule.getSurroundingPositionExitPathCounts(positionData.x, positionData.y);

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

			if (process.env.NODE_ENV === "development") {
				console.log(`hit structure map initialisation`);
			}

			surveyData.structureMap = {};

			let structureArray = [];
			//console.log(`STRUCTURE_PRIORITY: ${JSON.stringify(STRUCTURE_PRIORITY)}`);
			for (const j in STRUCTURE_PRIORITY) {
				//console.log(`type: ${JSON.stringify(type)}`);
				//console.log(`CONTROLLER_STRUCTURES: ${JSON.stringify(CONTROLLER_STRUCTURES)}`);
				const type = STRUCTURE_PRIORITY[j];
				let structureMax = CONTROLLER_STRUCTURES[type][8];

				for (var i = 0; i < structureMax; i++) {
					structureArray.push(type);
				}
			}

			roomSurveyModule.structureArray = structureArray;
			//console.log(`structureArray: ${JSON.stringify(structureArray)}`);

			roomSurveyModule.mapContainers();
			roomSurveyModule.mapStructures(roomSurveyModule.structureArray, idealSpawnPosition);
		}, //generateStructureMap END

		mapContainers: () => {
			if (!roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_CONTAINER]) {
				roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_CONTAINER] = [];
			}

			roomSurveyModule.sources.forEach((source) => {
				var freePositions = getAccessiblePositions(source.pos);
				if (freePositions) {
					const firstPos = freePositions[0];
					const posId = getPosName(firstPos.x, firstPos.y);
					let firstPosData = roomSurveyModule.roomSurveyData.positionData[posId];

					roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_CONTAINER].push({ x: firstPos.x, y: firstPos.y });
					firstPosData.hasStructure;
					roomSurveyModule.roomSurveyData.positionData[posId] = firstPosData;
				}
			});
		}, // mapContainers END

		mapStructures: (structureArray, idealSpawnPosition) => {
			let centrePositions = [idealSpawnPosition];
			let positionsChecked = {};

			while (structureArray && structureArray.length > 0 && centrePositions && centrePositions.length > 0) {
				let centrePosition = centrePositions.shift();
				const centrePositionId = getPosName(centrePosition.x, centrePosition.y);

				// console.log(`centrePositions: ${JSON.stringify(centrePositions)}`);
				// console.log(`centrePosition: ${JSON.stringify(centrePosition)}`);

				let centrePositionData = roomSurveyModule.roomSurveyData.positionData[centrePositionId];
				// console.log(`positionData: ${JSON.stringify(this.roomSurveyData.positionData)}`);
				// console.log(`centrePositionData: ${JSON.stringify(centrePositionData)}`);

				if (centrePositionData && centrePositionData.canTravel && !centrePositionData.hasStructure) {
					if (!roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
						roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
					}
					roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: centrePosition.x, y: centrePosition.y });
					centrePositionData.hasStructure = true;
					roomSurveyModule.roomSurveyData.positionData[centrePositionId] = centrePositionData;
					// global.debug.colorPositionByStructure(new RoomPosition(centrePosition.x, centrePosition.y, this.roomSurveyData.room), STRUCTURE_ROAD);
				}

				const blockPositions = roomSurveyModule.getDefaultBaseTemplatePositionBlock(centrePosition);

				//console.log(`blockPositions: ${JSON.stringify(blockPositions)}`);

				for (const i in blockPositions) {
					const blockPosition = blockPositions[i],
						blockPositionId = getPosName(blockPosition.x, blockPosition.y);

					//console.log(`blockPosition: ${JSON.stringify(blockPosition)}`);

					let blockPositionData = roomSurveyModule.roomSurveyData.positionData[blockPositionId];

					if (blockPositionData && !blockPositionData.hasStructure) {
						if (blockPosition.isRoad && blockPositionData.canTravel) {
							// add road structure
							if (!roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_ROAD]) {
								roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_ROAD] = [];
							}
							roomSurveyModule.roomSurveyData.structureMap[STRUCTURE_ROAD].push({ x: blockPosition.x, y: blockPosition.y });
							// global.debug.colorPositionByStructure(
							// 	new RoomPosition(blockPosition.x, blockPosition.y, this.roomSurveyData.room),
							// 	STRUCTURE_ROAD
							// );

							// find connecting block centre & add to centrePositions
							let connectingBlockCentrePosition = getPositionFromDirection(blockPosition, blockPosition.direction, 1);

							//console.log(`connectingBlockCentrePosition: ${JSON.stringify(connectingBlockCentrePosition)}`);

							if (connectingBlockCentrePosition) {
								connectingBlockCentrePosition.isRoad = true;
								const connectingBlockCentrePositionId = getPosName(blockPosition.x, blockPosition.y);
								//console.log(`connectingBlockCentrePositionId: ${JSON.stringify(connectingBlockCentrePositionId)}`);
								if (!positionsChecked[connectingBlockCentrePositionId]) {
									//console.log(`connectingBlockCentrePosition: ${JSON.stringify(connectingBlockCentrePosition)}`);
									centrePositions.push(connectingBlockCentrePosition);
								}
							}
						} else if (blockPositionData && blockPositionData.canBuild) {
							let strucType = roomSurveyModule.structureArray.shift();

							if (!strucType) {
								break;
							}

							if (!roomSurveyModule.roomSurveyData.structureMap[strucType]) {
								roomSurveyModule.roomSurveyData.structureMap[strucType] = [];
							}

							roomSurveyModule.roomSurveyData.structureMap[strucType].push({ x: blockPosition.x, y: blockPosition.y });
							// global.debug.colorPositionByStructure(
							// 	new RoomPosition(blockPosition.x, blockPosition.y, this.roomSurveyData.room),
							// 	strucType
							// );
						}
					}

					blockPositionData.hasStructure = true;
					roomSurveyModule.roomSurveyData.positionData[blockPositionId] = blockPositionData;
				}
			}
		}, //mapStructures END

		getDefaultBaseTemplatePositionBlock: (centrePosition) => {
			let positionArray = [];

			if (!centrePosition) {
				return positionArray;
			}

			let topLeftPosition = getPositionFromDirection(centrePosition, TOP_LEFT);
			if (topLeftPosition) {
				topLeftPosition.isRoad = true;
				positionArray.push(topLeftPosition);
			}

			let topPosition = getPositionFromDirection(centrePosition, TOP);
			if (topPosition) {
				topPosition.isRoad = false;
				positionArray.push(topPosition);
			}

			let topRightPosition = getPositionFromDirection(centrePosition, TOP_RIGHT);
			if (topRightPosition) {
				topRightPosition.isRoad = true;
				positionArray.push(topRightPosition);
			}

			let leftPosition = getPositionFromDirection(centrePosition, LEFT);
			if (leftPosition) {
				leftPosition.isRoad = false;
				positionArray.push(leftPosition);
			}

			let rightPosition = getPositionFromDirection(centrePosition, RIGHT);
			if (rightPosition) {
				rightPosition.isRoad = false;
				positionArray.push(rightPosition);
			}

			let bottomLeftPosition = getPositionFromDirection(centrePosition, BOTTOM_LEFT);
			if (bottomLeftPosition) {
				bottomLeftPosition.isRoad = true;
				positionArray.push(bottomLeftPosition);
			}

			let bottomPosition = getPositionFromDirection(centrePosition, BOTTOM);
			if (bottomPosition) {
				bottomPosition.isRoad = false;
				positionArray.push(bottomPosition);
			}

			let bottomRightPosition = getPositionFromDirection(centrePosition, BOTTOM_RIGHT);
			if (bottomRightPosition) {
				bottomRightPosition.isRoad = true;
				positionArray.push(bottomRightPosition);
			}

			return positionArray;
		},

		getSurroundingPositionExitPathCounts: (x, y) => {
			roomSurveyModule.exitPositions = [
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

			roomSurveyModule.exitPositions.forEach((pos) => {
				//console.log(`pos: ${JSON.stringify(pos)}`);
				let id = getPosName(pos.x, pos.y),
					positionData = roomSurveyModule.roomSurveyData.positionData[id];
				//console.log(`id: ${JSON.stringify(id)}`);
				//console.log(`roomSurveyData.positionData: ${JSON.stringify(this.roomSurveyData.positionData)}`);

				if (positionData && positionData.canTravel) {
					var exitPathPosCount = roomSurveyModule.roomSurveyData.exitPathPosCounts[id];
					if (exitPathPosCount) {
						count += exitPathPosCount;
					}
				}
			});

			return count;
		}, //getSurroundingPositionExitPathCounts END
	};

	global.App.roomSurveyModule = roomSurveyModule;
})();

module.exports = global.App.roomSurveyModule;
