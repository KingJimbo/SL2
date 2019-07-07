/* COLONY MANAGER TESTS */
var expect = require("chai").expect;
var sinon = require("sinon");
require("./common/constants");
var App = require("./app.js");

var obj = {rooms:{}};
describe("App Tests", function() {
    describe("App Ctor Tests", function() {
        describe("Passing no parameters", function() {
            it("Should throw exception.", function(){
                expect(function(){new App()}).to.throw(ERR_MESSAGE_INVALID_ARGS);
            });
        });
        describe("Passing both null", function() {
            it("Should throw exception.", function(){
                expect(function(){new App(null, null)}).to.throw(ERR_MESSAGE_INVALID_ARGS);
            });
        });
        
        describe("Passing game as null", function() {
            it("Should throw exception.", function(){
                expect(function(){new App(null, obj)}).to.throw(ERR_MESSAGE_INVALID_ARGS);
            });
        });

        describe("Passing memory as null", function() {
            it("Should throw exception.", function(){
                expect(function(){new App(obj, null)}).to.throw(ERR_MESSAGE_INVALID_ARGS);
            });
        });

        describe("Passing both memory & game", function() {
            it("Should not throw exception.", function(){
                expect(function(){new App(obj, obj)}).to.not.throw(ERR_MESSAGE_INVALID_ARGS);
            });
        });
    });
	describe("Run() Tests", function() {
        var app = new App(obj, obj)

        it("Should exist", function() {
            expect(app.run).to.exist;
        });
		
    });
});