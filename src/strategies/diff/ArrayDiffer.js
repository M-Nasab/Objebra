import { isArray } from "../../lib/utils";
import { Comparer } from "../../comparer";

export class ArrayDiffer {
  constructor(comparer) {
    if (!comparer) {
      throw new Error("Comparer must be provided");
    }
    if (!(comparer instanceof Comparer)) {
      throw new Error("comparer must an instance of the Comparer class");
    }

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
    if (original === modified) {
      return;
    }
    let isEqual = this.comparer.isEqual(original, modified);
    if (isEqual) {
      return;
    } else {
      return modified;
    }
  }
}
