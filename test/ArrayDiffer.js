var expect = require("chai").expect;
var sinon = require("sinon");

import { Comparer } from "../src/comparer";

import { ArrayDiffer } from "../src/strategies/diff/ArrayDiffer";

/* eslint-disable no-undef */

describe("ArrayDiffer", function() {
  describe("constructor", function() {
    it("Should throw error if comparer is not provided", function() {
      let arrayDifferCreator = function() {
        new ArrayDiffer();
      };

      expect(arrayDifferCreator).to.throw(Error);
    });

    it("Should throw error if comparer is not instance of the Comparer class", function() {
      let arrayDifferCreator = function() {
        let fakeComparer = {
          isEqual: function(first, second) {
            return first === second;
          }
        };

        new ArrayDiffer(fakeComparer);
      };

      expect(arrayDifferCreator).to.throw(Error);
    });

    it("Should not throw error if an instance of the Comparer class is provided as comparer", function() {
      let comparer = sinon.createStubInstance(Comparer, {
        isEqual: false
      });

      let arrayDifferCreator = function() {
        new ArrayDiffer(comparer);
      };

      expect(arrayDifferCreator).to.not.throw();
    });
  });

  describe("isValidArray", function() {
    let arr, obj, arrayDiffer, comparer;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      comparer = sinon.createStubInstance(Comparer, {
        isEqual: false
      });

      arrayDiffer = new ArrayDiffer(comparer);
    });

    it("Should be false if its argument is not array", function() {
      expect(arrayDiffer.isValidArray(obj)).to.be.false;
    });

    it("Should be true if its argument is array", function() {
      expect(arrayDiffer.isValidArray(arr)).to.be.true;
    });
  });

  describe("match", function() {
    let arr1, arr2, obj1, comparer, arrayDiffer;

    before(function() {
      arr1 = ["A", "B", "C"];
      arr2 = ["D", "E", "C"];
      obj1 = { a: "A", b: "B", c: "C" };

      comparer = sinon.createStubInstance(Comparer, {
        isEqual: false
      });

      arrayDiffer = new ArrayDiffer(comparer);
    });

    it("Should return false if one of its arguments is not array", function() {
      expect(arrayDiffer.match("Mostafa", arr1)).to.be.false;
      expect(arrayDiffer.match("Mostafa", arr1)).to.be.false;
      expect(arrayDiffer.match(obj1, arr1)).to.be.false;
      expect(arrayDiffer.match("Mostafa", obj1)).to.be.false;
    });

    it("Should return true if both of its arguments are array", function() {
      expect(arrayDiffer.match(arr1, arr2)).to.be.true;
    });
  });

  describe("diff", function() {
    let arrayDiffer, array1, array2, array3;

    before(function() {
      array1 = ["A", "B", "C", "D"];
      array2 = ["E", "F", "G", "H"];
      array3 = ["A", "B", "C", "D"];

      let isEqualStub = sinon.stub();
      isEqualStub.withArgs(array1, array3).returns(true);
      isEqualStub.withArgs(array1, array2).returns(false);
      isEqualStub.withArgs(array2, array3).returns(false);

      let comparer = sinon.createStubInstance(Comparer, {
        isEqual: isEqualStub
      });

      arrayDiffer = new ArrayDiffer(comparer);
    });

    it("Should return 'undefined' if an array is diffed from itself", function() {
      expect(arrayDiffer.diff(array1, array1)).to.be.undefined;
    });

    it("Should return 'undefined' if two arguments are equal", function() {
      expect(arrayDiffer.diff(array1, array3)).to.be.undefined;
    });

    it("Should return the modified array if two arguments are not equal", function() {
      expect(arrayDiffer.diff(array1, array2)).to.deep.equal(array2);
    });
  });
});
