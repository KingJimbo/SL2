var expect = require("chai").expect;
var sinon = require("sinon");
require("../testing/constants");
require("../common/constants");
var RoomSurveyor = require("./roomSurveyor");

var obj = { rooms: {} };
describe("Room Surveyor Tests", function() {
	describe("surveyRoom() Tests", function() {
		var objUnderTest = new RoomSurveyor();

		it("Should exist", function() {
			expect(objUnderTest.surveyRoom).to.exist;
		});

		it("Should return object", function() {
			var testRoom = require("../testing/room");
			var memory = {};
			var game = require("../testing/data/gameData");
			objUnderTest = new RoomSurveyor(memory, game);
			expect(objUnderTest.surveyRoom(testRoom)).to.equal({});
		});
	});

	// this.getAll = function(objectType) {
	//     return this.memory[objectType];
	// };

	// this.getById = function(objectType, id) {
	//     return this.memory[objectType][id];
	// };
	// // add function calls to memory here

	// this.save = function(object) {
	//     if (!object.objectType) {
	//         throw "Error: object does not have a valid object type.";
	//     }
	//     if (!this.memory[object.objectType]) {
	//         this.memory[object.objectType] = {};
	//     }

	//     // new object
	//     if (!object.id) {
	//         // generate id
	//         object.id = this.getNextId(object.objectType);
	//     }
	//     this.memory[object.objectType][object.id] = object;
	//     return object;
	// };

	// this.getNextId = function(objectType) {
	//     if (!this.memory.objectIds) {
	//         this.memory.objectIds = {};
	//     }
	//     if (!this.memory.objectIds[objectType]) {
	//         this.memory.objectIds[objectType] = 0;
	//     }
	//     this.memory.objectIds[objectType]++;
	//     return this.memory.objectIds[objectType];
	// };

	// this.getNextCreepName = function() {
	//     return "Creep_" + this.getNextId(OBJECT_TYPE_CREEP_ID);
	// };
});
