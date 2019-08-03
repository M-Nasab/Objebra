var expect = require("chai").expect;
var sinon = require("sinon");

import { ArrayComparer } from "../../src/strategies/compare/ArrayComparer";

/* eslint-disable no-undef */

describe("ArrayComparer", function() {
  describe("isValidArray", function() {
    let comparer, arr, obj;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      comparer = new ArrayComparer();
    });

    it("Should be false if its argument is not array", function() {
      expect(comparer.isValidArray(obj)).to.be.false;
    });

    it("Should be true if its argument is array", function() {
      expect(comparer.isValidArray(arr)).to.be.true;
    });
  });

  describe("match", function() {
    let arr1, arr2, obj1, comparer;

    before(function() {
      arr1 = ["A", "B", "C"];
      arr2 = ["D", "E", "C"];
      obj1 = { a: "A", b: "B", c: "C" };

      comparer = new ArrayComparer();
    });

    it("Should return false if one of its arguments is not array", function() {
      expect(comparer.match("Mostafa", arr1)).to.be.false;
      expect(comparer.match(arr1, "Mostafa")).to.be.false;
      expect(comparer.match(obj1, arr1)).to.be.false;
      expect(comparer.match("Mostafa", obj1)).to.be.false;
    });

    it("Should return true if both of its arguments are array", function() {
      expect(comparer.match(arr1, arr2)).to.be.true;
    });
  });

  describe("isEqual", function() {
    let arrayComparer, arr1, arr2, arr3, arr4, arr5, arr6;

    before(function() {
      arr1 = ["A", "B", "C"];
      arr2 = ["D", "E", "F"];
      arr3 = [
        {
          a: "A",
          b: "B",
          c: "C"
        },
        {
          d: "D",
          e: "E",
          f: "F"
        }
      ];
      arr4 = [
        {
          a: "A",
          b: "B",
          c: "C"
        },
        {
          d: "D",
          e: "E",
          f: "F"
        }
      ];

      arr6 = [
        {
          a: "A",
          b: "B",
          c: "C"
        },
        {
          d: "Dprime",
          e: "E",
          f: "F"
        }
      ];

      arr5 = ["A", "B", "C"];

      arrayComparer = new ArrayComparer();
    });

    it("Should throw error if comarision context is not provided", function() {
      let arrayComparerCaller = function() {
        arrayComparer.isEqual(arr1, arr2);
      };

      expect(arrayComparerCaller).to.throw(Error);
    });

    it("Should throw error if comparison context has no isEqual function", function() {
      let arrayComparerCaller = function() {
        let context = {
          recursionDepth: 2
        };

        arrayComparer.isEqual(arr1, arr2, context);
      };

      expect(arrayComparerCaller).to.throw(Error);
    });

    it("Should throw error if context isEqual is not a function", function() {
      let arrayComparerCaller = function() {
        let context = {
          isEqual: "Some String",
          recursionDepth: 2
        };

        arrayComparer.isEqual(arr1, arr2, context);
      };

      expect(arrayComparerCaller).to.throw(Error);
    });

    it("Should return true if an array is compared with itself", function() {
      let isEqualStub = sinon.stub();

      let context = {
        recursionDepth: 0,
        isEqual: isEqualStub
      };
      expect(arrayComparer.isEqual(arr1, arr1, context)).to.be.true;
    });

    it("Should not call context isEqual if arrays have no object member", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      arrayComparer.isEqual(arr1, arr2, context);

      expect(isEqualStub.called).to.be.false;
    });

    it("Should call context isEqual if array have object members", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      arrayComparer.isEqual(arr3, arr4, context);

      expect(isEqualStub.called).to.be.true;
    });

    it("Should return true if two non-object arrays are equal", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(arrayComparer.isEqual(arr1, arr5, context)).to.be.true;
    });

    it("Should return false if two non-object arrays are not equal", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(arrayComparer.isEqual(arr1, arr2, context)).to.be.false;
    });

    it("Should return true if arrays with object members are equal", function() {
      let isEqualStub = sinon.stub();
      isEqualStub.withArgs(arr3[0], arr4[0]).returns(true);
      isEqualStub.withArgs(arr3[1], arr4[1]).returns(true);

      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(arrayComparer.isEqual(arr3, arr4, context)).to.be.true;
    });

    it("Should return false if arrays with object members are not equal", function() {
      let isEqualStub = sinon.stub();
      isEqualStub.withArgs(arr3[0], arr6[0]).returns(true);
      isEqualStub.withArgs(arr3[1], arr6[1]).returns(false);

      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(arrayComparer.isEqual(arr3, arr4, context)).to.be.false;
    });
  });
});
