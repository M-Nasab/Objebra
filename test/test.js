var expect = require("chai").expect;
import { ObjectStrategy } from "../src/strategies/objectStrategy";

/* eslint-disable no-undef */

describe("ObjectStrategy", function() {
  describe("match", function() {
    it("Should be false if type of object is Date", function() {
      let object_strategy = new ObjectStrategy();
      expect(object_strategy.match(new Date())).to.be.false;
    });

    it("Should be true if type of object is object", function() {
      let object_strategy = new ObjectStrategy();
      expect(object_strategy.match({})).to.be.true;
    });

    it("Should be false if type of object is number", function() {
      let object_strategy = new ObjectStrategy();
      expect(object_strategy.match(6)).to.be.false;
    });
  });
});
