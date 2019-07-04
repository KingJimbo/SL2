/* COLONY MANAGER TESTS */
var expect = require("chai").expect;
var sinon = require("sinon");
var ColonyManager = require("../src/managers/colony/colony-manager.js");

describe("Colony Manager Tests", function() {
	describe("Add Room to Colony", function() {
		describe("Add an unassigned room to Colony", function() {
			//game, resourceManager, memoryManager, operationManager, structureMapper, creepManager

			var gameMock = {};
			var resourceManagerMock = {};

			var memoryManagerMock = { save: function(colony) {} };
			sinon.spy(memoryManagerMock, "save");

			var operationManagerMock = {};
			var structureMapperMock = {};
			var creepManagerMock = {};

			var colonyManager = new ColonyManager(
				gameMock,
				resourceManagerMock,
				memoryManagerMock,
				operationManagerMock,
				structureMapperMock,
				creepManagerMock
			);
			var roomMock = { memory: { colonyId: 0 }, name: "testroom" };
			var colonyMock = { id: 1, rooms: [] };

			colonyManager.addRoomToColony(colonyMock, roomMock);

			it("Updates room colony id", function() {
				expect(roomMock.memory.colonyId).to.equal(colonyMock.id);
			});

			it("Updates pushes room to colony.rooms", function() {
				expect(colonyMock.rooms.length).to.equal(1);
			});

			it("calls memoryManager.save()", function() {
				expect(memoryManagerMock.save.calledOnce).to.equal(true);
			});
		});

		describe("Add an already assigned Room to Colony", function() {
			var gameMock = {};
			var resourceManagerMock = {};

			var memoryManagerMock = { save: function(colony) {} };
			sinon.spy(memoryManagerMock, "save");

			var operationManagerMock = {};
			var structureMapperMock = {};
			var creepManagerMock = {};

			var colonyManager = new ColonyManager(
				gameMock,
				resourceManagerMock,
				memoryManagerMock,
				operationManagerMock,
				structureMapperMock,
				creepManagerMock
			);
			var roomMock = { memory: { colonyId: 2 }, name: "testroom" };
			var colonyMock = { id: 1, rooms: [] };

			colonyManager.addRoomToColony(colonyMock, roomMock);

			it("Should check if room colony is still existing", function() {
				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
			});

			it("If room colony doesn't exist assign new colony id", function() {
				//expect(memoryManagerMock.save.calledOnce).to.equal(true);
			});
		});
	});
});

// this.addRoomToColony = function(colony, room) {
// 	// add if it doesn't exist
// 	if (!room.memory.colonyId) {
// 		room.memory.colonyId = colony.id;
// 		colony.rooms.push(room);
// 		this.memoryManager.save(colony);
// 	} else {
// 		console.log("Warning: this room is already assigned to a colony " + room.memory.colonyId + " cannot assign to " + colony.id);
// 		//TODO: Add logic to handle room transfer
// 		// check colony still exists
// 		// check room is actually part of colony
// 	}
// };
