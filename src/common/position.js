const position = {
	getPosName: (x, y) => {
		return `${x}-${y}`;
	},

	isPosNearEdge: (x, y) => {
		return x === 0 || x === COORDINATES_MAX_SIZE || y === 0 || y === COORDINATES_MAX_SIZE;
	},

	getPositionFromDirection: (originalPos, direction, distance) => {
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

		if (position.isPosNearEdge(x, y)) {
			//console.log(`near edge`);
			return null;
		}

		let returnedPosition = { x, y, direction };
		//console.log(`returnedPosition: ${JSON.stringify(returnedPosition)}`);

		return returnedPosition;
	}, // getPositionFromDirection END

	getAccessiblePositions: (pos) => {
		if (!pos) {
			console.log("getAccessiblePositions invalid parameter");
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
			const isAccessible =
				pos.x >= 0 && pos.x <= COORDINATES_MAX_SIZE && pos.y >= 0 && pos.y <= COORDINATES_MAX_SIZE && terrainGet !== TERRAIN_MASK_WALL;

			if (isAccessible) {
				accessiblePositions.push(pos);
			}
		});

		return accessiblePositions;
	}, // getAccessiblePositions END
};

module.exports = position;
