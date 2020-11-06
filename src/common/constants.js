/** constants.js **/

global.COORDINATES_MAX_SIZE = 49;

global.CREEP_ROLES = {
	HARVESTER: 'harvester',
	SCOUT: 'scout',
};

global.CREEP_TYPES = {
	UTILITY: 'utility',
	MINER: 'miner',
	HAULER: 'hauler',
	CLAIMER: 'claimer',
	MELEE: 'melee',
	RANGED: 'ranged',
	TANK: 'tank',
	HEALER: 'healer',
};

global.CREEP_BODIES = {
	[CREEP_TYPES.UTILITY]: {
		move: { value: 2 },
		work: { value: 1 },
		carry: { value: 1 },
		attack: { value: 0 },
		ranged_attack: { value: 0 },
		tough: { value: 0 },
		heal: { value: 0 },
		claim: { value: 0 },
	},
	[CREEP_TYPES.MINER]: {
		MOVE: 0.1,
		WORK: { value: 0.9, max: 5 },
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0,
	},
	[CREEP_TYPES.HAULER]: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0.5,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0,
	},
	[CREEP_TYPES.CLAIMER]: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0.5,
	},
	[CREEP_TYPES.MELEE]: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0.5,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0,
	},
	[CREEP_TYPES.RANGED]: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0.5,
		TOUGH: 0,
		HEAL: 0,
		CLAIM: 0,
	},
	[CREEP_TYPES.TANK]: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0.25,
		RANGED_ATTACK: 0,
		TOUGH: 0.25,
		HEAL: 0,
		CLAIM: 0,
	},
	[CREEP_TYPES.HEALER]: {
		MOVE: 0.5,
		WORK: 0,
		CARRY: 0,
		ATTACK: 0,
		RANGED_ATTACK: 0,
		TOUGH: 0,
		HEAL: 0.5,
		CLAIM: 0,
	},
};

global.RESOURCE_ORDER_STRUCTURE_PRIORITY = [
	STRUCTURE_SPAWN,
	STRUCTURE_EXTENSION,
	STRUCTURE_ROAD,
	STRUCTURE_WALL,
	STRUCTURE_RAMPART,
	STRUCTURE_TOWER,
	STRUCTURE_STORAGE,
	//STRUCTURE_CONTAINER,
	//STRUCTURE_KEEPER_LAIR: "keeperLair",
	//STRUCTURE_PORTAL,
	//STRUCTURE_CONTROLLER,
	//STRUCTURE_LINK,

	//STRUCTURE_OBSERVER,
	//STRUCTURE_POWER_BANK: "powerBank",
	//STRUCTURE_POWER_SPAWN: "powerSpawn",
	//STRUCTURE_EXTRACTOR: "extractor",
	//STRUCTURE_LAB: "lab",
	//STRUCTURE_TERMINAL: "terminal",

	//STRUCTURE_NUKER: "nuker",
	//STRUCTURE_FACTORY: "factory",
	//STRUCTURE_INVADER_CORE: "invaderCore",
];
