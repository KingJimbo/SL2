module.exports = function ({ memoryManager, game }) {
	this.memoryManager = memoryManager;
	this.game = game;

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

		let x = 0,
			y = 0,
			roomSurveyData = { positionData: {} };

		if (room) {
			// scan each position
			while (x <= COORDINATES_MAX_SIZE && y <= COORDINATES_MAX_SIZE) {
				// check position

				roomSurveyData.positionData[x + '-' + y] = this.checkPosition(room.getPositionAt(x, y));

				x++;

				roomSurveyData.positionData[x + '-' + y] = this.checkPosition(room.getPositionAt(x, y));

				y++;
			}

			room.memory.surveyData = roomSurveyData;
		}

		return roomSurveyData;
	};

	this.checkPosition = function (pos) {
		let posSurveyData = {
			canBuild: true,
			canTravel: true,
		};

		var terrainData = this.checkPositionTerrain(pos);

		var distanceData = this.getPositionDistanceData(pos);

		posSurveyData = { ...posSurveyData, ...terrainData, ...distanceData };

		return posSurveyData;
	};

	this.checkPositionTerrain = function (pos) {
		const posLookResult = pos.look();
		posLookResult.forEach(function (lookObject) {
			if (lookObject.type == LOOK_TERRAIN) {
				switch (lookObject[LOOK_TERRAIN]) {
					case 'plain':
						// free to build & travel on
						break;
					case 'wall':
						return { canBuild: false, canTravel: false };
					case 'swamp':
						// free to build on but avoid
						return { canTravel: false };
					case 'lava':
						return { canBuild: false, canTravel: false };
				}
			}
		});

		return {};
	};

	this.getPositionDistanceData = function (pos) {
		let room = this.game.rooms[startPos.roomName];

		let positionDistanceData = {
			distances: {
				sources: [],
				minerals: [],
				controller: [],
				exits: [],
			},
			closestMineral: 0,
			closestSource: 0,
			closestExit: 0,
			totalDistance: 0,
			totalExitDistance: 0,
			totalMineralDistance: 0,
			totalSourceDistance: 0,
		};

		room.find(FIND_SOURCES).forEach(function (source) {
			var ret = PathFinder.search(pos, { pos: source.pos, range: 1 });
			positionDistanceData.distances.sources.push({ id: mineral.id, cost: ret.cost });
			positionDistanceData.totalDistance += ret.cost;
			positionDistanceData.totalSourceDistance += ret.cost;

			if (positionDistanceData.closestSource > ret.cost) {
				positionDistanceData.closestSource = ret.cost;
			}
		});

		room.find(FIND_MINERALS).forEach(function (mineral) {
			var ret = PathFinder.search(pos, { pos: mineral.pos, range: 1 });
			positionDistanceData.distances.minerals.push({ id: mineral.id, cost: ret.cost });
			positionDistanceData.totalDistance += ret.cost;
			positionDistanceData.totalMineralDistance += ret.cost;

			if (positionDistanceData.closestMineral > ret.cost) {
				positionDistanceData.closestMineral = ret.cost;
			}
		});

		room.find(FIND_EXITS).forEach(function (exit) {
			var ret = PathFinder.search(pos, { pos: exit, range: 0 });
			positionDistanceData.distances.exits.push({ id: mineral.id, cost: ret.cost });
			positionDistanceData.totalDistance += ret.cost;
			positionDistanceData.totalExitDistance += ret.cost;

			if (positionDistanceData.closestExit > ret.cost) {
				positionDistanceData.closestExit = ret.cost;
			}
		});

		var ret = PathFinder.search(pos, { pos: room.controller.pos, range: 1 });
		positionDistanceData.distances.controllers.push({ id: room.controller.id, cost: ret.cost });
		positionDistanceData.totalDistance += ret.cost;

		return positionDistanceData;
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


    */
	};
};
