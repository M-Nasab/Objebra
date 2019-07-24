var expect = require("chai").expect;
var sinon = require("sinon");

import { ObjectComperer } from "../src/strategies/compare/ObjectComparer";

/* eslint-disable no-undef */

describe("ObjectComparer", function() {
  describe("isValidObject", function() {
    let comparer, arr, obj;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      comparer = new ObjectComperer();
    });

    it("Should be false if its argument is not object", function() {
      expect(comparer.isValidObject(arr)).to.be.false;
    });

    it("Should be true if its argument is object", function() {
      expect(comparer.isValidObject(obj)).to.be.true;
    });

    it("Should be false if its argument type is in excluded list", function() {
      let comparer = new ObjectComperer({
        exclude: [Date]
      });
      expect(comparer.isValidObject(new Date())).to.be.false;
    });
  });

  describe("match", function() {
    let arr1, obj1, obj2, comparer;

    before(function() {
      arr1 = ["A", "B", "C"];
      obj1 = { a: "A", b: "B", c: "C" };
      obj2 = { d: "D", e: "E", f: "F" };

      comparer = new ObjectComperer();
    });

    it("Should return false if one of its arguments is not valid object", function() {
      expect(comparer.match("Mostafa", obj1)).to.be.false;
      expect(comparer.match(obj1, "Mostafa")).to.be.false;
      expect(comparer.match(obj1, arr1)).to.be.false;
      expect(comparer.match("Mostafa", obj1)).to.be.false;
    });

    it("Should return true if both of its arguments are array", function() {
      expect(comparer.match(obj1, obj2)).to.be.true;
    });
  });

  describe("isEqual", function() {
    let objectComparer, obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9;

    before(function() {
      obj1 = {
        a: "A",
        b: "B",
        c: "C"
      };

      obj2 = {
        d: "D",
        e: "E",
        f: "F"
      };

      obj3 = {
        a: "A",
        b: {
          a: "A",
          b: "B",
          c: "C"
        }
      };

      obj4 = {
        a: "A",
        b: {
          d: "d",
          e: "E",
          f: "F"
        }
      };

      obj5 = {
        a: "A",
        b: "B"
      };

      obj6 = {
        a: "A",
        b: "B",
        c: "C"
      };

      obj7 = {
        a: {
          aa: "AA",
          ab: "AB",
          ac: "AC"
        },
        b: {
          ba: "BA",
          bb: "BB",
          bc: "BC"
        },
        c: {
          ca: "CA",
          cb: "CB",
          cc: "CC"
        }
      };

      obj8 = {
        a: {
          aa: "AA",
          ab: "AB",
          ac: "AC"
        },
        b: {
          ba: "BA",
          bb: "BB",
          bc: "BC"
        },
        c: {
          ca: "CA",
          cb: "CB",
          cc: "CC"
        }
      };

      obj9 = {
        a: {
          aa: "AA",
          ab: "AB",
          ac: "AC"
        },
        b: {
          ba: "BA",
          bb: "BB",
          bc: "BC"
        },
        c: "C"
      };

      objectComparer = new ObjectComperer();
    });

    it("Should throw error if comarision context is not provided", function() {
      let objectComparerCaller = function() {
        objectComparer.isEqual(obj1, obj2);
      };

      expect(objectComparerCaller).to.throw(Error);
    });

    it("Should throw error if comparison context has no isEqual function", function() {
      let objectComparerCaller = function() {
        let context = {
          recursionDepth: 2
        };

        objectComparer.isEqual(obj1, obj2, context);
      };

      expect(objectComparerCaller).to.throw(Error);
    });

    it("Should throw error if context isEqual is not a function", function() {
      let objectComparerCaller = function() {
        let context = {
          isEqual: "Some String",
          recursionDepth: 2
        };

        objectComparer.isEqual(obj1, obj2, context);
      };

      expect(objectComparerCaller).to.throw(Error);
    });

    it("Should return true if an object is compared with itself", function() {
      let isEqualStub = sinon.stub();

      let context = {
        recursionDepth: 0,
        isEqual: isEqualStub
      };

      expect(objectComparer.isEqual(obj1, obj1, context)).to.be.true;
    });

    it("Should not call context isEqual if objects have no object member", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      objectComparer.isEqual(obj1, obj2, context);

      expect(isEqualStub.called).to.be.false;
    });

    it("Should not call context isEqual if one of object members with same key is not object", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      objectComparer.isEqual(obj3, obj5, context);

      expect(isEqualStub.called).to.be.false;
    });

    it("Should call context isEqual if objects have object members with same keys", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      objectComparer.isEqual(obj3, obj4, context);

      expect(isEqualStub.called).to.be.true;
    });

    it("Should return true if two objects with non-object members are equal", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(objectComparer.isEqual(obj1, obj6, context)).to.be.true;
    });

    it("Should return false if two objects with non-object members are not equal", function() {
      let isEqualStub = sinon.stub();
      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(objectComparer.isEqual(obj1, obj2, context)).to.be.false;
    });

    it("Should return true if objects with object members are equal", function() {
      let isEqualStub = sinon.stub();
      isEqualStub.withArgs(obj7.a, obj8.a).returns(true);
      isEqualStub.withArgs(obj7.b, obj8.b).returns(true);
      isEqualStub.withArgs(obj7.c, obj8.c).returns(true);

      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(objectComparer.isEqual(obj7, obj8, context)).to.be.true;
    });

    it("Should return false if objects with object members are not equal", function() {
      let isEqualStub = sinon.stub();
      isEqualStub.withArgs(obj8.a, obj9.a).returns(true);
      isEqualStub.withArgs(obj8.b, obj9.b).returns(true);

      let context = {
        isEqual: isEqualStub,
        recursionDepth: 0
      };

      expect(objectComparer.isEqual(obj8, obj9, context)).to.be.false;
    });
  });
});
