var expect = require("chai").expect;
var sinon = require("sinon");

import { ArrayMerger } from "../src/strategies/merge/ArrayMerger";

/* eslint-disable no-undef */

describe("ArrayMerger", function() {
  describe("constructor", function() {
    it("Should Create an ArrayMerger object", function() {
      let arrayMerger = new ArrayMerger();

      expect(arrayMerger).to.be.instanceOf(ArrayMerger);
    });
  });

  describe("isValidArray", function() {
    let arr, obj, arrayMerger;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      arrayMerger = new ArrayMerger();
    });

    it("Should be false if its argument is not array", function() {
      expect(arrayMerger.isValidArray(obj)).to.be.false;
    });

    it("Should be true if its argument is array", function() {
      expect(arrayMerger.isValidArray(arr)).to.be.true;
    });
  });

  describe("match", function() {
    let arr1, arr2, obj1, arrayMerger;

    before(function() {
      arr1 = ["A", "B", "C"];
      arr2 = ["D", "E", "C"];
      obj1 = { a: "A", b: "B", c: "C" };

      arrayMerger = new ArrayMerger();
    });

    it("Should return false if one of its arguments is not array", function() {
      expect(arrayMerger.match("Mostafa", arr1)).to.be.false;
      expect(arrayMerger.match("Mostafa", arr1)).to.be.false;
      expect(arrayMerger.match(obj1, arr1)).to.be.false;
      expect(arrayMerger.match("Mostafa", obj1)).to.be.false;
    });

    it("Should return true if both of its arguments are array", function() {
      expect(arrayMerger.match(arr1, arr2)).to.be.true;
    });
  });

  describe("merge", function() {
    let arrayMerger, array1, array2;

    before(function() {
      array1 = ["A", "B", "C", "D"];
      array2 = ["E", "F", "G", "H"];

      arrayMerger = new ArrayMerger();
    });

    it("Should always return the changed array (second argument)", function() {
      expect(arrayMerger.merge(array1, array2)).to.deep.equal(array2);
    });
  });
});
