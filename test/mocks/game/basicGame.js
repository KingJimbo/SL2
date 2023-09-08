var game = {
	time: 100,
	gameObjects: {},
	rooms: {},
	getObjectById: (objectId) => {
		return game.gameObjects[objectId];
	},
	// mock method to add mock game objects
	registerObject: (regObject) => {
		game.gameObjects[regObject.id] = regObject;
	},
};

module.exports = game;
