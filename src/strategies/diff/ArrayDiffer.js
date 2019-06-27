import { isArray } from "../../lib/utils";

export class ArrayDiffer {
  constructor(comparer) {
    this.diff = this.diff.bind(this);
    this.match = this.match.bind(this);
    this.isValidArray = this.isValidArray.bind(this);

    this.comparer = comparer;
  }

  isValidArray(array) {
    return isArray(array);
  }

  match(original, modified) {
    return this.isValidArray(original) && this.isValidArray(modified);
  }

  diff(original, modified) {
    let isEqual = this.comparer.isEqual(original, modified);
    if (!isEqual) {
      return modified;
    } else {
      return null;
    }
  }
}
