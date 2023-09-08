const chai = require("chai");
const expect = chai.expect;
require("../../constants/screepsConstants");
const runSourceOperation = require("../../../src/operation/source/runSourceOperation");
const initialiseSourceOperation = require("../../../src/operation/source/initialiseSourceOperation");
const RoomPosition = require("../../testScreepsObjects/RoomPosition");
const Room = require("../../testScreepsObjects/Room");
const RoomTerrain = require("../../testScreepsObjects/roomTerrain");

describe("runSourceOperation tests", () => {
	describe("runSourceOperation with a room which doesn't meet mining requirements", () => {
		const roomName = "room1";
		const sourceId = "room1_source1";
		let mockGame = require("../../mocks/game/basicGame");

		let mockRoom = new Room(roomName);
		mockRoom.terrain = new RoomTerrain({
			0: {
				0: 0,
				1: 0,
			},
		});

		mockGame.rooms[mockRoom.name] = mockRoom;

		const mockSource = {
			id: sourceId,
			room: mockRoom,
			pos: new RoomPosition(0, 0, mockRoom.name),
		};

		mockRoom.sources[mockSource.id] = mockSource;

		mockGame.registerObject(mockSource);

		const operationId = "operation1";

		let sourceOperation = initialiseSourceOperation(sourceId);
		sourceOperation.id = operationId;

		let mockMemory = {
			app: {
				operations: {
					operation1: sourceOperation,
				},
				objectMemory: {
					room1_source1: {
						operationId: operationId,
					},
				},
				jobs: {},
			},
		};

		global.Memory = mockMemory;
		global.Game = mockGame;

		runSourceOperation(sourceOperation);
		// console.log("sourceOperation");
		// console.log(JSON.stringify(sourceOperation));

		const sourceMemory = mockMemory.app.objectMemory[mockSource.id];
		// console.log("sourceMemory");
		// console.log(JSON.stringify(sourceMemory));

		const jobMemory = mockMemory.app.job;
		// console.log("jobMemory");
		// console.log(JSON.stringify(jobMemory));

		it("should update open spaces in source memory", () => {
			expect(sourceMemory).to.have.property("openSpaces").that.is.an("array").and.not.null.and.not.undefined;
			expect(sourceMemory.openSpaces.length).to.equal(1);
		});

		it("should update source operation with harvest jobs", () => {
			expect(sourceOperation).to.have.property("harvestJobIds").that.is.an("array").and.not.null.and.not.undefined;
			expect(sourceOperation.harvestJobIds.length).to.equal(1);
		});

		it("should create harvest jobs in memory", () => {
			expect(jobMemory).to.have.property(sourceOperation.harvestJobIds[0]).that.is.an("object").and.not.null.and.not.undefined;
		});
	});

	describe("runSourceOperation with a container already assigned", () => {
		const roomName = "room1";
		const sourceId = "room1_source1";
		let mockGame = require("../../mocks/game/basicGame");

		let mockRoom = new Room(roomName);
		mockRoom.terrain = new RoomTerrain({
			0: {
				0: 0,
				1: 0,
			},
		});
		mockRoom.energyCapacityAvailable = 550; // minimum energy to produce a miner

		mockGame.rooms[mockRoom.name] = mockRoom;

		const mockSource = {
			id: sourceId,
			room: mockRoom,
			pos: new RoomPosition(0, 0, mockRoom.name),
		};

		mockRoom.sources[mockSource.id] = mockSource;

		mockGame.registerObject(mockSource);

		const operationId = "operation1";

		let sourceOperation = initialiseSourceOperation(sourceId);
		sourceOperation.id = operationId;

		let mockMemory = {
			app: {
				operations: {
					operation1: sourceOperation,
				},
				objectMemory: {
					room1_source1: {
						operationId: operationId,
					},
				},
				jobs: {},
			},
		};

		global.Memory = mockMemory;
		global.Game = mockGame;

		runSourceOperation(sourceOperation);
		console.log("sourceOperation");
		console.log(JSON.stringify(sourceOperation));

		const sourceMemory = mockMemory.app.objectMemory[mockSource.id];
		console.log("sourceMemory");
		console.log(JSON.stringify(sourceMemory));

		const jobMemory = mockMemory.app.job;
		console.log("jobMemory");
		console.log(JSON.stringify(jobMemory));

		it("should update open spaces in source memory", () => {
			expect(sourceMemory).to.have.property("openSpaces").that.is.an("array").and.not.null.and.not.undefined;
			expect(sourceMemory.openSpaces.length).to.equal(1);
		});

		it("should update source operation with harvest jobs", () => {
			expect(sourceOperation).to.have.property("harvestJobIds").that.is.an("array").and.not.null.and.not.undefined;
			expect(sourceOperation.harvestJobIds.length).to.equal(1);
		});

		it("should create harvest jobs in memory", () => {
			expect(jobMemory).to.have.property(sourceOperation.harvestJobIds[0]).that.is.an("object").and.not.null.and.not.undefined;
		});
	});

	// describe("runSourceOperation with a conatainer build job already assigned", () => {
	// 	//
	// });

	// describe("runSourceOperation with a container nearby", () => {
	// 	//
	// });

	// describe("runSourceOperation without any container nearby", () => {
	// 	//
	// });

	// describe("runSourceOperation with minerJobId but no miner assigned", () => {
	// 	//
	// });

	// describe("runSourceOperation with minerJobId with miner assigned", () => {
	// 	//
	// });

	// describe("runSourceOperation with haulerJobId without hauler assigned", () => {
	// 	//
	// });

	// describe("runSourceOperation with haulerJobId with hauler assigned", () => {
	// 	//
	// });
});
