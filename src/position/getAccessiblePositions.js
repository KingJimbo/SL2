const getAccessiblePositions = (pos, includeObjects) => {
	if (!pos) {
		console.log(JSON.stringify(pos));
		throw new Error("Invalid position provided");
	}

	var room = Game.rooms[pos.roomName];
	var terrain = room.getTerrain();
	var accessiblePositions = [];

	let surroundingPositions = [
		{ x: pos.x - 1, y: pos.y - 1 },
		{ x: pos.x - 1, y: pos.y },
		{ x: pos.x - 1, y: pos.y + 1 },
		{ x: pos.x, y: pos.y - 1 },
		{ x: pos.x, y: pos.y + 1 },
		{ x: pos.x + 1, y: pos.y - 1 },
		{ x: pos.x + 1, y: pos.y },
		{ x: pos.x + 1, y: pos.y + 1 },
	];

	surroundingPositions.forEach((pos) => {
		const terrainGet = terrain.get(pos.x, pos.y);

		if (terrainGet === undefined || terrainGet === null) {
			return; // can't fetch terrain so can't determine if it's free
		}

		let blockingObjects = null;

		if (terrainGet !== TERRAIN_MASK_WALL && includeObjects) {
			blockingObjects = room.lookAt(new RoomPosition(pos.x, pos.y, room.name));

			if (blockingObjects) {
				blockingObjects = blockingObjects.filter((object) => {
					return object.type === "creep" || (object.type === "structure" && !WALKABLE_STRUCTURES.includes(object.structure.structureType));
				});
			}
		}

		const isAccessible =
			pos.x >= 0 &&
			pos.x <= COORDINATES_MAX_SIZE &&
			pos.y >= 0 &&
			pos.y <= COORDINATES_MAX_SIZE &&
			terrainGet !== TERRAIN_MASK_WALL &&
			(!includeObjects || (includeObjects && blockingObjects && blockingObjects.length === 0));

		if (process.env.NODE_ENV === "development") {
			global.logger.log(
				`pos ${JSON.stringify(pos)},
            terrainGet ${JSON.stringify(terrainGet)},
            includeObjects ${JSON.stringify(includeObjects)},
            blockingObjects ${JSON.stringify(blockingObjects)},
            isAccessible ${JSON.stringify(isAccessible)},`,
				[LOG_GROUPS.POSITION]
			);
		}

		if (isAccessible) {
			accessiblePositions.push(pos);
		}
	});

	return accessiblePositions;
};

module.exports = getAccessiblePositions;
