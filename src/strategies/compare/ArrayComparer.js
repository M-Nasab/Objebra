import { isArray, isFunction, isSet, isObject } from "../../lib/utils";

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
    if (!context) {
      throw new Error("Comparison Context must be provided");
    }
    if (!context.isEqual) {
      throw new Error("Context must have a isEqual function");
    }
    if (!isFunction(context.isEqual)) {
      throw new Error("Context isEqual must be a function");
    }

    if (first === second) {
      return true;
    }

    if (first.length !== second.length) {
      return false;
    }

    let depth = (context && context.recursionDepth) || 0;

    for (let i = 0; i < first.length; i++) {
      let firstValue = first[i];
      let secondValue = second[i];

      const conditions = {
        NotBothNull: isSet(firstValue) || isSet(secondValue),
        OneIsNull: isSet(firstValue) !== isSet(secondValue),
        NotObjectAndNotEqual:
          !isObject(firstValue) &&
          !isObject(secondValue) &&
          firstValue !== secondValue,
        NotBothObject: isObject(firstValue) !== isObject(secondValue),
        BothObject: isObject(firstValue) && isObject(secondValue)
      };

      if (
        conditions.NotBothNull &&
        (conditions.OneIsNull ||
          conditions.NotObjectAndNotEqual ||
          conditions.NotBothObject)
      ) {
        return false;
      } else if (conditions.BothObject) {
        let comparisonResult = context.isEqual(first[i], second[i], {
          ...context,
          recursionDepth: depth
        });

        if (!comparisonResult) {
          return false;
        }
      }
    }

    return true;
  }
}
