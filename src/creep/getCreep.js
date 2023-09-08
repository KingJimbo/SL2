const getCreep = (name) => {
	let creep = Game.creeps[name];

	if (creep) {
		return creep;
	}

	// creep doesn't exist so remove from memory
};

module.exports = getCreep;
