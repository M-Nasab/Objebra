import { isArray } from "../../lib/utils";

export class ArrayMerger {
  constructor() {
    this.merge = this.merge.bind(this);
    this.match = this.match.bind(this);
    this.isValidArray = this.isValidArray.bind(this);
  }

  isValidArray(array) {
    return isArray(array);
  }

  match(target, changes) {
    return this.isValidArray(target) && this.isValidArray(changes);
  }

  merge(target, changes) {
    return [...changes];
  }
}
