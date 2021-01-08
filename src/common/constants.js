const constants = {
	COORDINATES_MAX_SIZE: 49,
	MIN_CONTROLLER_TICKS_TO_DOWNGRADE: 500,
	MIN_TOWER_ENERGY_CAPACITY: 200,
	HOSTILE_CREEP_PROXIMITY_DISTANCE: 6,
	ROOM_ROAD_POSITION_ADDED_TIME: 100,
	CREEP_WILL_DIE_SOON_TICK_VALUE: 50,

	CREEP_TYPES: {
		UTILITY: "utility",
		MINER: "miner",
		HAULER: "hauler",
		CLAIMER: "claimer",
		MELEE: "melee",
		RANGED: "ranged",
		TANK: "tank",
		HEALER: "healer",
		SCOUT: "scout",
	},

	RESOURCES: {
		RESOURCE_ENERGY,
		RESOURCE_POWER,

		RESOURCE_HYDROGEN,
		RESOURCE_OXYGEN,
		RESOURCE_UTRIUM,
		RESOURCE_LEMERGIUM,
		RESOURCE_KEANIUM,
		RESOURCE_ZYNTHIUM,
		RESOURCE_CATALYST,
		RESOURCE_GHODIUM,

		RESOURCE_SILICON,
		RESOURCE_METAL,
		RESOURCE_BIOMASS,
		RESOURCE_MIST,

		RESOURCE_HYDROXIDE,
		RESOURCE_ZYNTHIUM_KEANITE,
		RESOURCE_UTRIUM_LEMERGITE,

		RESOURCE_UTRIUM_HYDRIDE,
		RESOURCE_UTRIUM_OXIDE,
		RESOURCE_KEANIUM_HYDRIDE,
		RESOURCE_KEANIUM_OXIDE,
		RESOURCE_LEMERGIUM_HYDRIDE,
		RESOURCE_LEMERGIUM_OXIDE,
		RESOURCE_ZYNTHIUM_HYDRIDE,
		RESOURCE_ZYNTHIUM_OXIDE,
		RESOURCE_GHODIUM_HYDRIDE,
		RESOURCE_GHODIUM_OXIDE,

		RESOURCE_UTRIUM_ACID,
		RESOURCE_UTRIUM_ALKALIDE,
		RESOURCE_KEANIUM_ACID,
		RESOURCE_KEANIUM_ALKALIDE,
		RESOURCE_LEMERGIUM_ACID,
		RESOURCE_LEMERGIUM_ALKALIDE,
		RESOURCE_ZYNTHIUM_ACID,
		RESOURCE_ZYNTHIUM_ALKALIDE,
		RESOURCE_GHODIUM_ACID,
		RESOURCE_GHODIUM_ALKALIDE,

		RESOURCE_CATALYZED_UTRIUM_ACID,
		RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
		RESOURCE_CATALYZED_KEANIUM_ACID,
		RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
		RESOURCE_CATALYZED_LEMERGIUM_ACID,
		RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
		RESOURCE_CATALYZED_ZYNTHIUM_ACID,
		RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
		RESOURCE_CATALYZED_GHODIUM_ACID,
		RESOURCE_CATALYZED_GHODIUM_ALKALIDE,

		RESOURCE_OPS,

		RESOURCE_UTRIUM_BAR,
		RESOURCE_LEMERGIUM_BAR,
		RESOURCE_ZYNTHIUM_BAR,
		RESOURCE_KEANIUM_BAR,
		RESOURCE_GHODIUM_MELT,
		RESOURCE_OXIDANT,
		RESOURCE_REDUCTANT,
		RESOURCE_PURIFIER,
		RESOURCE_BATTERY,

		RESOURCE_COMPOSITE,
		RESOURCE_CRYSTAL,
		RESOURCE_LIQUID,

		RESOURCE_WIRE,
		RESOURCE_SWITCH,
		RESOURCE_TRANSISTOR,
		RESOURCE_MICROCHIP,
		RESOURCE_CIRCUIT,
		RESOURCE_DEVICE,

		RESOURCE_CELL,
		RESOURCE_PHLEGM,
		RESOURCE_TISSUE,
		RESOURCE_MUSCLE,
		RESOURCE_ORGANOID,
		RESOURCE_ORGANISM,

		RESOURCE_ALLOY,
		RESOURCE_TUBE,
		RESOURCE_FIXTURES,
		RESOURCE_FRAME,
		RESOURCE_HYDRAULICS,
		RESOURCE_MACHINE,

		RESOURCE_CONDENSATE,
		RESOURCE_CONCENTRATE,
		RESOURCE_EXTRACT,
		RESOURCE_SPIRIT,
		RESOURCE_EMANATION,
		RESOURCE_ESSENCE,
	},

	ESSENTIAL_HARVEST_TYPES: ["utility", "miner"],

	ESSENTIAL_MINER_TYPES: ["utility", "hauler"],

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
			move: { value: 1 },
			work: { value: 5 },
			carry: { value: 0 },
			attack: { value: 0 },
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 0 },
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
			ranged_attack: { value: 0 },
			tough: { value: 0 },
			heal: { value: 0 },
			claim: { value: 0 },
			maxRatio: 1,
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
		"container",
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

	STRUCTURE_PRIORITY: ["spawn", "storage", "terminal", "powerSpawn", "factory", "nuker", "lab", "extension", "tower", "container", "road"],

	WALKABLE_STRUCTURES: [STRUCTURE_CONTAINER, STRUCTURE_RAMPART, STRUCTURE_ROAD],

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
		SOURCE: "source",
		CREEP: "creep",
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

	ROOM_CREEP_ROLE_SPAWN_CONDITIONS: {
		harvester: [
			{
				operator: "or",
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
		miner: { condition: "equals", valueType: "sourceWithContainer" },
		hauler: { condition: "equals", valueType: "energyTransportRequiredToCarryCapacity" },
		builder: { condition: "equals", valueType: "constructionSite" },
	},
};

global = Object.assign(global, constants);

module.exports = constants;
