module.exports = {
	removeCreepRole: (creep) => {
		if (creep) {
			delete creep.memory.role;
		}
	},
};
