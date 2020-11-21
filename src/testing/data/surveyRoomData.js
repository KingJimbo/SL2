module.exports = {
	room: "sim",
	progressPos: { x: 0, y: 0 },
	exitPathPosCounts: {},
	positionData: {
		"0-0": { canBuild: false, canTravel: false, x: 0, y: 0, terrain: "Wall" },
		"1-0": { canBuild: false, canTravel: false, x: 1, y: 0, terrain: "Wall" },
		"1-1": { canBuild: false, canTravel: false, x: 1, y: 1, terrain: "Wall" },
		"2-1": { canBuild: false, canTravel: false, x: 2, y: 1, terrain: "Wall" },
		"2-2": { canBuild: false, canTravel: false, x: 2, y: 2, terrain: "Wall" },
		"3-2": { canBuild: false, canTravel: false, x: 3, y: 2, terrain: "Wall" },
		"3-3": { canBuild: false, canTravel: false, x: 3, y: 3, terrain: "Wall" },
		"4-3": {
			canBuild: true,
			canTravel: true,
			x: 4,
			y: 3,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 40 },
					{ id: "32b7951ab0a11de0efb89413", cost: 62 },
					{ id: "6d882631d71f1e0020829829", cost: 40 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 42 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 27 },
				exits: []
			},
			totalDistance: 211,
			closestExit: 0
		},
		"4-4": {
			canBuild: true,
			canTravel: true,
			x: 4,
			y: 4,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 40 },
					{ id: "32b7951ab0a11de0efb89413", cost: 61 },
					{ id: "6d882631d71f1e0020829829", cost: 39 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 42 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 27 },
				exits: []
			},
			totalDistance: 209,
			closestExit: 0
		},
		"5-4": {
			canBuild: true,
			canTravel: true,
			x: 5,
			y: 4,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 39 },
					{ id: "32b7951ab0a11de0efb89413", cost: 61 },
					{ id: "6d882631d71f1e0020829829", cost: 39 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 41 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 26 },
				exits: []
			},
			totalDistance: 206,
			closestExit: 0
		},
		"5-5": {
			canBuild: true,
			canTravel: true,
			x: 5,
			y: 5,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 39 },
					{ id: "32b7951ab0a11de0efb89413", cost: 60 },
					{ id: "6d882631d71f1e0020829829", cost: 38 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 41 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 26 },
				exits: []
			},
			totalDistance: 204,
			closestExit: 0
		},
		"6-5": {
			canBuild: true,
			canTravel: true,
			x: 6,
			y: 5,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 38 },
					{ id: "32b7951ab0a11de0efb89413", cost: 60 },
					{ id: "6d882631d71f1e0020829829", cost: 38 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 40 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 25 },
				exits: []
			},
			totalDistance: 201,
			closestExit: 0
		},
		"6-6": {
			canBuild: true,
			canTravel: true,
			x: 6,
			y: 6,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 38 },
					{ id: "32b7951ab0a11de0efb89413", cost: 59 },
					{ id: "6d882631d71f1e0020829829", cost: 37 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 40 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 25 },
				exits: []
			},
			totalDistance: 199,
			closestExit: 0
		},
		"7-6": {
			canBuild: true,
			canTravel: true,
			x: 7,
			y: 6,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 37 },
					{ id: "32b7951ab0a11de0efb89413", cost: 59 },
					{ id: "6d882631d71f1e0020829829", cost: 37 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 39 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 24 },
				exits: []
			},
			totalDistance: 196,
			closestExit: 0
		},
		"7-7": {
			canBuild: true,
			canTravel: true,
			x: 7,
			y: 7,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 37 },
					{ id: "32b7951ab0a11de0efb89413", cost: 58 },
					{ id: "6d882631d71f1e0020829829", cost: 36 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 39 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 24 },
				exits: []
			},
			totalDistance: 194,
			closestExit: 0
		},
		"8-7": {
			canBuild: true,
			canTravel: true,
			x: 8,
			y: 7,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 36 },
					{ id: "32b7951ab0a11de0efb89413", cost: 58 },
					{ id: "6d882631d71f1e0020829829", cost: 36 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 38 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 23 },
				exits: []
			},
			totalDistance: 191,
			closestExit: 0
		},
		"8-8": {
			canBuild: true,
			canTravel: true,
			x: 8,
			y: 8,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 36 },
					{ id: "32b7951ab0a11de0efb89413", cost: 57 },
					{ id: "6d882631d71f1e0020829829", cost: 35 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 38 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 23 },
				exits: []
			},
			totalDistance: 189,
			closestExit: 0
		},
		"9-8": {
			canBuild: true,
			canTravel: true,
			x: 9,
			y: 8,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 35 },
					{ id: "32b7951ab0a11de0efb89413", cost: 57 },
					{ id: "6d882631d71f1e0020829829", cost: 35 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 37 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 22 },
				exits: []
			},
			totalDistance: 186,
			closestExit: 0
		},
		"9-9": {
			canBuild: true,
			canTravel: true,
			x: 9,
			y: 9,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 35 },
					{ id: "32b7951ab0a11de0efb89413", cost: 56 },
					{ id: "6d882631d71f1e0020829829", cost: 34 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 37 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 22 },
				exits: []
			},
			totalDistance: 184,
			closestExit: 0
		},
		"10-9": { canBuild: false, canTravel: false, x: 10, y: 9, terrain: "Wall" },
		"10-10": { canBuild: false, canTravel: false, x: 10, y: 10, terrain: "Wall" },
		"11-10": { canBuild: false, canTravel: false, x: 11, y: 10, terrain: "Wall" },
		"11-11": { canBuild: false, canTravel: false, x: 11, y: 11, terrain: "Wall" },
		"12-11": { canBuild: false, canTravel: false, x: 12, y: 11, terrain: "Wall" },
		"12-12": { canBuild: true, canTravel: false, x: 12, y: 12, terrain: "Swamp" },
		"13-12": { canBuild: true, canTravel: false, x: 13, y: 12, terrain: "Swamp" },
		"13-13": { canBuild: true, canTravel: false, x: 13, y: 13, terrain: "Swamp" },
		"14-13": {
			canBuild: true,
			canTravel: true,
			x: 14,
			y: 13,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 20 },
					{ id: "32b7951ab0a11de0efb89413", cost: 38 },
					{ id: "6d882631d71f1e0020829829", cost: 30 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 22 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 7 },
				exits: []
			},
			totalDistance: 117,
			closestExit: 0
		},
		"14-14": {
			canBuild: true,
			canTravel: true,
			x: 14,
			y: 14,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 20 },
					{ id: "32b7951ab0a11de0efb89413", cost: 38 },
					{ id: "6d882631d71f1e0020829829", cost: 29 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 22 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 7 },
				exits: []
			},
			totalDistance: 116,
			closestExit: 0
		},
		"15-14": {
			canBuild: true,
			canTravel: true,
			x: 15,
			y: 14,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 19 },
					{ id: "32b7951ab0a11de0efb89413", cost: 37 },
					{ id: "6d882631d71f1e0020829829", cost: 29 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 21 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 6 },
				exits: []
			},
			totalDistance: 112,
			closestExit: 0
		},
		"15-15": {
			canBuild: true,
			canTravel: true,
			x: 15,
			y: 15,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 19 },
					{ id: "32b7951ab0a11de0efb89413", cost: 37 },
					{ id: "6d882631d71f1e0020829829", cost: 28 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 21 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 6 },
				exits: []
			},
			totalDistance: 111,
			closestExit: 0
		},
		"16-15": {
			canBuild: true,
			canTravel: true,
			x: 16,
			y: 15,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 18 },
					{ id: "32b7951ab0a11de0efb89413", cost: 36 },
					{ id: "6d882631d71f1e0020829829", cost: 28 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 20 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 5 },
				exits: []
			},
			totalDistance: 107,
			closestExit: 0
		},
		"16-16": {
			canBuild: true,
			canTravel: true,
			x: 16,
			y: 16,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 18 },
					{ id: "32b7951ab0a11de0efb89413", cost: 36 },
					{ id: "6d882631d71f1e0020829829", cost: 27 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 20 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 5 },
				exits: []
			},
			totalDistance: 106,
			closestExit: 0
		},
		"17-16": {
			canBuild: true,
			canTravel: true,
			x: 17,
			y: 16,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 17 },
					{ id: "32b7951ab0a11de0efb89413", cost: 35 },
					{ id: "6d882631d71f1e0020829829", cost: 27 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 19 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 4 },
				exits: []
			},
			totalDistance: 102,
			closestExit: 0
		},
		"17-17": {
			canBuild: true,
			canTravel: true,
			x: 17,
			y: 17,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 17 },
					{ id: "32b7951ab0a11de0efb89413", cost: 35 },
					{ id: "6d882631d71f1e0020829829", cost: 26 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 19 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 4 },
				exits: []
			},
			totalDistance: 101,
			closestExit: 0
		},
		"18-17": {
			canBuild: true,
			canTravel: true,
			x: 18,
			y: 17,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 16 },
					{ id: "32b7951ab0a11de0efb89413", cost: 34 },
					{ id: "6d882631d71f1e0020829829", cost: 26 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 18 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 3 },
				exits: []
			},
			totalDistance: 97,
			closestExit: 0
		},
		"18-18": {
			canBuild: true,
			canTravel: true,
			x: 18,
			y: 18,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 16 },
					{ id: "32b7951ab0a11de0efb89413", cost: 34 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 18 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 3 },
				exits: []
			},
			totalDistance: 96,
			closestExit: 0
		},
		"19-18": {
			canBuild: true,
			canTravel: true,
			x: 19,
			y: 18,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 15 },
					{ id: "32b7951ab0a11de0efb89413", cost: 33 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 17 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 2 },
				exits: []
			},
			totalDistance: 92,
			closestExit: 0
		},
		"19-19": {
			canBuild: true,
			canTravel: true,
			x: 19,
			y: 19,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 15 },
					{ id: "32b7951ab0a11de0efb89413", cost: 33 },
					{ id: "6d882631d71f1e0020829829", cost: 24 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 17 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 3 },
				exits: []
			},
			totalDistance: 92,
			closestExit: 0
		},
		"20-19": {
			canBuild: true,
			canTravel: true,
			x: 20,
			y: 19,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 14 },
					{ id: "32b7951ab0a11de0efb89413", cost: 32 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 17 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 3 },
				exits: []
			},
			totalDistance: 91,
			closestExit: 0
		},
		"20-20": {
			canBuild: true,
			canTravel: true,
			x: 20,
			y: 20,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 14 },
					{ id: "32b7951ab0a11de0efb89413", cost: 32 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 18 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 4 },
				exits: []
			},
			totalDistance: 93,
			closestExit: 0
		},
		"21-20": {
			canBuild: true,
			canTravel: true,
			x: 21,
			y: 20,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 13 },
					{ id: "32b7951ab0a11de0efb89413", cost: 31 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 18 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 4 },
				exits: []
			},
			totalDistance: 91,
			closestExit: 0
		},
		"21-21": {
			canBuild: true,
			canTravel: true,
			x: 21,
			y: 21,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 13 },
					{ id: "32b7951ab0a11de0efb89413", cost: 31 },
					{ id: "6d882631d71f1e0020829829", cost: 24 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 19 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 5 },
				exits: []
			},
			totalDistance: 92,
			closestExit: 0
		},
		"22-21": {
			canBuild: true,
			canTravel: true,
			x: 22,
			y: 21,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 12 },
					{ id: "32b7951ab0a11de0efb89413", cost: 30 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 19 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 5 },
				exits: []
			},
			totalDistance: 91,
			closestExit: 0
		},
		"22-22": {
			canBuild: true,
			canTravel: true,
			x: 22,
			y: 22,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 12 },
					{ id: "32b7951ab0a11de0efb89413", cost: 30 },
					{ id: "6d882631d71f1e0020829829", cost: 25 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 20 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 6 },
				exits: []
			},
			totalDistance: 93,
			closestExit: 0
		},
		"23-22": {
			canBuild: true,
			canTravel: true,
			x: 23,
			y: 22,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 11 },
					{ id: "32b7951ab0a11de0efb89413", cost: 29 },
					{ id: "6d882631d71f1e0020829829", cost: 26 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 20 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 6 },
				exits: []
			},
			totalDistance: 92,
			closestExit: 0
		},
		"23-23": {
			canBuild: true,
			canTravel: true,
			x: 23,
			y: 23,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 11 },
					{ id: "32b7951ab0a11de0efb89413", cost: 29 },
					{ id: "6d882631d71f1e0020829829", cost: 26 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 21 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 7 },
				exits: []
			},
			totalDistance: 94,
			closestExit: 0
		},
		"24-23": {
			canBuild: true,
			canTravel: true,
			x: 24,
			y: 23,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 10 },
					{ id: "32b7951ab0a11de0efb89413", cost: 28 },
					{ id: "6d882631d71f1e0020829829", cost: 27 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 21 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 7 },
				exits: []
			},
			totalDistance: 93,
			closestExit: 0
		},
		"24-24": {
			canBuild: true,
			canTravel: true,
			x: 24,
			y: 24,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 10 },
					{ id: "32b7951ab0a11de0efb89413", cost: 28 },
					{ id: "6d882631d71f1e0020829829", cost: 27 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 22 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 8 },
				exits: []
			},
			totalDistance: 95,
			closestExit: 0
		},
		"25-24": {
			canBuild: true,
			canTravel: true,
			x: 25,
			y: 24,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 9 },
					{ id: "32b7951ab0a11de0efb89413", cost: 27 },
					{ id: "6d882631d71f1e0020829829", cost: 28 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 22 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 8 },
				exits: []
			},
			totalDistance: 94,
			closestExit: 0
		},
		"25-25": {
			canBuild: true,
			canTravel: true,
			x: 25,
			y: 25,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 9 },
					{ id: "32b7951ab0a11de0efb89413", cost: 27 },
					{ id: "6d882631d71f1e0020829829", cost: 28 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 23 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 9 },
				exits: []
			},
			totalDistance: 96,
			closestExit: 0
		},
		"26-25": {
			canBuild: true,
			canTravel: true,
			x: 26,
			y: 25,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 8 },
					{ id: "32b7951ab0a11de0efb89413", cost: 26 },
					{ id: "6d882631d71f1e0020829829", cost: 29 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 23 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 9 },
				exits: []
			},
			totalDistance: 95,
			closestExit: 0
		},
		"26-26": {
			canBuild: true,
			canTravel: true,
			x: 26,
			y: 26,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 8 },
					{ id: "32b7951ab0a11de0efb89413", cost: 26 },
					{ id: "6d882631d71f1e0020829829", cost: 29 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 24 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 10 },
				exits: []
			},
			totalDistance: 97,
			closestExit: 0
		},
		"27-26": {
			canBuild: true,
			canTravel: true,
			x: 27,
			y: 26,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 7 },
					{ id: "32b7951ab0a11de0efb89413", cost: 25 },
					{ id: "6d882631d71f1e0020829829", cost: 30 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 24 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 10 },
				exits: []
			},
			totalDistance: 96,
			closestExit: 0
		},
		"27-27": {
			canBuild: true,
			canTravel: true,
			x: 27,
			y: 27,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 7 },
					{ id: "32b7951ab0a11de0efb89413", cost: 25 },
					{ id: "6d882631d71f1e0020829829", cost: 30 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 25 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 11 },
				exits: []
			},
			totalDistance: 98,
			closestExit: 0
		},
		"28-27": {
			canBuild: true,
			canTravel: true,
			x: 28,
			y: 27,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 6 },
					{ id: "32b7951ab0a11de0efb89413", cost: 24 },
					{ id: "6d882631d71f1e0020829829", cost: 31 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 25 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 11 },
				exits: []
			},
			totalDistance: 97,
			closestExit: 0
		},
		"28-28": {
			canBuild: true,
			canTravel: true,
			x: 28,
			y: 28,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 7 },
					{ id: "32b7951ab0a11de0efb89413", cost: 24 },
					{ id: "6d882631d71f1e0020829829", cost: 31 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 26 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 12 },
				exits: []
			},
			totalDistance: 100,
			closestExit: 0
		},
		"29-28": {
			canBuild: true,
			canTravel: true,
			x: 29,
			y: 28,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 7 },
					{ id: "32b7951ab0a11de0efb89413", cost: 23 },
					{ id: "6d882631d71f1e0020829829", cost: 32 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 26 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 12 },
				exits: []
			},
			totalDistance: 100,
			closestExit: 0
		},
		"29-29": {
			canBuild: true,
			canTravel: true,
			x: 29,
			y: 29,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 8 },
					{ id: "32b7951ab0a11de0efb89413", cost: 23 },
					{ id: "6d882631d71f1e0020829829", cost: 32 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 27 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 13 },
				exits: []
			},
			totalDistance: 103,
			closestExit: 0
		},
		"30-29": {
			canBuild: true,
			canTravel: true,
			x: 30,
			y: 29,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 8 },
					{ id: "32b7951ab0a11de0efb89413", cost: 22 },
					{ id: "6d882631d71f1e0020829829", cost: 33 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 27 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 13 },
				exits: []
			},
			totalDistance: 103,
			closestExit: 0
		},
		"30-30": {
			canBuild: true,
			canTravel: true,
			x: 30,
			y: 30,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 9 },
					{ id: "32b7951ab0a11de0efb89413", cost: 22 },
					{ id: "6d882631d71f1e0020829829", cost: 33 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 28 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 14 },
				exits: []
			},
			totalDistance: 106,
			closestExit: 0
		},
		"31-30": {
			canBuild: true,
			canTravel: true,
			x: 31,
			y: 30,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 9 },
					{ id: "32b7951ab0a11de0efb89413", cost: 21 },
					{ id: "6d882631d71f1e0020829829", cost: 34 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 28 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 14 },
				exits: []
			},
			totalDistance: 106,
			closestExit: 0
		},
		"31-31": {
			canBuild: true,
			canTravel: true,
			x: 31,
			y: 31,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 10 },
					{ id: "32b7951ab0a11de0efb89413", cost: 21 },
					{ id: "6d882631d71f1e0020829829", cost: 34 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 29 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 15 },
				exits: []
			},
			totalDistance: 109,
			closestExit: 0
		},
		"32-31": {
			canBuild: true,
			canTravel: true,
			x: 32,
			y: 31,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 10 },
					{ id: "32b7951ab0a11de0efb89413", cost: 20 },
					{ id: "6d882631d71f1e0020829829", cost: 35 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 29 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 15 },
				exits: []
			},
			totalDistance: 109,
			closestExit: 0
		},
		"32-32": {
			canBuild: true,
			canTravel: true,
			x: 32,
			y: 32,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 11 },
					{ id: "32b7951ab0a11de0efb89413", cost: 20 },
					{ id: "6d882631d71f1e0020829829", cost: 35 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 30 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 16 },
				exits: []
			},
			totalDistance: 112,
			closestExit: 0
		},
		"33-32": {
			canBuild: true,
			canTravel: true,
			x: 33,
			y: 32,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 11 },
					{ id: "32b7951ab0a11de0efb89413", cost: 19 },
					{ id: "6d882631d71f1e0020829829", cost: 36 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 30 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 16 },
				exits: []
			},
			totalDistance: 112,
			closestExit: 0
		},
		"33-33": {
			canBuild: true,
			canTravel: true,
			x: 33,
			y: 33,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 12 },
					{ id: "32b7951ab0a11de0efb89413", cost: 19 },
					{ id: "6d882631d71f1e0020829829", cost: 36 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 31 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 17 },
				exits: []
			},
			totalDistance: 115,
			closestExit: 0
		},
		"34-33": {
			canBuild: true,
			canTravel: true,
			x: 34,
			y: 33,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 12 },
					{ id: "32b7951ab0a11de0efb89413", cost: 18 },
					{ id: "6d882631d71f1e0020829829", cost: 37 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 31 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 17 },
				exits: []
			},
			totalDistance: 115,
			closestExit: 0
		},
		"34-34": {
			canBuild: true,
			canTravel: true,
			x: 34,
			y: 34,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 13 },
					{ id: "32b7951ab0a11de0efb89413", cost: 18 },
					{ id: "6d882631d71f1e0020829829", cost: 37 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 32 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 18 },
				exits: []
			},
			totalDistance: 118,
			closestExit: 0
		},
		"35-34": {
			canBuild: true,
			canTravel: true,
			x: 35,
			y: 34,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 13 },
					{ id: "32b7951ab0a11de0efb89413", cost: 17 },
					{ id: "6d882631d71f1e0020829829", cost: 38 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 32 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 18 },
				exits: []
			},
			totalDistance: 118,
			closestExit: 0
		},
		"35-35": { canBuild: true, canTravel: false, x: 35, y: 35, terrain: "Swamp" },
		"36-35": {
			canBuild: true,
			canTravel: true,
			x: 36,
			y: 35,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 14 },
					{ id: "32b7951ab0a11de0efb89413", cost: 16 },
					{ id: "6d882631d71f1e0020829829", cost: 39 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 33 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 19 },
				exits: []
			},
			totalDistance: 121,
			closestExit: 0
		},
		"36-36": {
			canBuild: true,
			canTravel: true,
			x: 36,
			y: 36,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 15 },
					{ id: "32b7951ab0a11de0efb89413", cost: 16 },
					{ id: "6d882631d71f1e0020829829", cost: 39 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 34 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 20 },
				exits: []
			},
			totalDistance: 124,
			closestExit: 0
		},
		"37-36": {
			canBuild: true,
			canTravel: true,
			x: 37,
			y: 36,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 15 },
					{ id: "32b7951ab0a11de0efb89413", cost: 15 },
					{ id: "6d882631d71f1e0020829829", cost: 40 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 34 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 20 },
				exits: []
			},
			totalDistance: 124,
			closestExit: 0
		},
		"37-37": {
			canBuild: true,
			canTravel: true,
			x: 37,
			y: 37,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 16 },
					{ id: "32b7951ab0a11de0efb89413", cost: 15 },
					{ id: "6d882631d71f1e0020829829", cost: 40 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 35 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 21 },
				exits: []
			},
			totalDistance: 127,
			closestExit: 0
		},
		"38-37": {
			canBuild: true,
			canTravel: true,
			x: 38,
			y: 37,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 16 },
					{ id: "32b7951ab0a11de0efb89413", cost: 14 },
					{ id: "6d882631d71f1e0020829829", cost: 41 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 35 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 21 },
				exits: []
			},
			totalDistance: 127,
			closestExit: 0
		},
		"38-38": { canBuild: true, canTravel: false, x: 38, y: 38, terrain: "Swamp" },
		"39-38": {
			canBuild: true,
			canTravel: true,
			x: 39,
			y: 38,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 17 },
					{ id: "32b7951ab0a11de0efb89413", cost: 13 },
					{ id: "6d882631d71f1e0020829829", cost: 42 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 36 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 22 },
				exits: []
			},
			totalDistance: 130,
			closestExit: 0
		},
		"39-39": {
			canBuild: true,
			canTravel: true,
			x: 39,
			y: 39,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 18 },
					{ id: "32b7951ab0a11de0efb89413", cost: 12 },
					{ id: "6d882631d71f1e0020829829", cost: 42 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 37 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 23 },
				exits: []
			},
			totalDistance: 132,
			closestExit: 0
		},
		"40-39": {
			canBuild: true,
			canTravel: true,
			x: 40,
			y: 39,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 18 },
					{ id: "32b7951ab0a11de0efb89413", cost: 12 },
					{ id: "6d882631d71f1e0020829829", cost: 43 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 37 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 23 },
				exits: []
			},
			totalDistance: 133,
			closestExit: 0
		},
		"40-40": { canBuild: true, canTravel: false, x: 40, y: 40, terrain: "Swamp" },
		"41-40": { canBuild: true, canTravel: false, x: 41, y: 40, terrain: "Swamp" },
		"41-41": { canBuild: true, canTravel: false, x: 41, y: 41, terrain: "Swamp" },
		"42-41": { canBuild: true, canTravel: false, x: 42, y: 41, terrain: "Swamp" },
		"42-42": { canBuild: true, canTravel: false, x: 42, y: 42, terrain: "Swamp" },
		"43-42": {
			canBuild: true,
			canTravel: true,
			x: 43,
			y: 42,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 29 },
					{ id: "32b7951ab0a11de0efb89413", cost: 1 },
					{ id: "6d882631d71f1e0020829829", cost: 54 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 48 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 34 },
				exits: []
			},
			totalDistance: 166,
			closestExit: 0
		},
		"43-43": { canBuild: false, canTravel: false, x: 43, y: 43, terrain: "Wall" },
		"44-43": {
			canBuild: true,
			canTravel: true,
			x: 44,
			y: 43,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 30 },
					{ id: "32b7951ab0a11de0efb89413", cost: 0 },
					{ id: "6d882631d71f1e0020829829", cost: 55 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 49 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 35 },
				exits: []
			},
			totalDistance: 169,
			closestExit: 0
		},
		"44-44": { canBuild: false, canTravel: false, x: 44, y: 44, terrain: "Wall" },
		"45-44": {
			canBuild: true,
			canTravel: true,
			x: 45,
			y: 44,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 31 },
					{ id: "32b7951ab0a11de0efb89413", cost: 1 },
					{ id: "6d882631d71f1e0020829829", cost: 56 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 50 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 36 },
				exits: []
			},
			totalDistance: 174,
			closestExit: 0
		},
		"45-45": {
			canBuild: true,
			canTravel: true,
			x: 45,
			y: 45,
			terrain: "Plain",
			distances: {
				sources: [
					{ id: "ed4aa30105f02507bdb67a1a", cost: 32 },
					{ id: "32b7951ab0a11de0efb89413", cost: 2 },
					{ id: "6d882631d71f1e0020829829", cost: 57 },
					{ id: "470ee35b4f28cf96f3a55029", cost: 51 }
				],
				mineral: [],
				controller: { id: "14eae62207de03cf82c6ac38", cost: 37 },
				exits: []
			},
			totalDistance: 179,
			closestExit: 0
		},
		"46-45": { canBuild: true, canTravel: false, x: 46, y: 45, terrain: "Swamp" },
		"46-46": { canBuild: true, canTravel: false, x: 46, y: 46, terrain: "Swamp" },
		"47-46": { canBuild: true, canTravel: false, x: 47, y: 46, terrain: "Swamp" },
		"47-47": { canBuild: false, canTravel: false, x: 47, y: 47, terrain: "Wall" },
		"48-47": { canBuild: false, canTravel: false, x: 48, y: 47, terrain: "Wall" },
		"48-48": { canBuild: false, canTravel: false, x: 48, y: 48, terrain: "Wall" },
		"49-48": { canBuild: false, canTravel: false, x: 49, y: 48, terrain: "Wall" },
		"49-49": { canBuild: false, canTravel: false, x: 49, y: 49, terrain: "Wall" }
	},
	totalExits: 20
};
