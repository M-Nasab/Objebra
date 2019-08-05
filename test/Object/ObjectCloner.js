var expect = require("chai").expect;
var sinon = require("sinon");

import { ObjectCloner } from "../../src/strategies/clone/ObjectCloner";

/* eslint-disable no-undef */

describe("ObjectCloner", function() {
  describe("constructor", function() {
    it("Should create an instance of ObjectCloner", function() {
      let objectCloner;

      let objectClonerCreator = function() {
        objectCloner = new ObjectCloner();
      };

      expect(objectClonerCreator).to.not.throw();
      expect(objectCloner).to.be.instanceOf(ObjectCloner);
    });
  });

  describe("isValidObject", function() {
    let arr, obj, objectCloner;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      objectCloner = new ObjectCloner();
    });

    it("Should be false if its argument is not object", function() {
      expect(objectCloner.isValidObject(arr)).to.be.false;
    });

    it("Should be true if its argument is object", function() {
      expect(objectCloner.isValidObject(obj)).to.be.true;
    });

    it("Should be false if its argument type is in excluded list", function() {
      let objectCloner = new ObjectCloner({
        exclude: [Date]
      });

      expect(objectCloner.isValidObject(new Date())).to.be.false;
    });
  });

  describe("match", function() {
    let arr1, obj1, obj2, objectCloner;

    before(function() {
      arr1 = ["A", "B", "C"];
      obj1 = { a: "A", b: "B", c: "C" };
      obj2 = { d: "D", e: "E", f: "F" };

      objectCloner = new ObjectCloner();
    });

    it("Should return false if one of its arguments is not valid object", function() {
      expect(objectCloner.match("Mostafa")).to.be.false;
      expect(objectCloner.match(arr1)).to.be.false;
    });

    it("Should return true if both of its arguments are array", function() {
      expect(objectCloner.match(obj1, obj2)).to.be.true;
    });
  });

  describe("clone", function() {
    let obj1, objectCloner, context;

    before(function() {
      context = {
        recursionDepth: 0,
        clone: sinon.stub()
      };

      obj1 = {
        a: "A",
        b: "B",
        c: "C"
      };

      objectCloner = new ObjectCloner();
    });

    it("Should throw error if cloning context is not provided", function() {
      let objectClonerCaller = function() {
        objectCloner.clone(obj1);
      };

      expect(objectClonerCaller).to.throw(Error);
    });

    it("Should throw error if cloning context has no clone function", function() {
      let objectClonerCaller = function() {
        let context = {
          recursionDepth: 2
        };

        objectCloner.clone(obj1, context);
      };

      expect(objectClonerCaller).to.throw(Error);
    });

    it("Should throw error if context clone is not a function", function() {
      let objectClonerCaller = function() {
        let context = {
          clone: "Some String",
          recursionDepth: 2
        };

        objectCloner.clone(obj1, context);
      };

      expect(objectClonerCaller).to.throw(Error);
    });

    describe("merge objects with non-object properties", function() {
      it("Cloned object should not refer to the original object", function() {
        expect(objectCloner.clone(obj1, context)).to.not.equal(obj1);
      });

      it("Cloned object Should be deep equal to the original object", function() {
        expect(objectCloner.clone(obj1, context)).to.deep.equal(obj1);
      });

      it("Should ignore filtered keys", function() {
        let keyFilter = function(key) {
          return !/^\$\$\$/.test(key);
        };

        objectCloner = new ObjectCloner({
          keyFilter
        });

        let objectWithFilteredKeys1 = {
          $$$hash: "1234567",
          a: 1
        };

        let objectWithFilteredKeys2 = {
          $$$hash: "12345679999",
          $$$hash2: "32143221",
          a: 2
        };

        expect(
          objectCloner.clone(objectWithFilteredKeys1, context)
        ).to.not.have.property("$$$hash");

        expect(
          objectCloner.clone(objectWithFilteredKeys2, context)
        ).to.not.have.property("$$$hash2");

        expect(
          objectCloner.clone(objectWithFilteredKeys2, context)
        ).to.not.have.property("$$$hash2");
      });
    });

    describe("Objects with object properties", function() {
      let obj1a, obj1b, obj1c, obj2, obj2a, obj2b, obj2c, context, cloneStub;

      before(function() {
        obj1a = {
          aa: "AA",
          ab: "AB",
          ac: "AC"
        };

        obj1b = {
          ba: "BA",
          bb: "BB",
          bc: "BC"
        };

        obj1c = {
          ca: "CA",
          cb: "CB",
          cc: "CC"
        };

        obj1 = {
          a: obj1a,
          b: obj1b,
          c: obj1c
        };

        obj2a = ["a", "b", "c"];
        obj2b = ["d", "e", "f"];
        obj2c = ["g", "h", "i"];

        obj2 = {
          a: obj2a,
          b: obj2b,
          c: obj2c
        };

        cloneStub = sinon.stub();

        cloneStub.withArgs(obj1.a).returns({
          aa: "AA",
          ab: "AB",
          ac: "AC"
        });

        cloneStub.withArgs(obj1.b).returns({
          ba: "BA",
          bb: "BB",
          bc: "BC"
        });

        cloneStub.withArgs(obj1.c).returns({
          ca: "CA",
          cb: "CB",
          cc: "CC"
        });

        cloneStub.withArgs(obj2.a).returns(["a", "b", "c"]);
        cloneStub.withArgs(obj2.b).returns(["d", "e", "f"]);
        cloneStub.withArgs(obj2.c).returns(["g", "h", "i"]);

        context = {
          recursionDepth: 0,
          clone: cloneStub
        };
      });

      describe("when deep is true", function() {
        let objectCloner;

        before(function() {
          objectCloner = new ObjectCloner({
            deep: true
          });
        });

        it("Should handle array properties", function() {
          let clonedObject = objectCloner.clone(obj2, context);

          expect(clonedObject).to.deep.equal({
            a: ["a", "b", "c"],
            b: ["d", "e", "f"],
            c: ["g", "h", "i"]
          });
        });

        it("Should handle object properties", function() {
          let clonedObject = objectCloner.clone(obj1, context);

          expect(clonedObject).to.deep.equal({
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
          });
        });
      });

      describe("when deep is false", function() {
        before(function() {
          objectCloner = new ObjectCloner({
            deep: false
          });
        });

        it("Should throw error if cloning depth is greater than maxDepth", function() {
          let objectClonerCaller = function() {
            let context = {
              recursionDepth: 1,
              clone: cloneStub
            };

            objectCloner.clone(obj1, context);
          };

          expect(objectClonerCaller).to.throw(Error);
        });

        it("Should throw error if maxDepth is undefined", function() {
          let objectClonerCaller = function() {
            new ObjectCloner({
              maxDepth: undefined,
              deep: false
            });
          };

          expect(objectClonerCaller).to.throw(Error);
        });

        it("Should throw error if maxDepth is not zero or a positive integer", function() {
          let objectClonerCreator = function() {
            new ObjectCloner({
              maxDepth: "some string",
              deep: false
            });
          };

          let objectClonerCreator2 = function() {
            new ObjectCloner({
              maxDepth: "4",
              deep: false
            });
          };

          expect(objectClonerCreator).to.throw(Error);
          expect(objectClonerCreator2).to.throw(Error);
        });

        it("Should not call clone again if cloning depth is equal to maxDepth", function() {
          cloneStub.resetHistory();
          let objectCloner = new ObjectCloner({
            deep: false,
            maxDepth: 1
          });

          let context = {
            recursionDepth: 1,
            clone: cloneStub
          };

          objectCloner.clone(obj1, context);

          expect(cloneStub.called).to.be.false;
        });

        it("Should increase depth if it calls clone function again", function() {
          cloneStub.resetHistory();
          let objectCloner = new ObjectCloner({
            deep: false,
            maxDepth: 5
          });

          let context = {
            recursionDepth: 2,
            clone: cloneStub
          };

          objectCloner.clone(obj1, context);

          expect(cloneStub.called).to.be.true;

          expect(cloneStub.getCall(0).args[1].recursionDepth).to.equal(3);
        });
      });
    });
  });
});
