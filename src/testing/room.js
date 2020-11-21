//var findSourcesData = require("./data/roomFindSourcesData");
//var findSourcesData = new FindSourcesData();
//var findExitData = require("./data/roomFindSourcesData");
//var findExitData = new FindExitData();

module.exports = {
	// _findSourcesData: findSourcesData.data,
	// _findExitData: findExitData.data,
	name: "sim",
	energyAvailable: 300,
	energyCapacityAvailable: 300,
	survivalInfo: {},
	visual: { roomName: "sim" },
	getTerrain: () => {
		// return terrain object
		return {
			get: (x, y) => {
				var _positions = require("./data/roomPositionTerrainData");
				return _positions.data[x][y];
			}
		};
	},
	find: constant => {
		console.log(`constant passed ${constant}`);
		switch (constant) {
			case global.FIND_SOURCES:
				//console.log("_findSourcesData" + JSON.stringify(this._findSourcesData));
				var sources = require("./data/roomFindSourcesData");
				return sources.data;
			case global.FIND_MINERALS:
				return [];
			case global.FIND_EXIT:
				//console.log("_findExitData" + JSON.stringify(this._findExitData));
				var findExitData = require("./data/roomFindSourcesData");
				return findExitData.data;
		}
	},
	getPositionAt: (x, y) => {
		return { x: x, y: y, roomName: this.name };
	}
};
