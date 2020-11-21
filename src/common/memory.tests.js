// /* COLONY MANAGER TESTS */
// var expect = require("chai").expect;
// var sinon = require("sinon");
// require("../common/constants");
// var MemoryManager = require("./memory.js");

// var obj = {rooms:{}};
// describe("Memory Manager Tests", function() {
//     describe("Ctor Tests", function() {
//         describe("Passing no parameters", function() {
//             it("Should throw exception.", function(){
//                 expect(function(){new MemoryManager()}).to.throw(ERR_MESSAGE_INVALID_ARGS);
//             });
//         });

//         describe("Passing valid parameters", function() {
//             it("Should not throw exception.", function(){
//                 expect(function(){new MemoryManager(obj)}).to.not.throw(ERR_MESSAGE_INVALID_ARGS);
//             });
//         });
//     });

// 	describe("getAll() Tests", function() {
//         var memory = { OBJECT_TYPE_COLONY: { "1":{id:1}, "2":{id:2} } };
//         var objUnderTest = new MemoryManager(memory);

//         it("Should exist", function() {
//             expect(objUnderTest.getAll).to.exist;
//         });

//         it("Should return all colonies.", function(){
//             expect(objUnderTest.GetAll(OBJECT_TYPE_COLONY)).to.equal(memory);
//         });

//     });

//     // this.getAll = function(objectType) {
//     //     return this.memory[objectType];
//     // };

//     // this.getById = function(objectType, id) {
//     //     return this.memory[objectType][id];
//     // };
//     // // add function calls to memory here

//     // this.save = function(object) {
//     //     if (!object.objectType) {
//     //         throw "Error: object does not have a valid object type.";
//     //     }
//     //     if (!this.memory[object.objectType]) {
//     //         this.memory[object.objectType] = {};
//     //     }

//     //     // new object
//     //     if (!object.id) {
//     //         // generate id
//     //         object.id = this.getNextId(object.objectType);
//     //     }
//     //     this.memory[object.objectType][object.id] = object;
//     //     return object;
//     // };

//     // this.getNextId = function(objectType) {
//     //     if (!this.memory.objectIds) {
//     //         this.memory.objectIds = {};
//     //     }
//     //     if (!this.memory.objectIds[objectType]) {
//     //         this.memory.objectIds[objectType] = 0;
//     //     }
//     //     this.memory.objectIds[objectType]++;
//     //     return this.memory.objectIds[objectType];
//     // };

//     // this.getNextCreepName = function() {
//     //     return "Creep_" + this.getNextId(OBJECT_TYPE_CREEP_ID);
//     // };
// });
