var expect = require("chai").expect;
var sinon = require("sinon");

import { Cloner } from "../src/cloner";

/* eslint-disable no-undef */

describe("Cloner class", function() {
  describe("constructor", function() {
    it("Should create an instance of Cloner class", function() {
      let cloner;
      let clonerCreator = function() {
        cloner = new Cloner();
      };

      expect(clonerCreator).to.not.throw();
      expect(cloner).to.be.instanceOf(Cloner);
    });
  });

  describe("FindFirstMatchAndClone", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObject,
      expectedClonedObject,
      strategies,
      cloner;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        clone: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        clone: sinon.stub()
      };

      someObject = {
        a: "A",
        b: "B",
        c: "C"
      };

      expectedClonedObject = {
        a: "A",
        b: "B",
        c: "C"
      };

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.clone.returns(expectedClonedObject);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      cloner = new Cloner({
        strategies
      });
    });

    it("Should return the cloned object", function() {
      expect(cloner.findFirstMatchAndClone(someObject)).to.equal(
        expectedClonedObject
      );
    });
  });

  describe("clone", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObject,
      expectedClonedObject,
      strategies,
      cloner;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        clone: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        clone: sinon.stub()
      };

      someObject = {
        a: "A",
        b: "B",
        c: "C"
      };

      expectedClonedObject = {
        a: "A",
        b: "B",
        c: "C"
      };

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.clone.returns(expectedClonedObject);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      cloner = new Cloner({
        strategies
      });
    });

    it("Should clone the object", function() {
      expect(cloner.clone(someObject)).to.equal(expectedClonedObject);
    });
  });
});
