const getPositionFromDirection = (originalPos, direction, distance) => {
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
			return null;
	}

	if (position.isPosNearEdge(x, y)) {
		return null;
	}

	let returnedPosition = { x, y, direction };

	return returnedPosition;
};

module.exports = getPositionFromDirection;
