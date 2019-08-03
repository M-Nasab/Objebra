var expect = require("chai").expect;
var sinon = require("sinon");

import { ObjectDiffer } from "../../src/strategies/diff/ObjectDiffer.js";
import { Comparer } from "../../src/comparer.js";

/* eslint-disable no-undef */

describe("ObjectDiffer", function() {
  describe("constructor", function() {
    it("Should throw error if comparer is not provided", function() {
      let objectDiffCreator = function() {
        new ObjectDiffer();
      };

      expect(objectDiffCreator).to.throw(Error);
    });

    it("Should throw error if comparer is not instance of the Comparer class", function() {
      let objectDiffCreator = function() {
        let fakeComparer = {
          isEqual: function(first, second) {
            return first === second;
          }
        };

        new ObjectDiffer(fakeComparer);
      };

      expect(objectDiffCreator).to.throw(Error);
    });

    it("Should not throw error if an instance of the Comparer class is provided as comparer", function() {
      let comparer = sinon.createStubInstance(Comparer, {
        isEqual: false
      });

      let objectDiffCreator = function() {
        new ObjectDiffer(comparer);
      };

      expect(objectDiffCreator).to.not.throw();
    });
  });

  describe("isValidObject", function() {
    let arr, obj, objectDiffer, comparer;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      comparer = sinon.createStubInstance(Comparer, {
        isEqual: false
      });

      objectDiffer = new ObjectDiffer(comparer);
    });

    it("Should be false if one of its arguments is array", function() {
      expect(objectDiffer.isValidObject(arr)).to.be.false;
    });

    it("Should be false if one of its arguments is not object", function() {
      expect(objectDiffer.isValidObject("M")).to.be.false;
    });

    it("Should be false if its argument's type is in the 'exclude' list", function() {
      let objectDifferOptions = {
        exclude: [Date, String]
      };
      let objectDiffer = new ObjectDiffer(comparer, objectDifferOptions);

      expect(objectDiffer.isValidObject(new Date())).to.be.false;
      expect(objectDiffer.isValidObject(new String("Mostafa"))).to.be.false;
    });

    it("Should be true if its arguments is object", function() {
      expect(objectDiffer.isValidObject(obj)).to.be.true;
    });
  });

  describe("match", function() {
    let arr, obj1, obj2, comparer, objectDiffer;

    before(function() {
      arr = ["A", "B", "C"];
      obj1 = { a: "A", b: "B", c: "C" };
      obj2 = { d: "D", e: "E", f: "F" };

      comparer = sinon.createStubInstance(Comparer, {
        isEqual: false
      });

      objectDiffer = new ObjectDiffer(comparer);
    });

    it("Should return false if one of its arguments is not object", function() {
      expect(objectDiffer.match("Mostafa", obj1)).to.be.false;
      expect(objectDiffer.match("Mostafa", arr)).to.be.false;
      expect(objectDiffer.match(obj1, arr)).to.be.false;
      expect(objectDiffer.match("Mostafa", arr)).to.be.false;
    });

    it("Should return true if both of its arguments are object", function() {
      expect(objectDiffer.match(obj1, obj2)).to.be.true;
    });
  });

  describe("diff", function() {
    let objectDiffer;

    before(function() {
      let isEqualStub = sinon.stub();

      let comparer = sinon.createStubInstance(Comparer, {
        isEqual: isEqualStub
      });

      objectDiffer = new ObjectDiffer(comparer);
    });

    describe("diff general behaviour", function() {
      it("Should throw error if diffing context is not provided", function() {
        let objectDiffCaller = function() {
          let obj1 = { a: "A", b: "B", c: "C" };
          let obj2 = { d: "D", e: "E", f: "F" };
          objectDiffer.diff(obj1, obj2);
        };

        expect(objectDiffCaller).to.throw(Error);
      });

      it("Should throw error if diffing context has no diff function", function() {
        let objectDiffCaller = function() {
          let obj1 = { a: "A", b: "B", c: "C" };
          let obj2 = { d: "D", e: "E", f: "F" };
          let context = {
            recursionDepth: 2
          };

          objectDiffer.diff(obj1, obj2, context);
        };

        expect(objectDiffCaller).to.throw(Error);
      });

      it("Should throw error if context diff is not a function", function() {
        let objectDiffCaller = function() {
          let obj1 = { a: "A", b: "B", c: "C" };
          let obj2 = { d: "D", e: "E", f: "F" };
          let context = {
            diff: "Some String",
            recursionDepth: 2
          };

          objectDiffer.diff(obj1, obj2, context);
        };

        expect(objectDiffCaller).to.throw(Error);
      });
    });

    describe("diff objects with non-object properties", function() {
      let obj1, obj2, context;

      before(function() {
        obj1 = { a: "A", b: "B", c: "C", d: "D", e: undefined };
        obj2 = { a: "Aprime", b: "B", c: "Cprime", d: "D", e: null };

        context = {
          diff: function() {},
          recursionDepth: 1
        };
      });

      it("Should return empty object (which is '{}') if an object is diffed from itself", function() {
        expect(objectDiffer.diff(obj1, obj1, context)).to.deep.equal({});
      });

      it("Should return an object with the same keys but undefined values if second parameter is empty object (which is '{}')", function() {
        expect(objectDiffer.diff(obj1, {}, context)).to.deep.equal({
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined,
          e: undefined
        });
      });

      it("Should return the same object if the object is diffed from an empty object (which is '{}')", function() {
        expect(objectDiffer.diff({}, obj1, context)).to.deep.equal(obj1);
      });

      it("Should not have properties which have not been changed", function() {
        expect(objectDiffer.diff(obj1, obj2, context)).to.not.have.any.keys(
          "b",
          "d",
          "e"
        );
      });

      it("Should have properties which have been changed", function() {
        expect(objectDiffer.diff(obj1, obj2, context)).to.have.all.keys(
          "a",
          "c"
        );
      });

      it("Should have its properties equal to modified object properties", function() {
        let diffObject = objectDiffer.diff(obj1, obj2, context);

        expect(diffObject["a"]).to.equal("Aprime");
        expect(diffObject["c"]).to.equal("Cprime");
      });

      it("Should count undefined and null values the same", function() {
        expect(objectDiffer.diff(obj1, obj2, context)).to.not.have.property(
          "e"
        );
      });
    });

    describe("diff objects with object properties", function() {
      describe("when deep is true", function() {
        let objectDiffer, context, comparer, isEqualStub, diffStub;
        let obj1_and_obj3_expected_diff;

        let obj1,
          obj2,
          obj3,
          obj4,
          obj5,
          objectWithFilteredKeys1,
          objectWithFilteredKeys2;

        before(function() {
          obj1 = {
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

          obj2 = {
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

          obj3 = {
            a: {
              aa: "AAprime",
              ab: "AB",
              ac: "AC"
            },
            b: {
              ba: "BA",
              bb: "BB",
              bc: "BC"
            },
            d: {
              da: "DA",
              db: "DB",
              dc: "DC"
            }
          };

          obj4 = {
            a: ["a", "b", "c"],
            d: ["d", "e", "f"]
          };

          obj5 = {
            a: ["a", "b", "c"],
            d: ["d", "e", "g"]
          };

          objectWithFilteredKeys1 = {
            $$$hash: "1234567",
            a: 1
          };

          objectWithFilteredKeys2 = {
            $$$hash: "12345679999",
            $$$hash2: "32143221",
            a: 2
          };

          obj1_and_obj3_expected_diff = {
            a: {
              aa: "AAprime"
            },
            c: undefined,
            d: {
              da: "DA",
              db: "DB",
              dc: "DC"
            }
          };

          isEqualStub = sinon.stub();
          isEqualStub.returns(false);
          isEqualStub.withArgs(obj1.a, obj2.a).returns(true);
          isEqualStub.withArgs(obj1.b, obj2.b).returns(true);
          isEqualStub.withArgs(obj1.c, obj2.c).returns(true);
          isEqualStub.withArgs(obj1.a, obj3.a).returns(false);
          isEqualStub.withArgs(obj1.b, obj3.b).returns(true);
          isEqualStub.withArgs(obj4.a, obj5.a).returns(true);
          isEqualStub.withArgs(obj4.d, obj5.d).returns(false);

          comparer = sinon.createStubInstance(Comparer, {
            isEqual: isEqualStub
          });

          let keyFilter = function(key) {
            return !/^\$\$\$/.test(key);
          };

          objectDiffer = new ObjectDiffer(comparer, {
            deep: true,
            maxDepth: 4,
            keyFilter
          });

          diffStub = sinon.stub();
          diffStub
            .withArgs(obj1.a, obj3.a)
            .returns(obj1_and_obj3_expected_diff.a);
          diffStub.withArgs(obj4.d, obj5.d).returns(["d", "e", "g"]);

          context = {
            recursionDepth: 5,
            diff: diffStub
          };
        });

        it("Should return empty object if an object with object values is diffed from itself", function() {
          expect(objectDiffer.diff(obj1, obj1, context)).to.deep.equal({});
        });

        it("Should return empty object if an object with object values is diffed from its clone", function() {
          expect(objectDiffer.diff(obj1, obj2, context)).to.deep.equal({});
        });

        it("Should return an object with the same keys but undefined values if second parameter is empty object (which is '{}')", function() {
          expect(objectDiffer.diff(obj1, {}, context)).to.deep.equal({
            a: undefined,
            b: undefined,
            c: undefined
          });
        });

        it("Should return the same object if the object is diffed from an empty object (which is '{}')", function() {
          expect(objectDiffer.diff({}, obj1, context)).to.deep.equal(obj1);
        });

        it("Should not have unchanged fields", function() {
          expect(objectDiffer.diff(obj1, obj3, context)).to.not.have.property(
            "b"
          );
        });

        it("Should have changed fields", function() {
          expect(objectDiffer.diff(obj1, obj3, context)).to.have.all.keys(
            "a",
            "c",
            "d"
          );
        });

        it("Changed field should have the correct value", function() {
          expect(objectDiffer.diff(obj1, obj3, context).a).to.deep.equal(
            obj1_and_obj3_expected_diff.a
          );
        });

        it("Removed field should be undefined", function() {
          expect(objectDiffer.diff(obj1, obj3, context).c).to.be.undefined;
        });

        it("Added field should have the correct value", function() {
          expect(objectDiffer.diff(obj1, obj3, context).d).to.deep.equal(
            obj1_and_obj3_expected_diff.d
          );
        });

        it("Should handle array fields", function() {
          expect(objectDiffer.diff(obj4, obj5, context)).to.not.have.property(
            "a"
          );
          expect(objectDiffer.diff(obj4, obj5, context)).to.have.property("d");
          expect(objectDiffer.diff(obj4, obj5, context).d).to.deep.equal(
            obj5.d
          );
        });

        it("Should ignore filtered keys", function() {
          expect(
            objectDiffer.diff(
              objectWithFilteredKeys1,
              objectWithFilteredKeys2,
              context
            )
          ).to.not.have.property("$$$hash");

          expect(
            objectDiffer.diff(
              objectWithFilteredKeys1,
              objectWithFilteredKeys2,
              context
            )
          ).to.not.have.property("$$$hash2");
        });
      });

      describe("When deep is false", function() {
        let objectDiffer, comparer, isEqualStub, diffStub;
        let obj1_and_obj3_expected_diff;

        let obj1, obj2, obj3, obj4, obj5;

        before(function() {
          obj1 = {
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

          obj2 = {
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

          obj3 = {
            a: {
              aa: "AAprime",
              ab: "AB",
              ac: "AC"
            },
            b: {
              ba: "BA",
              bb: "BB",
              bc: "BC"
            },
            d: {
              da: "DA",
              db: "DB",
              dc: "DC"
            }
          };

          obj4 = {
            a: ["a", "b", "c"],
            d: ["d", "e", "f"]
          };

          obj5 = {
            a: ["a", "b", "c"],
            d: ["d", "e", "g"]
          };

          obj1_and_obj3_expected_diff = {
            a: {
              aa: "AAprime"
            },
            c: undefined,
            d: {
              da: "DA",
              db: "DB",
              dc: "DC"
            }
          };

          isEqualStub = sinon.stub();
          isEqualStub.returns(false);
          isEqualStub.withArgs(obj1.a, obj2.a).returns(true);
          isEqualStub.withArgs(obj1.b, obj2.b).returns(true);
          isEqualStub.withArgs(obj1.c, obj2.c).returns(true);
          isEqualStub.withArgs(obj1.a, obj3.a).returns(false);
          isEqualStub.withArgs(obj1.b, obj3.b).returns(true);
          isEqualStub.withArgs(obj4.a, obj5.a).returns(true);
          isEqualStub.withArgs(obj4.d, obj5.d).returns(false);

          comparer = sinon.createStubInstance(Comparer, {
            isEqual: isEqualStub
          });

          let keyFilter = function(key) {
            return !/^\$\$\$/.test(key);
          };

          objectDiffer = new ObjectDiffer(comparer, {
            deep: false,
            maxDepth: 0,
            keyFilter
          });

          diffStub = sinon.stub();
          diffStub
            .withArgs(obj1.a, obj3.a)
            .returns(obj1_and_obj3_expected_diff.a);
          diffStub.withArgs(obj4.d, obj5.d).returns(["d", "e", "g"]);

          context = {
            recursionDepth: 5,
            diff: diffStub
          };
        });

        it("Should throw error if diffing depth is greater than maxDepth", function() {
          let objectDiffCaller = function() {
            let context = {
              recursionDepth: 1,
              diff: diffStub
            };
            objectDiffer.diff(obj1, obj3, context);
          };

          expect(objectDiffCaller).to.throw(Error);
        });

        it("Should throw error if maxDepth is undefined", function() {
          let objectDifferCreator = function() {
            new ObjectDiffer(comparer, {
              maxDepth: undefined,
              deep: false
            });
          };

          expect(objectDifferCreator).to.throw(Error);
        });

        it("Should throw error if maxDepth is not zero or a positive integer", function() {
          let objectDifferCreator = function() {
            new ObjectDiffer(comparer, {
              maxDepth: "some string",
              deep: false
            });
          };

          let objectDifferCreator2 = function() {
            new ObjectDiffer(comparer, {
              maxDepth: "4",
              deep: false
            });
          };

          expect(objectDifferCreator).to.throw(Error);
          expect(objectDifferCreator2).to.throw(Error);
        });

        it("Should not call diff again if diffing depth is equal to maxDepth", function() {
          diffStub.resetHistory();

          let objectDiffer = new ObjectDiffer(comparer, {
            deep: false,
            maxDepth: 1,
            includeEmptyObjects: true
          });
          let context = {
            recursionDepth: 1,
            diff: diffStub
          };

          objectDiffer.diff(obj1, obj3, context);

          expect(diffStub.called).to.be.false;
        });

        it("Should not include the field if field has not changed and includeEmptyObjects is false", function() {
          let objectDiffer = new ObjectDiffer(comparer, {
            deep: false,
            maxDepth: 1,
            includeEmptyObjects: false
          });

          let context = {
            recursionDepth: 0,
            diff: diffStub
          };

          expect(objectDiffer.diff(obj1, obj3, context)).to.not.have.property(
            "b"
          );
        });

        it("Should include the field with empty object value if the field has been changed and includeEmptyObjects is true", function() {
          let objectDiffer = new ObjectDiffer(comparer, {
            deep: false,
            maxDepth: 1,
            includeEmptyObjects: true
          });

          let context = {
            recursionDepth: 0,
            diff: diffStub
          };

          expect(objectDiffer.diff(obj1, obj3, context))
            .to.have.property("b")
            .that.deep.equal({});
        });

        it("Should increase depth if it calls diff function again", function() {
          diffStub.resetHistory();

          let objectDiffer = new ObjectDiffer(comparer, {
            deep: false,
            maxDepth: 5,
            includeEmptyObjects: false
          });

          let context = {
            recursionDepth: 2,
            diff: diffStub
          };

          objectDiffer.diff(obj1, obj3, context);

          expect(diffStub.called).to.be.true;
          expect(diffStub.getCall(0).args[2].recursionDepth).to.equal(3);
        });
      });
    });
  });
});
