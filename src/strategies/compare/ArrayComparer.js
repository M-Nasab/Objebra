import { isArray } from "../../lib/utils";

export class ArrayComparer {
  constructor() {
    this.isValidArray = this.isValidArray.bind(this);
    this.match = this.match.bind(this);
    this.isEqual = this.isEqual.bind(this);
  }

  isValidArray(array) {
    return isArray(array);
  }

  match(first, second) {
    return this.isValidArray(first) && this.isValidArray(second);
  }

  isEqual(first, second, context) {
    if (first === second) {
      return true;
    }

    if (first.length !== second.length) {
      return false;
    }

    let depth = (context && context.recursionDepth) || 0;

    for (let i = 0; i < first.length; i++) {
      let comparisonResult = context.isEqual(first[i], second[i], {
        ...context,
        recursionDepth: depth
      });

      if (!comparisonResult) {
        return false;
      }
    }

    return true;
  }
}
