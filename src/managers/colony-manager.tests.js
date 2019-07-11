// /* COLONY MANAGER TESTS */
// var expect = require("chai").expect;
// var sinon = require("sinon");
// require("./common/constants");
// var ColonyManager = require("../src/managers/colony-manager.js");

// describe("Colony Manager Tests", function() {
// 	describe("Add Room to Colony", function() {
// 		describe("Add an unassigned room to Colony", function() {
// 			//game, resourceManager, memoryManager, operationManager, structureMapper, creepManager

// 			var gameMock = {};
// 			var resourceManagerMock = {};

// 			var memoryManagerMock = { save: function(colony) {} };
// 			sinon.spy(memoryManagerMock, "save");

// 			var operationManagerMock = {};
// 			var structureMapperMock = {};
// 			var creepManagerMock = {};

// 			var colonyManager = new ColonyManager(
// 				gameMock,
// 				resourceManagerMock,
// 				memoryManagerMock,
// 				operationManagerMock,
// 				structureMapperMock,
// 				creepManagerMock
// 			);
// 			var roomMock = { memory: { colonyId: 0 }, name: "testroom" };
// 			var colonyMock = { id: 1, rooms: [] };

// 			var result = colonyManager.addRoomToColony(colonyMock, roomMock);

// 			it("Updates room colony id", function() {
// 				expect(roomMock.memory.colonyId).to.equal(colonyMock.id);
// 			});

// 			it("Updates pushes room to colony.rooms", function() {
// 				expect(colonyMock.rooms.length).to.equal(1);
// 			});

// 			it("calls memoryManager.save()", function() {
// 				expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should return a result object", function() {
// 				expect(result).to.exist();
// 				expect(result.status).to.equal(RESULT_OK);
// 				expect(result.message).to.exist();
// 			});
// 		});

// 		describe("Add an already assigned Room to the same Colony", function() {
// 			var gameMock = {};
// 			var resourceManagerMock = {};

// 			var memoryManagerMock = { save: function(colony) {} };
// 			sinon.spy(memoryManagerMock, "save");

// 			var operationManagerMock = {};
// 			var structureMapperMock = {};
// 			var creepManagerMock = {};

// 			var colonyManager = new ColonyManager(
// 				gameMock,
// 				resourceManagerMock,
// 				memoryManagerMock,
// 				operationManagerMock,
// 				structureMapperMock,
// 				creepManagerMock
// 			);
// 			var roomMock = { memory: { colonyId: 2 }, name: "testroom" };
// 			var colonyMock = { id: 1, rooms: [] };

// 			colonyManager.addRoomToColony(colonyMock, roomMock);

// 			it("Should check if room colony is still existing", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should check if the colony has a reference to the room", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should assign the room to the new colony if not", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should assign the room to the new colony if not", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});
// 		});

// 		describe("Add an already assigned Room to a Colony without reference to it", function() {
// 			var gameMock = {};
// 			var resourceManagerMock = {};

// 			var memoryManagerMock = { save: function(colony) {} };
// 			sinon.spy(memoryManagerMock, "save");

// 			var operationManagerMock = {};
// 			var structureMapperMock = {};
// 			var creepManagerMock = {};

// 			var colonyManager = new ColonyManager(
// 				gameMock,
// 				resourceManagerMock,
// 				memoryManagerMock,
// 				operationManagerMock,
// 				structureMapperMock,
// 				creepManagerMock
// 			);
// 			var roomMock = { memory: { colonyId: 2 }, name: "testroom" };
// 			var colonyMock = { id: 1, rooms: [] };

// 			colonyManager.addRoomToColony(colonyMock, roomMock);

// 			it("Should check if room colony is still existing", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should check if the colony has a reference to the room", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should assign the room to the new colony if not", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should assign the room to the new colony if not", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});
// 		});

// 		describe("Add an already assigned Room to a Colony with reference to it", function() {
// 			var gameMock = {};
// 			var resourceManagerMock = {};

// 			var memoryManagerMock = { save: function(colony) {} };
// 			sinon.spy(memoryManagerMock, "save");

// 			var operationManagerMock = {};
// 			var structureMapperMock = {};
// 			var creepManagerMock = {};

// 			var colonyManager = new ColonyManager(
// 				gameMock,
// 				resourceManagerMock,
// 				memoryManagerMock,
// 				operationManagerMock,
// 				structureMapperMock,
// 				creepManagerMock
// 			);
// 			var roomMock = { memory: { colonyId: 2 }, name: "testroom" };
// 			var colonyMock = { id: 1, rooms: [] };

// 			colonyManager.addRoomToColony(colonyMock, roomMock);

// 			it("Should check if room colony is still existing", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should check if the colony has a reference to the room", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});

// 			it("Should return a const value to feedback the result", function() {
// 				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
// 			});
// 		});
// 	});
// });

// // this.addRoomToColony = function(colony, room) {
// // 	// add if it doesn't exist
// // 	if (!room.memory.colonyId) {
// // 		room.memory.colonyId = colony.id;
// // 		colony.rooms.push(room);
// // 		this.memoryManager.save(colony);
// //		return { result: RESULT_OK, message: "Room added to colony " + colony.id }
// // 	} 
// //	else if (room.memory.colonyId === colony.id) {
// //		return { result: RESULT_FAILED, message: "Room is already assigned to colony" + colony.id}
// //	}	
// //	else {
// // 		console.log("Warning: this room is already assigned to a colony " + room.memory.colonyId + " cannot assign to " + colony.id);
// // 		//TODO: Add logic to handle room transfer
// // 		// check colony still exists
// // 		// check if the room is actually part of the colony
// //		// if not assign to new colony
// // 		// if it is return const
// //		return { result: RESULT_FAILED, message: "Room couldn't be assigned to colony" + colony.id + " as it is already assigned to a colony " + room.memory.colonyId }
// // 	}
// // };