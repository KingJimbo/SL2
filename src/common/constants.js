/** constants.js **/
global.PRIORITY_LOW = "low";
global.PRIORITY_MEDIUM = "medium";
global.PRIORITY_HIGH = "high";

global.OBJECT_TYPE_COLONY = "colony";
global.OBJECT_TYPE_RESOURCE_REQUEST = "resourceRequest";
global.OBJECT_TYPE_SOURCE_OPERATION = "sourceOperation";
global.OBJECT_TYPE_SOURCE_MEMORY = "sourceMemory";
global.OBJECT_TYPE_CREEP_ID = "creepId";

global.CREEP_TYPE_UTILITY = "utility";
global.CREEP_TYPE_MINER = "miner";
global.CREEP_TYPE_TRANSPORTER = "transporter";
global.CREEP_TYPE_CLAIMER = "claimer";
global.CREEP_TYPE_MELEE = "melee";
global.CREEP_TYPE_RANGED = "ranged";
global.CREEP_TYPE_TANK = "tank";
global.CREEP_TYPE_HEALER = "healer";

global.COLONY_CREEP_QUEUE_FREE = "free";
global.COLONY_CREEP_QUEUE_BUSY = "busy";

global.CREEP_TEMPLATES = {
	CREEP_TYPE_UTILITY: {
		MOVE: 0.3,
		WORK: 0.3,
		CARRY: 0.3,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0
	},
	CREEP_TYPE_MINER: {
		MOVE: 0.1,
		WORK: 0.9,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0
	},
	CREEP_TYPE_TRANSPORTER: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0.5,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0
	},
	CREEP_TYPE_CLAIMER: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0.5
	},
	CREEP_TYPE_MELEE: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0.5,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0
	},
	CREEP_TYPE_RANGED: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0.5,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0
	},
	CREEP_TYPE_TANK: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0.25,
		RANGED_ATTACK: 0,
		TOUGH: 0.25,
		HEAL: 0,
		CLAIM: 0
	},
	CREEP_TYPE_HEALER: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0.5,
		CLAIM: 0
	}
};

//     MOVE: "move",
//     WORK: "work",
//     CARRY: "carry",
//     ATTACK: "attack",
//     RANGED_ATTACK: "ranged_attack",
//     TOUGH: "tough",
//     HEAL: "heal",
//     CLAIM: "claim",
