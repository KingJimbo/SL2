module.exports = function () {
	this.sources = [];
	this.minerals = [];
	this.exists = [];
	this.roomTerrain = null;

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
			if (Memory.roomSurveyData) {
				this.roomSurveyData = Memory.roomSurveyData;
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

			this.sources = room.find(FIND_SOURCES);

			this.minerals = room.find(FIND_MINERALS);

			this.exists = room.find(FIND_EXITS);

			this.roomSurveyData.totalExits = this.exists.length;

			// scan each position
			while (x <= COORDINATES_MAX_SIZE && y <= COORDINATES_MAX_SIZE) {
				// check position

				this.roomSurveyData.positionData[this.getPosName(x, y)] = this.checkPosition(room.getPositionAt(x, y));

				x++;

				this.roomSurveyData.positionData[this.getPosName(x, y)] = this.checkPosition(room.getPositionAt(x, y));

				y++;

				Memory.roomSurveyData = this.roomSurveyData;
			}

			this.roomSurveyData.structureMap = this.generateStructureMap();

			Memory.roomSurveyData = this.roomSurveyData;

			room.memory.surveyData = this.roomSurveyData;
		}

		return roomSurveyData;
	};

	this.getPosName = (x, y) => {
		return x + '-' + y;
	};

	this.checkPosition = function (pos) {
		let posSurveyData = {
			canBuild: true,
			canTravel: true,
			x: pos.x,
			y: pos.y,
		};

		var terrainData = this.checkPositionTerrain(pos);

		var distanceData = this.getPositionDistanceData(pos);

		posSurveyData = { ...posSurveyData, ...terrainData, ...distanceData };

		return posSurveyData;
	};

	this.checkPositionTerrain = function (pos) {
		switch (this.roomTerrain.get(poz.x, pos.y)) {
			case 0: //plain
				return {};
			case TERRAIN_MASK_WALL: //wall
				return { canBuild: false, canTravel: false };
			case TERRAIN_MASK_SWAMP: //swamp
				return { canTravel: false };
		}
	};

	this.getPositionDistanceData = function (pos) {
		let room = this.game.rooms[startPos.roomName];

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

		this.minerals.forEach(function (mineral) {
			var ret = PathFinder.search(pos, { pos: mineral.pos, range: 1 });
			positionDistanceData.distances.mineral = { id: mineral.id, cost: ret.cost };
			positionDistanceData.totalDistance += ret.cost;
		});

		this.exists.forEach(function (exit) {
			var ret = PathFinder.search(pos, { pos: exit, range: 0 });
			positionDistanceData.distances.exits.push({ id: mineral.id, cost: ret.cost });
			positionDistanceData.totalExitDistance += ret.cost;

			if (positionDistanceData.closestExit > ret.cost) {
				positionDistanceData.closestExit = ret.cost;
			}

			if (ret.path) {
				ret.path.foreach((pathPos) => {
					let id = `${pathPos.x}-${pathPos.y}`;
					this.roomSurveyData.exitPathPosCounts[id]
						? this.roomSurveyData.exitPathPosCounts[id]++
						: (this.roomSurveyData.exitPathPosCounts[id] = 0);
				});
			} else {
				console.log(`No path found to exit for ${JSON.stringify(exit)}`);
			}
		});

		var ret = PathFinder.search(pos, { pos: room.controller.pos, range: 1 });
		positionDistanceData.distances.controller = { id: room.controller.id, cost: ret.cost };
		positionDistanceData.totalDistance += ret.cost;

		return positionDistanceData;
	};

	this.generateStructureMap = () => {
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

		for (const i in this.roomSurveyData.positionData) {
			let positionData = this.roomSurveyData.positionData[i],
				totalSourceDistance = 0,
				posNearestSourceDistance = 1000;

			if (positionData.canBuild) {
				positionData.distances.sources.foreach((distance) => {
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

				let controllerDistance = positionData.distances.constroller.cost;

				let exitPathCount = this.getSurroundingPositionExitPathCounts(positionData.x, positionData.y);

				let spawnWeight =
					weights.spawn.nearSource * posNearestSourceDistance +
					weights.spawn.nearSources * totalSourceDistance +
					weights.spawn.nearController * controllerDistance +
					weights.spawn.defendability * exitPathCount;

				if (spawnWeight < bestSpawnWeight) {
					bestSpawnWeight = spawnWeight;
					idealSpawnPosition = { id: i, x: positionData.x, y: positionData.y };
				}
			}
		}

		if (!idealSpawnPosition) {
			console.log('generateStructureMap: can not find ideal spawn position!');
			return;
		}

		this.roomSurveyData.structureMap = this.createNewStructureMap();

		let structureArray = [];

		for (const type in RESOURCE_ORDER_STRUCTURE_PRIORITY) {
			let structureMax = CONTROLLER_STRUCTURES[type][8];

			for (var i = 0; i < structureMax; i++) {
				structureArray.push(type);
			}
		}

		let variance = 1,
			currentX = idealSpawnPosition.x,
			currentY = idealSpawnPosition.y,
			startX = idealSpawnPosition.x,
			startY = idealSpawnPosition.y,
			possiblePos = [];

		while (structureArray.length | (variance < COORDINATES_MAX_SIZE)) {
			// get corner pos
			startX++;
			startY++;
			currentX = startX;
			currentY = startY;

			this.assessPosForStructure(currentX, currentY);

			//increase side length
			variance++;

			console.log(`${currentX},${currentY}`);

			for (var x = 0; x < variance; x++) {
				currentX--;
				this.assessPosForStructure(currentX, currentY);
				console.log(`${currentX},${currentY}`);
			}

			for (var y = 0; y < variance; y++) {
				currentY--;
				console.log(`${currentX},${currentY}`);
				this.assessPosForStructure(currentX, currentY);
			}

			for (var x = 0; x < variance; x++) {
				currentX++;
				console.log(`${currentX},${currentY}`);
				this.assessPosForStructure(currentX, currentY);
			}

			for (var y = 1; y < variance; y++) {
				currentY++;
				console.log(`${currentX},${currentY}`);
				this.assessPosForStructure(currentX, currentY);
			}
		}

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

	this.assessPosForStructure = (x, y) => {
		switch (this.canStructureBePlaced(x, y)) {
			case 1:
				break;
			case 2:
				break;
		}
	};

	this.canStructureBePlaced = (x, y) => {
		let surroundingPositions = this.getSurroundingPositions(x, y),
			canBePlaced = true;

		// check each surrounding pos to see if you  can build on it
		// need to think of a better way of doing this. Checking surrounding positions to see where the current position is.

		surroundingPositions.foreach((pos) => {
			let id = this.getPosName(pos.x, pos.y),
				positionData = this.roomSurveyData.positionData[id];
			if (!this.doesPositionHaveOtherAccess(pos.x, pos.y)) {
				canBePlaced = false;
				break;
			}
		});

		if (canBePlaced) {
			// current pos is the top right
			let strucType = structureArray.shift();

			if (!this.roomSurveyData.structureMap[strucType]) {
				this.roomSurveyData.structureMap[strucType] = [];
			}

			this.roomSurveyData.structureMap[strucType].push({ x, y });
			positionData.hasStructure = true;

			this.roomSurveyData.positionData[id] = positionData;
		}

		return canBePlaced;
	};

	this.doesPositionHaveOtherAccess = (x, y, originX, originY) => {
		let surroundingPositions = this.getSurroundingPositions(x, y),
			hasOtherAccess = false;

		surroundingPositions.foreach((pos) => {
			let id = this.getPosName(pos.x, pos.y),
				positionData = this.roomSurveyData.positionData[id];

			// position that you can travel over , doens't have
			if (positionData.canTravel && !positionData.hasStructure && pos.x != originX && pos.y != originY) {
				hasOtherAccess = true;
				break;
			}
		});

		return hasOtherAccess;
	};

	this.getSurroundingPositions = (x, y) => {
		let topPos = { x: x, y: +1 },
			topRightPos = { x: x + 1, y: +1 },
			topLeftPos = { x: x - 1, y: +1 },
			leftPos = { x: x - 1, y },
			rightPos = { x: x, y: +1 },
			bottomPos = { x: x, y: -1 },
			bottomLeftPos = { x: x - 1, y: -1 },
			bottomRightPos = { x: x + 1, y: -1 };

		//const primaryPositions = [topPos, rightPos, bottomPos, leftPos];
		//const secondaryPositions = [topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
		return [topPos, rightPos, bottomPos, leftPos, topLeftPos, topRightPos, bottomLeftPos, bottomRightPos];
	};

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

		exitPositions.foreach((pos) => {
			let id = this.getPosName(pos.x, pos.y),
				positionData = this.roomSurveyData.positionData[id];

			if (positionData.canBuild) {
				count += this.roomSurveyData.exitPathPosCounts[id];
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
