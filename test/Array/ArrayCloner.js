var expect = require("chai").expect;
var sinon = require("sinon");

import { ArrayCloner } from "../../src/strategies/clone/ArrayCloner";

/* eslint-disable no-undef */

describe("ArrayCloner", function() {
  describe("constructor", function() {
    it("Should create an instance of ArrayCloner", function() {
      let arrayCloner;

      let arrayClonerCreator = function() {
        arrayCloner = new ArrayCloner();
      };

      expect(arrayClonerCreator).to.not.throw();
      expect(arrayCloner).to.be.instanceOf(ArrayCloner);
    });
  });

  describe("isValidArray", function() {
    let arr, obj, arrayCloner;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      arrayCloner = new ArrayCloner();
    });

    it("Should be false if its argument is not array", function() {
      expect(arrayCloner.isValidArray(obj)).to.be.false;
    });

    it("Should be true if its argument is array", function() {
      expect(arrayCloner.isValidArray(arr)).to.be.true;
    });
  });

  describe("match", function() {
    let arr1, arr2, obj1, arrayCloner;

    before(function() {
      arr1 = ["A", "B", "C"];
      arr2 = ["D", "E", "C"];
      obj1 = { a: "A", b: "B", c: "C" };

      arrayCloner = new ArrayCloner();
    });

    it("Should return false if one of its arguments is not array", function() {
      expect(arrayCloner.match("Mostafa", arr1)).to.be.false;
      expect(arrayCloner.match("Mostafa", arr1)).to.be.false;
      expect(arrayCloner.match(obj1, arr1)).to.be.false;
      expect(arrayCloner.match("Mostafa", obj1)).to.be.false;
    });

    it("Should return true if both of its arguments are array", function() {
      expect(arrayCloner.match(arr1, arr2)).to.be.true;
    });
  });

  describe("clone", function() {
    let arrayCloner, array1, array2, array1Clone;

    before(function() {
      array1 = ["A", "B", "C", "D"];
      array2 = ["E", "F", "G", "H"];

      array1Clone = ["A", "B", "C", "D"];

      arrayCloner = new ArrayCloner();
    });

    it("Should throw error if cloning context is not provided", function() {
      let arrayClonerCaller = function() {
        arrayCloner.clone(array1, array2);
      };

      expect(arrayClonerCaller).to.throw(Error);
    });

    it("Should throw error if cloning context has no clone function", function() {
      let arrayClonerCaller = function() {
        let context = {
          recursionDepth: 2
        };

        arrayCloner.clone(array1, array2, context);
      };

      expect(arrayClonerCaller).to.throw(Error);
    });

    it("Should throw error if context clone is not a function", function() {
      let arrayClonerCaller = function() {
        let context = {
          clone: "Some String",
          recursionDepth: 2
        };

        arrayCloner.clone(array1, array2, context);
      };

      expect(arrayClonerCaller).to.throw(Error);
    });

    it("Should clone array with non-object members correctly", function() {
      let context = {
        clone: sinon.stub()
      };

      let clonedArr = arrayCloner.clone(array1, context);

      expect(clonedArr).to.deep.equal(array1Clone);
    });

    it("Should clone array with object members correctly", function() {
      let arr = [
        {
          a: "A",
          b: "B",
          c: "C"
        },
        {
          d: "D",
          e: "E",
          f: "F"
        },
        {
          g: "G",
          h: "H",
          i: "I"
        }
      ];

      let expected_arr_clone = [
        {
          a: "A",
          b: "B",
          c: "C"
        },
        {
          d: "D",
          e: "E",
          f: "F"
        },
        {
          g: "G",
          h: "H",
          i: "I"
        }
      ];

      let cloneStub = sinon.stub();
      cloneStub.withArgs(arr[0]).returns(expected_arr_clone[0]);
      cloneStub.withArgs(arr[1]).returns(expected_arr_clone[1]);
      cloneStub.withArgs(arr[2]).returns(expected_arr_clone[2]);

      let context = {
        clone: cloneStub
      };

      expect(arrayCloner.clone(arr, context)).to.deep.equal(expected_arr_clone);
    });
  });
});
