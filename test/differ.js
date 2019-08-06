var expect = require("chai").expect;
var sinon = require("sinon");

import { Differ } from "../src/differ";

/* eslint-disable no-undef */

describe("Differ class", function() {
  describe("constructor", function() {
    it("Should create an instance of Differ class", function() {
      let differ;
      let differCreator = function() {
        differ = new Differ();
      };

      expect(differCreator).to.not.throw();
      expect(differ).to.be.instanceOf(Differ);
    });
  });

  describe("FindFirstMatchAndDiff", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObjectFirst,
      someObjectSecond,
      expectedDiffResult,
      strategies,
      differ;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        diff: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        diff: sinon.stub()
      };

      someObjectFirst = {
        a: "A",
        b: "B",
        c: "C"
      };

      someObjectSecond = {
        a: "A",
        b: "B",
        c: "Cprime"
      };

      expectedDiffResult = {
        c: "Cprime"
      };

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.diff.returns(expectedDiffResult);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      differ = new Differ({
        strategies
      });
    });

    it("Should diff objects correctly", function() {
      expect(
        differ.findFirstMatchAndDiff(someObjectFirst, someObjectSecond)
      ).to.equal(expectedDiffResult);
    });
  });

  describe("diff", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObjectFirst,
      someObjectSecond,
      expectedDiffResult,
      strategies,
      differ;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        diff: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        diff: sinon.stub()
      };

      someObjectFirst = {
        a: "A",
        b: "B",
        c: "C"
      };

      someObjectSecond = {
        a: "A",
        b: "B",
        c: "Cprime"
      };

      expectedDiffResult = {
        c: "Cprime"
      };

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.diff.returns(expectedDiffResult);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      differ = new Differ({
        strategies
      });
    });

    it("Should diff objects correctly", function() {
      expect(differ.diff(someObjectFirst, someObjectSecond)).to.equal(
        expectedDiffResult
      );
    });
  });
});
