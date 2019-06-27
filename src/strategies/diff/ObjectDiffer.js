import { isObject, isArray, isSet, isFunction } from "../../lib/utils";

export class ObjectDiffer {
  constructor(comparer, options = {}) {
    const defaultOptions = {
      deep: true,
      maxDepth: undefined,
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

    let depth = (context && context.recursionDepth) || 0;

    let objectsDiff = {};
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
      let originalValue = origin[key];
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
        conditions.NotBothNull &&
        (conditions.OneIsNull ||
          conditions.NotObjectAndNotEqual ||
          conditions.NotBothObject)
      ) {
        objectsDiff[key] = modified;
      } else if (conditions.BothObject) {
        let isEqual = this.comparer.isEqual(originalValue, modifiedValue);
        if (
          (!isEqual && (deep || !maxDepth || depth < maxDepth)) ||
          (isEqual && includeEmptyObjects)
        ) {
          let valuesDiff = context.diff(originalValue, modifiedValue, {
            ...context,
            recursionDepth: depth + 1
          });
          objectsDiff[key] = valuesDiff;
        } else if (!isEqual) {
          objectsDiff[key] = modifiedValue;
        }
      }
    });

    return objectsDiff;
  }
}
