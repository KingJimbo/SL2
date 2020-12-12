module.exports = {
	runIdleCreep: (creep) => {
		if (!Memory.idleCreeps[creep.name]) {
			console.log("No creep name found idle creep memory adding to idle pool");
			//this.creepRequisitioner.addCreepToIdlePool(creep.room, creep);
		}
		creep.moveTo(0, 0);
	},
};
