var expect = require("chai").expect;
var sinon = require("sinon");

import { Merger } from "../src/merger";

/* eslint-disable no-undef */

describe("Merger class", function() {
  describe("constructor", function() {
    it("Should create an instance of Merger class", function() {
      let merger;
      let mergerCreator = function() {
        merger = new Merger();
      };

      expect(mergerCreator).to.not.throw();
      expect(merger).to.be.instanceOf(Merger);
    });
  });

  describe("FindFirstMatchAndMerge", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObjectFirst,
      someObjectSecond,
      expectedMergeResult,
      strategies,
      merger;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        merge: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        merge: sinon.stub()
      };

      someObjectFirst = {
        a: "A",
        b: "B",
        c: "C"
      };

      someObjectSecond = {
        a: "A",
        b: "B",
        c: "Cprime",
        d: "D"
      };

      expectedMergeResult = {
        a: "A",
        b: "B",
        c: "Cprime",
        d: "D"
      };

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.merge.returns(expectedMergeResult);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      merger = new Merger({
        strategies
      });
    });

    it("Should merge objects correctly", function() {
      expect(
        merger.findFirstMatchAndMerge(someObjectFirst, someObjectSecond)
      ).to.equal(expectedMergeResult);
    });
  });

  describe("merge", function() {
    let fakeMatchingStrategy,
      fakeNotMatchingStrategy,
      someObjectFirst,
      someObjectSecond,
      expectedMergeResult,
      strategies,
      merger;

    beforeEach(function() {
      fakeNotMatchingStrategy = {
        match: sinon.stub(),
        merge: sinon.stub()
      };

      fakeNotMatchingStrategy.match.returns(false);

      fakeMatchingStrategy = {
        match: sinon.stub(),
        merge: sinon.stub()
      };

      someObjectFirst = {
        a: "A",
        b: "B",
        c: "C"
      };

      someObjectSecond = {
        a: "A",
        b: "B",
        c: "Cprime",
        d: "D"
      };

      expectedMergeResult = {
        a: "A",
        b: "B",
        c: "Cprime",
        d: "D"
      };

      fakeMatchingStrategy.match.returns(true);
      fakeMatchingStrategy.merge.returns(expectedMergeResult);

      strategies = [fakeNotMatchingStrategy, fakeMatchingStrategy];

      merger = new Merger({
        strategies
      });
    });

    it("Should merge objects correctly", function() {
      expect(merger.merge(someObjectFirst, someObjectSecond)).to.equal(
        expectedMergeResult
      );
    });
  });
});
