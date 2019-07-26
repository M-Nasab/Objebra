import { isObject, isArray, isFunction } from "../../lib/utils";

export class ObjectCloner {
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
    this.clone = this.clone.bind(this);
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

  match(object) {
    return this.isValidObject(object);
  }

  clone(object, context) {
    let { deep, maxDepth, keyFilter } = this.options;

    if (!context) {
      throw new Error("Cloning Context must be provided");
    }
    if (!context.clone) {
      throw new Error("Context must have a clone function");
    }
    if (!isFunction(context.clone)) {
      throw new Error("Context clone must be a function");
    }
    if (!deep && context.recursionDepth > maxDepth) {
      throw new Error("Recursion depth cannot be greate than maxDepth");
    }

    let depth = (context && context.recursionDepth) || 0;

    let clonedObject = {};

    let objectKeys = Object.keys(object);

    if (isFunction(keyFilter)) {
      objectKeys = objectKeys.filter(function(key) {
        return keyFilter(key);
      });
    }

    objectKeys.forEach(function(key) {
      let objectValue = object[key];

      if (!isObject(objectValue)) {
        clonedObject[key] = objectValue;
      } else {
        if (deep || depth < maxDepth) {
          let clonedValue = context.clone(objectValue, {
            ...context,
            recursionDepth: depth + 1
          });

          clonedObject[key] = clonedValue;
        }
      }
    });

    return clonedObject;
  }
}
