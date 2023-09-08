class Room {
	name = null;
	sources = {};
	controller = null;
	terrain = null;

	constructor(_name) {
		this.name = _name;
	}

	find = (searchType) => {
		switch (searchType) {
			case FIND_SOURCES:
				const sourceIds = Object.values(this.sources);
				var array = [];

				sourceIds.forEach((element) => {
					array.push(element);
				});
				return array;
		}
	};

	getTerrain = () => {
		return this.terrain;
	};

	lookAtArea = (top, left, bottom, right, asArray) => {
		//
	};
}

module.exports = Room;
