import { isObject, isArray, isSet, isFunction } from "../../lib/utils";
import { Comparer } from "../../comparer";

export class ObjectDiffer {
  constructor(comparer, options = {}) {
    if (!comparer) {
      throw new Error("Comparer must be provided");
    }
    if (!(comparer instanceof Comparer)) {
      throw new Error("comparer must an instance of the Comparer class");
    }

    if (
      options &&
      options.deep === false &&
      options.hasOwnProperty("maxDepth")
    ) {
      if (options.maxDepth === undefined) {
        throw new Error("maxDepth cannot be undefined if deep is false");
      }

      if (typeof options.maxDepth !== "number" || options.maxDepth < 0) {
        throw new Error("maxDepth must be a zero or positive integer");
      }
    }

    const defaultOptions = {
      deep: true,
      maxDepth: 0,
      keyFilter: undefined,
      includeEmptyObjects: false,
      exclude: []
    };

    this.options = { ...defaultOptions, ...options };

    this.comparer = comparer;

    this.isValidObject = this.isValidObject.bind(this);
    this.match = this.match.bind(this);
    this.diff = this.diff.bind(this);
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

  match(original, modified) {
    return this.isValidObject(original) && this.isValidObject(modified);
  }

  diff(original, modified, context) {
    let { deep, maxDepth, includeEmptyObjects, keyFilter } = this.options;

    if (!context) {
      throw new Error("Diffing Context must be provided");
    }
    if (!context.diff) {
      throw new Error("Context must have a diff function");
    }
    if (!isFunction(context.diff)) {
      throw new Error("Context diff must be a function");
    }
    if (!deep && context.recursionDepth > maxDepth) {
      throw new Error("Recursion depth cannot be greate than maxDepth");
    }

    let instance = this;

    let depth = (context && context.recursionDepth) || 0;

    let objectsDiff = {};

    if (original !== modified) {
      let originalKeys = Object.keys(original);
      let modifiedKeys = Object.keys(modified);

      let allKeys = [...originalKeys];
      modifiedKeys.forEach(function(modifiedKey) {
        let index = originalKeys.indexOf(modifiedKey);
        if (index == -1) {
          allKeys.push(modifiedKey);
        }
      });

      if (isFunction(keyFilter)) {
        allKeys = allKeys.filter(function(key) {
          return keyFilter(key);
        });
      }

      allKeys.forEach(function(key) {
        let originalValue = original[key];
        let modifiedValue = modified[key];

        const conditions = {
          NotBothNull: isSet(originalValue) || isSet(modifiedValue),
          OneIsNull: isSet(originalValue) !== isSet(modifiedValue),
          NotObjectAndNotEqual:
            !isObject(originalValue) &&
            !isObject(modifiedValue) &&
            originalValue !== modifiedValue,
          NotBothObject: isObject(originalValue) !== isObject(modifiedValue),
          BothObject: isObject(originalValue) && isObject(modifiedValue)
        };

        if (
          (conditions.NotBothNull &&
            (conditions.OneIsNull ||
              conditions.NotObjectAndNotEqual ||
              conditions.NotBothObject)) ||
          original.hasOwnProperty(key) !== modified.hasOwnProperty(key)
        ) {
          objectsDiff[key] = modifiedValue;
        } else if (conditions.BothObject) {
          let isEqual = instance.comparer.isEqual(originalValue, modifiedValue);
          if (!isEqual && (deep || depth < maxDepth)) {
            let valuesDiff = context.diff(originalValue, modifiedValue, {
              ...context,
              recursionDepth: depth + 1
            });
            objectsDiff[key] = valuesDiff;
          } else if (!isEqual) {
            objectsDiff[key] = modifiedValue;
          } else if (isEqual && includeEmptyObjects) {
            objectsDiff[key] = {};
          }
        }
      });
    }

    return objectsDiff;
  }
}
