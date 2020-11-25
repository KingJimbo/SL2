var expect = require("chai").expect;
var sinon = require("sinon");
var testingConstants = require("../testing/constants");
//this = Object.assign(this, testingConstants);
//Object.assign(exports, testingConstants);

var appConstants = require("../common/constants");
appConstants = Object.assign(appConstants, testingConstants);
global = Object.assign(global, appConstants);
// Object.assign(exports, appConstants);

var RoomSurveyor = require("./roomSurveyor");

function createObjectUnderTest() {
	var objUnderTest = new RoomSurveyor();
	//Object.assign(objUnderTest, testingConstants);
	objUnderTest = Object.assign(objUnderTest, appConstants);
	return objUnderTest;
}

var obj = { rooms: {} };
describe("Room Surveyor Tests", function () {
	describe("getDirectionOfPositionFromPosition() Tests", function () {
		describe("getDirectionOfPositionFromPosition() BOTTOM_LEFT Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 0, y: 0 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal BOTTOM_LEFT", function () {
				expect(direction).to.equal(BOTTOM_LEFT);
			});
		});

		describe("getDirectionOfPositionFromPosition() LEFT Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 0, y: 1 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal LEFT", function () {
				expect(direction).to.equal(LEFT);
			});
		});

		describe("getDirectionOfPositionFromPosition() TOP_LEFT Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 0, y: 2 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal TOP_LEFT", function () {
				expect(direction).to.equal(TOP_LEFT);
			});
		});

		describe("getDirectionOfPositionFromPosition() TOP Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 1, y: 2 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal TOP", function () {
				expect(direction).to.equal(TOP);
			});
		});

		describe("getDirectionOfPositionFromPosition() BOTTOM Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 1, y: 0 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal BOTTOM", function () {
				expect(direction).to.equal(BOTTOM);
			});
		});

		describe("getDirectionOfPositionFromPosition() BOTTOM_RIGHT Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 2, y: 0 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal BOTTOM_RIGHT", function () {
				expect(direction).to.equal(BOTTOM_RIGHT);
			});
		});

		describe("getDirectionOfPositionFromPosition() RIGHT Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 2, y: 1 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal RIGHT", function () {
				expect(direction).to.equal(RIGHT);
			});
		});

		describe("getDirectionOfPositionFromPosition() TOP_RIGHT Test", function () {
			var objUnderTest = createObjectUnderTest();

			var originalPos = { x: 1, y: 1 };
			var followingPos = { x: 2, y: 2 };

			var direction = objUnderTest.getDirectionOfPositionFromPosition(originalPos, followingPos);

			it("Should equal TOP_RIGHT", function () {
				expect(direction).to.equal(TOP_RIGHT);
			});
		});

		// it("Should exist", function() {
		// 	expect(objUnderTest.surveyRoom).to.exist;
		// });

		// it("Should return object", function() {
		// 	var testRoom = require("../testing/room");
		// 	var memory = {};
		// 	var game = require("../testing/data/gameData");
		// 	objUnderTest = new RoomSurveyor(memory, game);
		// 	expect(objUnderTest.surveyRoom(testRoom)).to.equal({});
		// });

		// it("Should return object", function() {
		// 	var testRoom = require("../testing/room");
		// 	var memory = {};
		// 	var game = require("../testing/data/gameData");
		// 	objUnderTest = new RoomSurveyor(memory, game);
		// 	expect(objUnderTest.surveyRoom(testRoom)).to.equal({});
		// });
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
