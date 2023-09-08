require("../../test/constants/screepsConstants");

Object.assign(global, {
	COORDINATES_MAX_SIZE: 49,
	MIN_CONTROLLER_TICKS_TO_DOWNGRADE: 500,
	MIN_TOWER_ENERGY_CAPACITY: 200,
	HOSTILE_CREEP_PROXIMITY_DISTANCE: 6,
	ROOM_ROAD_POSITION_ADDED_TIME: 100,
	CREEP_WILL_DIE_SOON_TICK_VALUE: 50,

	CREEP_TYPE_UTILITY: "utility",
	CREEP_TYPE_MINER: "miner",
	CREEP_TYPE_HAULER: "hauler",
	CREEP_TYPE_CLAIMER: "claimer",
	CREEP_TYPE_MELEE: "melee",
	CREEP_TYPE_RANGED: "ranged",
	CREEP_TYPE_TANK: "tank",
	CREEP_TYPE_HEALER: "healer",
	CREEP_TYPE_SCOUT: "scout",

	JOB_TYPE: {
		HARVEST: "harvest",
		MINE: "mine",
	},

	RESOURCE_ORDER_STRUCTURE_PRIORITY: [
		STRUCTURE_EXTENSION,
		STRUCTURE_SPAWN,
		STRUCTURE_STORAGE,
		STRUCTURE_TERMINAL,
		STRUCTURE_POWER_SPAWN,
		STRUCTURE_FACTORY,
		STRUCTURE_NUKER,
		STRUCTURE_LAB,
		STRUCTURE_TOWER,
		STRUCTURE_CONTAINER,
		STRUCTURE_ROAD,
	],

	STRUCTURE_PRIORITY: [
		STRUCTURE_SPAWN,
		STRUCTURE_STORAGE,
		STRUCTURE_TERMINAL,
		STRUCTURE_POWER_SPAWN,
		STRUCTURE_FACTORY,
		STRUCTURE_NUKER,
		STRUCTURE_LAB,
		STRUCTURE_EXTENSION,
		STRUCTURE_TOWER,
		STRUCTURE_ROAD,
	],

	WALKABLE_STRUCTURES: [STRUCTURE_CONTAINER, STRUCTURE_RAMPART, STRUCTURE_ROAD],

	NEUTRAL_STRUCTURES: [STRUCTURE_CONTAINER, STRUCTURE_ROAD, STRUCTURE_WALL],

	GET_FIND_DIRECTION: {
		1: FIND_EXIT_TOP,
		3: FIND_EXIT_RIGHT,
		5: FIND_EXIT_BOTTOM,
		7: FIND_EXIT_LEFT,
	},

	BASE_POSITION_TYPES: {
		CROSS_ROAD: 0,
		CONNECTING_ROAD_ONE: 1,
		CONNECTING_ROAD_TWO: 1,
	},
	OPERATION_TYPE: {
		BUILD: "build",
		SOURCE: "source",
	},

	OPERATION_STATUS: {
		SUSPENDED: 0,
		ACTIVE: 1,
		TERMINATE: 2,
	},

	OBJECT_TYPE: {
		OPERATION: "operation",
		RESOURCE_ORDER: "resourceOrder",
		RESOURCE_ORDER_ITEM: "resourceOrderItem",
		SPAWN_QUEUE_ITEM: "spawnQueueItem",
		JOB: "job",
	},
	CREEP_ACTIONS: {
		BUILD: "build",
		FIND_REQUEST: "findRequest",
		GO_TO: "goTo",
		HARVEST: "harvest",
		IDLE: "idle",
		MINE: "mine",
		PICKUP: "pickup",
		REPAIR: "repair",
		TRANSFER: "transfer",
		UPGRADE: "upgrade",
		WITHDRAW: "withdraw",
	},

	CONDITION_OPERATORS: {
		AND: "and",
		OR: "or",
	},

	CONDITIONS: {
		EQUALS: "equals",
		LESS_THAN: "lessThan",
		GREATER_THAN: "greaterThan",
		LESS_THAN_OR_EQUAL: "lessThanOrEqualTo",
		GREATER_THAN_OR_EQUAL: "greaterThanOrEqualTo",
	},

	CONDITION_VALUE_TYPES: {
		CONTRTRUCTION_SITE: "constructionSite",
		CONTROLLER_LEVEL: "controllerLevel",
		CREEP_ROLE: "creepRole",
		ENERGY_TRANSPORT_REQUIRED: "energyTransportRequiredToCarryCapacity",
		ROOM_TOTAL_ENERGY_CAPACITY: "roomTotalEnergyCapacity",
		SOURCE: "source",
		SOURCE_WITH_CONTAINER: "sourceWithContainer",
		SOURCE_ACCESS: "sourceAccess",
		STRUCTURE_TYPE: "structureType",
	},
});

Object.assign(global, {
	ESSENTIAL_HARVEST_TYPES: [CREEP_TYPE_UTILITY, CREEP_TYPE_MINER],

	ESSENTIAL_MINER_TYPES: [CREEP_TYPE_UTILITY, CREEP_TYPE_HAULER],

	CREEP_BODIES: {
		utilty: {
			move: { value: 2 },
			work: { value: 1 },
			carry: { value: 1 },
			attack: { value: 0 },
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 0 },
		},
		miner: {
			move: 1,
			work: 5,
			carry: 0,
			attack: 0,
			ranged_attack: 0,
			tough: 0,
			heal: 0,
			claim: 0,
			maxRatio: 1,
		},
		hauler: {
			move: { value: 1 },
			work: { value: 0 },
			carry: { value: 1 },
			attack: { value: 0 },
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 0 },
		},
		claimer: {
			move: { value: 1 },
			work: { value: 0 },
			carry: { value: 0 },
			attack: { value: 0 },
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 1 },
			maxRatio: 1,
		},
		melee: {
			move: { value: 1 },
			work: { value: 0 },
			carry: { value: 0 },
			attack: { value: 1 },
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 0 },
		},
		ranged: {
			move: { value: 1 },
			work: { value: 0 },
			carry: { value: 0 },
			attack: { value: 0 },
			ranged_attack: { value: 1 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 0 },
		},
		tank: {
			move: { value: 2 },
			work: { value: 0 },
			carry: { value: 0 },
			attack: { value: 1 },
			ranged_attack: { value: 0 },
			tough: { value: 1 },
			heal: { value: 0 },
			claim: { value: 0 },
		},
		healer: {
			move: { value: 1 },
			work: { value: 0 },
			carry: { value: 0 },
			attack: { value: 0 },
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 1 },
			claim: { value: 0 },
		},
		scout: {
			move: { value: 1 },
			work: { value: 0 },
			carry: { value: 0 },
			attack: { value: 0 },
			ranged_attack: 0,
			tough: 0,
			heal: 0,
			claim: 0,
			maxRatio: 1,
		},
	},

	// ROOM_CREEP_ROLE_SPAWN_CONDITIONS: {
	// 	harvester: [
	// 		{
	// 			operator: "or",
	// 			conditions: [
	// 				{ condition: "lessThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 300 },
	// 				{ condition: "lessThan", valueType: "creepRole", creepRole: "miner", value: 1 },
	// 				{ condition: "lessThan", valueType: "creepRole", creepRole: "hauler", value: 1 },
	// 			],
	// 		},
	// 	],
	// 	miner: [
	// 		{
	// 			operator: "and",
	// 			conditions: [
	// 				{ condition: "greaterThan", valueType: "controllerLevel", value: 1 },
	// 				{ condition: "greaterThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 550 },
	// 			],
	// 		},
	// 	],
	// 	builder: [
	// 		{
	// 			operator: "and",
	// 			conditions: [
	// 				{ condition: "greaterThan", valueType: "controllerLevel", value: 1 },
	// 				{ condition: "greaterThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 550 },
	// 				{ condition: "greaterThanOrEqualTo", valueType: "structureType", structureType: "storage", value: 1 },
	// 			],
	// 		},
	// 	],
	// 	repairer: [
	// 		{
	// 			operator: "and",
	// 			conditions: [
	// 				{ condition: "greaterThan", valueType: "controllerLevel", value: 4 },
	// 				{ condition: "greaterThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 550 },
	// 				{ condition: "greaterThanOrEqualTo", valueType: "structureType", structureType: "storage", value: 1 },
	// 			],
	// 		},
	// 	],
	// 	hauler: [
	// 		{
	// 			operator: "and",
	// 			conditions: [
	// 				{ condition: "greaterThan", valueType: "controllerLevel", value: 4 },
	// 				{ condition: "greaterThanOrEqualTo", valueType: "structureType", structureType: "storage", value: 1 },
	// 				{ condition: "greaterThan", valueType: "creepRole", creepRole: "miner", value: 1 },
	// 			],
	// 		},
	// 	],
	// },

	// ROOM_CREEP_NUMBER_CONDITIONS: {
	// 	harvester: { condition: "equals", valueType: "sourceAccess" },
	// 	miner: { condition: "equals", valueType: "sourceWithContainer" },
	// 	hauler: { condition: "equals", valueType: "energyTransportRequiredToCarryCapacity" },
	// 	builder: { condition: "equals", valueType: "constructionSite" },
	// },
});
