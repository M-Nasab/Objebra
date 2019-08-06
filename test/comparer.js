var expect = require("chai").expect;
var sinon = require("sinon");

import { Comparer } from "../src/comparer";

/* eslint-disable no-undef */

describe("Comparer class", function() {
  describe("constructor", function() {
    it("Should create an instance of Comparer class", function() {
      let comparer;
      let comparerCreator = function() {
        comparer = new Comparer();
      };

      expect(comparerCreator).to.not.throw();
      expect(comparer).to.be.instanceOf(Comparer);
    });
  });

  describe("FindFirstMatchAndCompare", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObjectFirst,
      someObjectSecond,
      expectedCompareResult,
      strategies,
      comparer;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        isEqual: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        isEqual: sinon.stub()
      };

      someObjectFirst = {
        a: "A",
        b: "B",
        c: "C"
      };

      someObjectSecond = {
        a: "A",
        b: "B",
        c: "C"
      };

      expectedCompareResult = true;

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.isEqual.returns(expectedCompareResult);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      comparer = new Comparer({
        strategies
      });
    });

    it("Should compare objects correctly", function() {
      expect(
        comparer.findFirstMatchAndCompare(someObjectFirst, someObjectSecond)
      ).to.equal(expectedCompareResult);
    });
  });

  describe("isEqual", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObjectFirst,
      someObjectSecond,
      expectedCompareResult,
      strategies,
      comparer;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        isEqual: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        isEqual: sinon.stub()
      };

      someObjectFirst = {
        a: "A",
        b: "B",
        c: "C"
      };

      someObjectSecond = {
        a: "A",
        b: "B",
        c: "C"
      };

      expectedCompareResult = true;

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.isEqual.returns(expectedCompareResult);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      comparer = new Comparer({
        strategies
      });
    });

    it("Should compare objects correctly", function() {
      expect(comparer.isEqual(someObjectFirst, someObjectSecond)).to.equal(
        expectedCompareResult
      );
    });
  });
});
