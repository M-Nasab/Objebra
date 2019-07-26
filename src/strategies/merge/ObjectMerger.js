import { isObject, isArray, isFunction } from "../../lib/utils";

export class ObjectMerger {
  constructor(options = {}) {
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
      exclude: []
    };

    this.options = { ...defaultOptions, ...options };

    this.isValidObject = this.isValidObject.bind(this);
    this.match = this.match.bind(this);
    this.merge = this.merge.bind(this);
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

  // apply changes to target
  merge(target, changes, context) {
    let { deep, maxDepth, keyFilter } = this.options;

    if (!context) {
      throw new Error("Merging Context must be provided");
    }
    if (!context.merge) {
      throw new Error("Context must have a merge function");
    }
    if (!isFunction(context.merge)) {
      throw new Error("Context merge must be a function");
    }
    if (!deep && context.recursionDepth > maxDepth) {
      throw new Error("Recursion depth cannot be greate than maxDepth");
    }

    let depth = (context && context.recursionDepth) || 0;

    let mergedObject = { ...target };

    if (isFunction(keyFilter)) {
      Object.keys(mergedObject).forEach(function(key) {
        if (!keyFilter(key)) {
          delete mergedObject[key];
        }
      });
    }

    if (target !== changes) {
      let changedKeys = Object.keys(changes);

      if (isFunction(keyFilter)) {
        changedKeys = changedKeys.filter(function(key) {
          return keyFilter(key);
        });
      }

      changedKeys.forEach(function(key) {
        let targetValue = target[key];
        let changedValue = changes[key];

        const BothObject = isObject(targetValue) && isObject(changedValue);

        if (!BothObject) {
          mergedObject[key] = changedValue;
        } else {
          if (deep || depth < maxDepth) {
            let valuesMerge = context.merge(targetValue, changedValue, {
              ...context,
              recursionDepth: depth + 1
            });
            mergedObject[key] = valuesMerge;
          } else {
            mergedObject[key] = changedValue;
          }
        }
      });
    }

    return mergedObject;
  }
}
