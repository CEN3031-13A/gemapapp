//Writes a suite of tests
var expect = require("chai").expect;
var tools = require("../public/tests_lib"); //Library of tests

describe("doSomething()", function(){
	it("Description: Should do something that we want", function(){
		var results = tools.doSomething({first: "Kassandra", last: "Crompton"});
		expect(results).to.equal("Banks, Alex");
	});

});