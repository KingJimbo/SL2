const filterLookAtAreaResultsArray = require("../room/lookAt/filterLookAtAreaResultsArray");

const getStuffNearByPosition = (pos, distance, filter) => {
	const top = pos.y + distance,
		left = pos.x - distance,
		bottom = pos.y - distance,
		right = pos.x + distance;

	const room = Game.rooms[pos.roomName];
	const asArray = true;

	let lookResults = room.lookAtArea(top, left, bottom, right, asArray);

	if (!filter) {
		return lookResults;
	}

	if (filter.structure) {
		lookResults = filterLookAtAreaResultsArray(lookResults, filter);
	}

	return lookResults;
};

module.exports = getStuffNearByPosition;
