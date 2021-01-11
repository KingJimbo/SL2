const position = {
	getPosName: (x, y) => {
		return `${x}-${y}`;
	},

	isPosNearEdge: (x, y) => {
		return x === 0 || x === COORDINATES_MAX_SIZE || y === 0 || y === COORDINATES_MAX_SIZE;
	},

	getPositionFromDirection: (originalPos, direction, distance) => {
		//global.logger.log(`getPositionFromDirection: ${JSON.stringify(originalPos)}, ${JSON.stringify(direction)}, ${JSON.stringify(distance)}`);

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
				//global.logger.log(`return null`);
				return null;
		}

		if (position.isPosNearEdge(x, y)) {
			//global.logger.log(`near edge`);
			return null;
		}

		let returnedPosition = { x, y, direction };
		//global.logger.log(`returnedPosition: ${JSON.stringify(returnedPosition)}`);

		return returnedPosition;
	}, // getPositionFromDirection END

	getAccessiblePositions: (pos, includeObjects) => {
		if (!pos) {
			global.logger.log("getAccessiblePositions invalid parameter");
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
			let blockingObjects = null;

			if (terrainGet !== TERRAIN_MASK_WALL && includeObjects) {
				blockingObjects = room.lookAt(new RoomPosition(pos.x, pos.y, room.name));

				if (blockingObjects) {
					blockingObjects = blockingObjects.filter((object) => {
						return (
							object.type === "creep" || (object.type === "structure" && !WALKABLE_STRUCTURES.includes(object.structure.structureType))
						);
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
	}, // getAccessiblePositions END
};

module.exports = position;
