import { isObject, isArray, isSet, isFunction } from "../../lib/utils";

export class ObjectComperer {
  constructor(options = {}) {
    const defaultOptions = {
      deep: true,
      maxDepth: 0,
      keyFilter: undefined,
      exclude: []
    };

    this.options = { ...defaultOptions, ...options };

    this.isValidObject = this.isValidObject.bind(this);
    this.match = this.match.bind(this);
    this.isEqual = this.isEqual.bind(this);
  }

  isValidObject(object) {
    if (!isObject(object) || isArray(object)) {
      return false;
    }

    let exclude = this.options.exclude;

    if (exclude) {
      for (let i = 0; i < exclude.length; i++) {
        if (object instanceof exclude[i]) {
          return false;
        }
      }
    }

    return true;
  }

  match(first, second) {
    return this.isValidObject(first) && this.isValidObject(second);
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

    let { deep, maxDepth, keyFilter } = this.options;

    let depth = (context && context.recursionDepth) || 0;

    let firstKeys = Object.keys(first);
    let secondKeys = Object.keys(second);

    if (first === second) {
      return true;
    }

    if (isFunction(keyFilter)) {
      firstKeys = firstKeys.filter(function(key) {
        return keyFilter(key);
      });

      secondKeys = secondKeys.filter(function(key) {
        return keyFilter(key);
      });
    }

    if (firstKeys.length !== secondKeys.length) {
      return false;
    }

    for (let i = 0; i < firstKeys.length; i++) {
      let key = firstKeys[i];

      if (!secondKeys.includes(key)) {
        return false;
      }

      let firstValue = first[key];
      let secondValue = second[key];

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
        if (deep || !maxDepth || depth < maxDepth) {
          let comparisonResult = context.isEqual(firstValue, secondValue, {
            ...context,
            recursionDepth: depth + 1
          });

          if (!comparisonResult) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
