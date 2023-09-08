var controller1 = require("../controllers/controller1");

var basicRoom = {
	controller: controller1,
	find: (searchType) => {
		switch (searchType) {
			case FIND_SOURCES:
				const sourceIds = Object.values(room1.sources);
				var array = [];

				sourceIds.forEach((element) => {
					array.push(element);
				});
				return array;
		}
	},
	name: "room1",
	sources: {},
};

module.exports = basicRoom;
