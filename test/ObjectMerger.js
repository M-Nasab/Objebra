var expect = require("chai").expect;
var sinon = require("sinon");

import { ObjectMerger } from "../src/strategies/merge/ObjectMerger";

/* eslint-disable no-undef */

describe("ObjectMerger", function() {
  describe("constructor", function() {
    it("Should Create an instance of ObjectMerger", function() {
      let objectMerger = new ObjectMerger();

      expect(objectMerger).to.be.instanceOf(ObjectMerger);
    });
  });

  describe("isValidObject", function() {
    let arr, obj, objectMerger;

    before(function() {
      arr = ["A", "B", "C"];
      obj = { a: "A", b: "B", c: "C" };

      objectMerger = new ObjectMerger();
    });

    it("Should be false if one of its arguments is array", function() {
      expect(objectMerger.isValidObject(arr)).to.be.false;
    });

    it("Should be false if one of its arguments is not object", function() {
      expect(objectMerger.isValidObject("M")).to.be.false;
    });

    it("Should be false if its argument's type is in the 'exclude' list", function() {
      let objectMergerOptions = {
        exclude: [Date, String]
      };
      let objectMerger = new ObjectMerger(objectMergerOptions);

      expect(objectMerger.isValidObject(new Date())).to.be.false;
      expect(objectMerger.isValidObject(new String("Mostafa"))).to.be.false;
    });

    it("Should be true if its arguments is object", function() {
      expect(objectMerger.isValidObject(obj)).to.be.true;
    });
  });

  describe("match", function() {
    let arr, obj1, obj2, objectMerger;

    before(function() {
      arr = ["A", "B", "C"];
      obj1 = { a: "A", b: "B", c: "C" };
      obj2 = { d: "D", e: "E", f: "F" };

      objectMerger = new ObjectMerger();
    });

    it("Should return false if one of its arguments is not object", function() {
      expect(objectMerger.match("Mostafa", obj1)).to.be.false;
      expect(objectMerger.match("Mostafa", arr)).to.be.false;
      expect(objectMerger.match(obj1, arr)).to.be.false;
      expect(objectMerger.match("Mostafa", arr)).to.be.false;
    });

    it("Should return true if both of its arguments are object", function() {
      expect(objectMerger.match(obj1, obj2)).to.be.true;
    });
  });

  describe("merge", function() {
    let objectMerger;

    before(function() {
      objectMerger = new ObjectMerger();
    });

    describe("merge general behaviour", function() {
      it("Should throw error if merging context is not provided", function() {
        let objectMergerCaller = function() {
          let obj1 = { a: "A", b: "B", c: "C" };
          let obj2 = { d: "D", e: "E", f: "F" };
          objectMerger.merge(obj1, obj2);
        };

        expect(objectMergerCaller).to.throw(Error);
      });

      it("Should throw error if merging context has no merge function", function() {
        let objectMergerCaller = function() {
          let obj1 = { a: "A", b: "B", c: "C" };
          let obj2 = { d: "D", e: "E", f: "F" };
          let context = {
            recursionDepth: 2
          };

          objectMerger.merge(obj1, obj2, context);
        };

        expect(objectMergerCaller).to.throw(Error);
      });

      it("Should throw error if context merge is not a function", function() {
        let objectMergerCaller = function() {
          let obj1 = { a: "A", b: "B", c: "C" };
          let obj2 = { d: "D", e: "E", f: "F" };
          let context = {
            merge: "Some String",
            recursionDepth: 2
          };

          objectMerger.merge(obj1, obj2, context);
        };

        expect(objectMergerCaller).to.throw(Error);
      });
    });

    describe("merge objects with non-object properties", function() {
      let obj1, obj2, context;

      before(function() {
        obj1 = { a: "A", b: "B", c: "C", d: "D", e: undefined, f: "F" };
        obj2 = { a: "Aprime", b: "B", c: "Cprime", d: "D", e: null, g: "G" };

        context = {
          merge: sinon.stub(),
          recursionDepth: 1
        };
      });

      it("Should return target object if changed object is empty", function() {
        expect(objectMerger.merge(obj1, {}, context)).to.deep.equal(obj1);
      });

      it("Should mege two objects correctly", function() {
        expect(objectMerger.merge(obj1, obj2, context)).to.deep.equal({
          a: "Aprime",
          b: "B",
          c: "Cprime",
          d: "D",
          e: null,
          f: "F",
          g: "G"
        });
      });

      it("Should return the changed object if an empty object (which is '{}') is merged with changes object", function() {
        expect(objectMerger.merge({}, obj1, context)).to.deep.equal(obj1);
      });
    });

    describe("diff objects with object properties", function() {
      describe("when deep is true", function() {
        let objectMerger, context, mergeStub;
        let obj1_and_obj3_expected_merge;
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

          obj1_and_obj3_expected_merge = {
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
            c: {
              ca: "CA",
              cb: "CB",
              cc: "CC"
            },
            d: {
              da: "DA",
              db: "DB",
              dc: "DC"
            }
          };

          let keyFilter = function(key) {
            return !/^\$\$\$/.test(key);
          };

          objectMerger = new ObjectMerger({
            deep: true,
            maxDepth: 4,
            keyFilter
          });

          mergeStub = sinon.stub();

          mergeStub
            .withArgs(obj1.a, obj3.a)
            .returns(obj1_and_obj3_expected_merge.a);

          mergeStub
            .withArgs(obj1.b, obj3.b)
            .returns(obj1_and_obj3_expected_merge.b);

          mergeStub
            .withArgs(obj1.c, obj3.c)
            .returns(obj1_and_obj3_expected_merge.c);

          mergeStub.withArgs(obj1.a, obj2.a).returns(obj2.a);

          mergeStub.withArgs(obj1.b, obj2.b).returns(obj2.b);

          mergeStub.withArgs(obj1.c, obj2.c).returns(obj2.c);

          mergeStub.withArgs(obj4.a, obj5.a).returns(["a", "b", "c"]);
          mergeStub.withArgs(obj4.d, obj5.d).returns(["d", "e", "g"]);

          context = {
            recursionDepth: 5,
            merge: mergeStub
          };
        });

        it("Should return the target object if an object with object values is merged with an empty object", function() {
          expect(objectMerger.merge(obj1, {}, context)).to.deep.equal(obj1);
        });

        it("Should merge two objects correctly", function() {
          expect(objectMerger.merge(obj1, obj2, context)).to.deep.equal(obj2);

          expect(objectMerger.merge(obj1, obj3, context)).to.deep.equal(
            obj1_and_obj3_expected_merge
          );
        });

        it("Should return the changes object if an empty object (which is '{}') is merged with changes", function() {
          expect(objectMerger.merge({}, obj1, context)).to.deep.equal(obj1);
        });

        it("Should handle array fields", function() {
          expect(objectMerger.merge(obj4, obj5, context)).to.have.property("a");

          expect(objectMerger.merge(obj4, obj5, context)).to.have.property("d");

          expect(objectMerger.merge(obj4, obj5, context).a).to.deep.equal(
            obj5.a
          );

          expect(objectMerger.merge(obj4, obj5, context).d).to.deep.equal(
            obj5.d
          );
        });

        it("Should ignore filtered keys", function() {
          expect(
            objectMerger.merge(
              objectWithFilteredKeys1,
              objectWithFilteredKeys2,
              context
            )
          ).to.not.have.property("$$$hash");
          expect(
            objectMerger.merge(
              objectWithFilteredKeys1,
              objectWithFilteredKeys2,
              context
            )
          ).to.not.have.property("$$$hash2");
        });
      });

      describe("When deep is false", function() {
        let objectMerger, mergeStub;
        let obj1_and_obj3_expected_merge;
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

          obj1_and_obj3_expected_merge = {
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
            c: {
              ca: "CA",
              cb: "CB",
              cc: "CC"
            },
            d: {
              da: "DA",
              db: "DB",
              dc: "DC"
            }
          };

          let keyFilter = function(key) {
            return !/^\$\$\$/.test(key);
          };

          objectMerger = new ObjectMerger({
            deep: false,
            maxDepth: 0,
            keyFilter
          });

          mergeStub = sinon.stub();

          mergeStub
            .withArgs(obj1.a, obj3.a)
            .returns(obj1_and_obj3_expected_merge.a);

          mergeStub
            .withArgs(obj1.b, obj3.b)
            .returns(obj1_and_obj3_expected_merge.b);

          mergeStub.withArgs(obj4.a, obj5.a).returns(["a", "b", "c"]);
          mergeStub.withArgs(obj4.d, obj5.d).returns(["d", "e", "g"]);

          context = {
            recursionDepth: 5,
            merge: mergeStub
          };
        });

        it("Should throw error if diffing depth is greater than maxDepth", function() {
          let objectMergeCaller = function() {
            let context = {
              recursionDepth: 1,
              merge: mergeStub
            };
            objectMerger.merge(obj1, obj3, context);
          };

          expect(objectMergeCaller).to.throw(Error);
        });

        it("Should throw error if maxDepth is undefined", function() {
          let objectMergerCreator = function() {
            new ObjectMerger({
              maxDepth: undefined,
              deep: false
            });
          };

          expect(objectMergerCreator).to.throw(Error);
        });

        it("Should throw error if maxDepth is not zero or a positive integer", function() {
          let objectMergerCreator = function() {
            new ObjectMerger({
              maxDepth: "some string",
              deep: false
            });
          };

          let objectMergerCreator2 = function() {
            new ObjectMerger({
              maxDepth: "4",
              deep: false
            });
          };

          expect(objectMergerCreator).to.throw(Error);
          expect(objectMergerCreator2).to.throw(Error);
        });

        it("Should not call merge again if merging depth is equal to maxDepth", function() {
          mergeStub.resetHistory();
          let objectMerger = new ObjectMerger({
            deep: false,
            maxDepth: 1
          });

          let context = {
            recursionDepth: 1,
            merge: mergeStub
          };

          objectMerger.merge(obj1, obj3, context);

          expect(mergeStub.called).to.be.false;
        });

        it("Should increase depth if it calls merge function again", function() {
          mergeStub.resetHistory();
          let objectMerger = new ObjectMerger({
            deep: false,
            maxDepth: 5
          });

          let context = {
            recursionDepth: 2,
            merge: mergeStub
          };

          objectMerger.merge(obj1, obj3, context);

          expect(mergeStub.called).to.be.true;

          expect(mergeStub.getCall(0).args[2].recursionDepth).to.equal(3);
        });
      });
    });
  });
});
