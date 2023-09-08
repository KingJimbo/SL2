var source1 = require("../source/source1");
var controller1 = require("../controllers/controller1");

var room1 = {
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
	sources: {
		source1,
	},
};

source1.room = room1;

module.exports = room1;
