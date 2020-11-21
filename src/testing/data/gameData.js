module.exports = {
	creeps: {},
	powerCreeps: {},
	spawns: {
		Spawn1: {
			id: "15b10fba98dd5959f2d5742c",
			room: {
				name: "sim",
				energyAvailable: 300,
				energyCapacityAvailable: 300,
				survivalInfo: {
					mode: "survival",
					status: "active",
					user: "5a70fb40ed360452b03fd848",
					score: 0,
					timeToWave: 200,
					wave: 1,
					survivalEnabled: true,
					invaders: { bodies: [] }
				},
				visual: { roomName: "sim" }
			},
			pos: { x: 23, y: 25, roomName: "sim" },
			name: "Spawn1",
			energy: 300,
			energyCapacity: 300,
			spawning: null,
			store: { energy: 300 },
			owner: { username: "KJimbo" },
			my: true,
			hits: 5000,
			hitsMax: 5000,
			structureType: "spawn"
		}
	},
	structures: {
		"7eb586b4c81115b3acc37cb2": {
			id: "7eb586b4c81115b3acc37cb2",
			room: {
				name: "sim",
				energyAvailable: 300,
				energyCapacityAvailable: 300,
				survivalInfo: {
					mode: "survival",
					status: "active",
					user: "5a70fb40ed360452b03fd848",
					score: 0,
					timeToWave: 200,
					wave: 1,
					survivalEnabled: true,
					invaders: { bodies: [] }
				},
				visual: { roomName: "sim" }
			},
			pos: { x: 22, y: 15, roomName: "sim" },
			ticksToDowngrade: 20000,
			level: 1,
			progress: 0,
			progressTotal: 200,
			safeModeAvailable: 0,
			isPowerEnabled: false,
			owner: { username: "KJimbo" },
			my: true,
			structureType: "controller"
		},
		"15b10fba98dd5959f2d5742c": {
			id: "15b10fba98dd5959f2d5742c",
			room: {
				name: "sim",
				energyAvailable: 300,
				energyCapacityAvailable: 300,
				survivalInfo: {
					mode: "survival",
					status: "active",
					user: "5a70fb40ed360452b03fd848",
					score: 0,
					timeToWave: 200,
					wave: 1,
					survivalEnabled: true,
					invaders: { bodies: [] }
				},
				visual: { roomName: "sim" }
			},
			pos: { x: 23, y: 25, roomName: "sim" },
			name: "Spawn1",
			energy: 300,
			energyCapacity: 300,
			spawning: null,
			store: { energy: 300 },
			owner: { username: "KJimbo" },
			my: true,
			hits: 5000,
			hitsMax: 5000,
			structureType: "spawn"
		}
	},
	flags: {},
	constructionSites: {},
	rooms: {
		sim: {
			name: "sim",
			energyAvailable: 300,
			energyCapacityAvailable: 300,
			survivalInfo: {
				mode: "survival",
				status: "active",
				user: "5a70fb40ed360452b03fd848",
				score: 0,
				timeToWave: 200,
				wave: 1,
				survivalEnabled: true,
				invaders: { bodies: [] }
			},
			visual: { roomName: "sim" }
		}
	},
	time: 1,
	cpuLimit: null,
	cpu: { tickLimit: null },
	map: { visual: {} },
	gcl: { level: 1, progress: 0, progressTotal: 1000000 },
	gpl: { level: 0, progress: 0, progressTotal: 1000 },
	market: { credits: 0, incomingTransactions: [], outgoingTransactions: [], orders: {} },
	resources: {},
	shard: {}
};
