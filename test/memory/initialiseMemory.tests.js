// const chai = require("chai");
// const expect = chai.expect;
// require("../constants/screepsConstants");
// const initialiseMemory = require("../../src/memory/initialiseMemory");
// const config = require("../../src/config/config");
// const createNewMemoryObject = require("../../src/memory/createNewMemoryObject");

// describe("initialiseMemory", () => {
// 	describe("initialiseMemory which hasn't previously been initialised", () => {
// 		it("should return an object that contains memoryIntialisedTime property set from game.", () => {
// 			let memory = {};
// 			const time = 100;
// 			let mockGame = require("../mocks/game");
// 			mockGame.memoryIntialisedTime = time;
// 			initialiseMemory(memory, mockGame, config);
// 			expect(memory).to.have.property("app").that.is.a("object").and.not.null.and.not.undefined;
// 			expect(memory.app).to.have.property("settings").that.is.a("object").and.not.null.and.not.undefined;
// 			expect(memory.app.settings).to.have.property("memoryIntialisedTime").that.is.a("number").and.equal(time);
// 			expect(memory.app).to.have.property("objectIds").that.is.an("object").and.not.null.and.not.undefined;
// 			expect(memory.app).to.have.property("structures").that.is.an("object").and.not.null.and.not.undefined;
// 			expect(memory.app).to.have.property("rooms").that.is.an("object").and.not.null.and.not.undefined;
// 			expect(memory.app).to.have.property("creeps").that.is.an("object").and.not.null.and.not.undefined;
// 		});
// 	});

// 	describe("initialiseMemory which has already been previously initialised", () => {
// 		it("should return an object that memoryIntialisedTime property which hasn't been updated with the current game time", () => {
// 			const memoryIntialisedTime = 100;
// 			let memory = { app: createNewMemoryObject(memoryIntialisedTime, config) };
// 			const currentTime = 101;
// 			let mockGame = require("../mocks/game");
// 			mockGame.memoryIntialisedTime = currentTime;
// 			initialiseMemory(memory, mockGame, config);
// 			expect(memory).to.have.property("app").that.is.a("object").and.not.null.and.not.undefined;
// 			expect(memory.app).to.have.property("settings").that.is.a("object").and.not.null.and.not.undefined;

// 			//console.log(JSON.stringify(memory));
// 			expect(memory.app.settings).to.have.property("memoryIntialisedTime").that.is.a("number").and.equal(memoryIntialisedTime);
// 		});
// 	});
// });
