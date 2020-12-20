/** constants.js **/

module.exports = {
	COORDINATES_MAX_SIZE: 49,
	MIN_CONTROLLER_TICKS_TO_DOWNGRADE: 500,
	HOSTILE_CREEP_PROXIMITY_DISTANCE: 6,
	CREEP_ROLES: {
		BUILDER: "builder",
		HARVESTER: "harvester",
		HAULER: "hauler",
		MINER: "miner",
		REPAIRER: "repairer",
		//SCOUT: "scout",
	},
	CREEP_TYPES: {
		UTILITY: "utility",
		MINER: "miner",
		HAULER: "hauler",
		CLAIMER: "claimer",
		MELEE: "melee",
		RANGED: "ranged",
		TANK: "tank",
		HEALER: "healer",
	},
	CREEP_ROLES_TYPES: {
		builder: "utility",
		harvester: "utility",
		hauler: "hauler",
		miner: "miner",
		repairer: "repairer",
		//SCOUT: "scout",
	},
	CREEP_BODIES: {
		utility: {
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
			MOVE: 0.1,
			WORK: { value: 0.9, max: 5 },
			CARRY: 0,
			ATTACK: 0,
			RANGED_ATTACK: 0,
			TOUGH: 0,
			HEAL: 0,
			CLAIM: 0,
		},
		hauler: {
			MOVE: 0.5,
			WORK: 0,
			CARRY: 0.5,
			ATTACK: 0,
			RANGED_ATTACK: 0,
			TOUGH: 0,
			HEAL: 0,
			CLAIM: 0,
		},
		claimer: {
			MOVE: 0.5,
			WORK: 0,
			CARRY: 0,
			ATTACK: 0,
			RANGED_ATTACK: 0,
			TOUGH: 0,
			HEAL: 0,
			CLAIM: 0.5,
		},
		melee: {
			MOVE: 0.5,
			WORK: 0,
			CARRY: 0,
			ATTACK: 0.5,
			RANGED_ATTACK: 0,
			TOUGH: 0,
			HEAL: 0,
			CLAIM: 0,
		},
		ranged: {
			MOVE: 0.5,
			WORK: 0,
			CARRY: 0,
			ATTACK: 0,
			RANGED_ATTACK: 0.5,
			TOUGH: 0,
			HEAL: 0,
			CLAIM: 0,
		},
		tank: {
			MOVE: 0.5,
			WORK: 0,
			CARRY: 0,
			ATTACK: 0.25,
			RANGED_ATTACK: 0,
			TOUGH: 0.25,
			HEAL: 0,
			CLAIM: 0,
		},
		healer: {
			MOVE: 0.5,
			WORK: 0,
			CARRY: 0,
			ATTACK: 0,
			RANGED_ATTACK: 0,
			TOUGH: 0,
			HEAL: 0.5,
			CLAIM: 0,
		},
	},
	RESOURCE_ORDER_STRUCTURE_PRIORITY: [
		"spawn",
		"storage",
		"terminal",
		"powerSpawn",
		"factory",
		"nuker",
		"lab",
		"extension",
		"tower",
		"road",
		//STRUCTURE_ROAD,
		//STRUCTURE_WALL,
		//STRUCTURE_RAMPART,

		//STRUCTURE_CONTAINER,
		//STRUCTURE_KEEPER_LAIR: "keeperLair",
		//STRUCTURE_PORTAL,
		//STRUCTURE_CONTROLLER,
		//STRUCTURE_LINK,

		//STRUCTURE_OBSERVER,
		//STRUCTURE_POWER_BANK: "powerBank",

		//STRUCTURE_EXTRACTOR: "extractor",

		//STRUCTURE_INVADER_CORE: "invaderCore",
	],

	STRUCTURE_PRIORITY: ["spawn", "storage", "terminal", "powerSpawn", "factory", "nuker", "lab", "extension", "tower", "road"],

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
		SPAWN_QUEUE_ITEM: "spawnQueueItem",
		SOURCE: "source",
	},
	CREEP_ACTIONS: {
		GO_TO_SOURCE: "goToSource",
		GO_TO_DESTINATION: "goToDestination",
		HARVEST: "harvest",
		FULLFILL_ENERGY_ORDER: "fullEnergyFillOrder",
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
		SOURCE_ACCESS: "sourceAccess",
		STRUCTURE_TYPE: "structureType",
	},

	ROOM_CREEP_ROLE_SPAWN_CONDITIONS: {
		harvester: [
			{
				operator: "and",
				conditions: [
					{ condition: "lessThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 300 },
					{ condition: "lessThan", valueType: "creepRole", creepRole: "miner", value: 1 },
					{ condition: "lessThan", valueType: "creepRole", creepRole: "hauler", value: 1 },
				],
			},
		],
		miner: [
			{
				operator: "and",
				conditions: [
					{ condition: "greaterThan", valueType: "controllerLevel", value: 1 },
					{ condition: "greaterThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 550 },
				],
			},
		],
		builder: [
			{
				operator: "and",
				conditions: [
					{ condition: "greaterThan", valueType: "controllerLevel", value: 1 },
					{ condition: "greaterThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 550 },
					{ condition: "greaterThanOrEqualTo", valueType: "structureType", structureType: "storage", value: 1 },
				],
			},
		],
		repairer: [
			{
				operator: "and",
				conditions: [
					{ condition: "greaterThan", valueType: "controllerLevel", value: 4 },
					{ condition: "greaterThanOrEqualTo", valueType: "roomTotalEnergyCapacity", value: 550 },
					{ condition: "greaterThanOrEqualTo", valueType: "structureType", structureType: "storage", value: 1 },
				],
			},
		],
		hauler: [
			{
				operator: "and",
				conditions: [
					{ condition: "greaterThan", valueType: "controllerLevel", value: 4 },
					{ condition: "greaterThanOrEqualTo", valueType: "structureType", structureType: "storage", value: 1 },
					{ condition: "greaterThan", valueType: "creepRole", creepRole: "miner", value: 1 },
				],
			},
		],
	},

	ROOM_CREEP_NUMBER_CONDITIONS: {
		harvester: { condition: "equals", valueType: "sourceAccess" },
		miner: { condition: "equals", valueType: "source" },
		hauler: { condition: "equals", valueType: "energyTransportRequiredToCarryCapacity" },
		builder: { condition: "equals", valueType: "constructionSite" },
	},
};
