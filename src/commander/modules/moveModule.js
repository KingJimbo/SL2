module.exports = function () {
	this.findPathTo = ({ startPos, endPos, disallowContainer, avoidCreeps, noRoads }) => {
		if (!startPos || !endPos) {
			logger.warning('pathFinderModule.findPathTo: Invalid start or end positions.');
		}

		let goal = { pos: endPos, range: 1 };

		return PathFinder.search(startPos, goals, {
			// We need to set the defaults costs higher so that we
			// can set the road cost lower in `roomCallback`
			plainCost: noRoads ? 1 : 2,
			swampCost: 10,

			roomCallback: function (roomName) {
				let room = Game.rooms[roomName];
				// In this example `room` will always exist, but since
				// PathFinder supports searches which span multiple rooms
				// you should be careful!
				if (!room) return;
				let costs = new PathFinder.CostMatrix();

				room.find(FIND_STRUCTURES).forEach(function (struct) {
					if (struct.structureType === STRUCTURE_ROAD && noRoads) {
						// Favor roads over plain tiles
						costs.set(struct.pos.x, struct.pos.y, 1);
					} else if (
						((disallowContainer && struct.structureType === STRUCTURE_CONTAINER) || struct.structureType !== STRUCTURE_CONTAINER) &&
						(struct.structureType !== STRUCTURE_RAMPART || !struct.my)
					) {
						// Can't walk through non-walkable buildings
						costs.set(struct.pos.x, struct.pos.y, 0xff);
					}
				});

				// Avoid creeps in the room
				if (avoidCreeps) {
					room.find(FIND_CREEPS).forEach(function (creep) {
						costs.set(creep.pos.x, creep.pos.y, 0xff);
					});
				}

				return costs;
			},
		});
	};

	this.getTotalTravelTime = ({ path, totalBodyCount, totalMove, totalEmptyCarry = 0 }) => {
		if (!path || !totalBodyCount || !totalMove) {
			logger.warning('MoveModule.calculateCreepMovement: Invalid paramerers.');
			return;
		}

		var fatigue = 0,
			totalTime = 0;

		path.forEach((pos) => {
			var isSwamp = false,
				isRoad = false,
				look = pos.look();

			// increase by 1 for each tick
			totalTime++;

			if (look) {
				look.forEach((item) => {
					if (item.type === 'terrain' && item.terrain === 'swamp') {
						isSwamp = true;
					} else if (item.type === 'structure' && item.structureType === STRUCTURE_ROAD) {
						isRoad = true;
					}
				});

				let weight = totalBodyCount - (totalMove + totalEmptyCarry);
				let terrainFactor = isSwamp ? 4 : 2;
				let roadFactor = isRoad ? 0.5 : 0;
				let fatigue = weight * (terrainFactor / roadFactor);
				const recovery = totalMove * 2;

				const recoveryTime = floor(fatigue / recovery);
				totalTime + recoveryTime;

				//F = 2 * (W * K - M)
				// Where:
				// 	F = initial fatigue value
				// 	W = creep weight (Number of body parts, excluding MOVE and empty CARRY parts)
				// 	K = terrain factor (0.5x for road, 1x for plain, 5x for swamp)
				// 	M = number of MOVE parts
			}
		});

		return totalTime;
	};
};
