import { isArray, isObject, isFunction } from "../../lib/utils";

export class ArrayCloner {
  constructor() {
    this.clone = this.clone.bind(this);
    this.match = this.match.bind(this);
    this.isValidArray = this.isValidArray.bind(this);
  }

  isValidArray(array) {
    return isArray(array);
  }

  match(array) {
    return this.isValidArray(array);
  }

  clone(array, context) {
    let { deep, maxDepth } = this.options;

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

    let clonedArray = [];

    for (let i = 0; i < array.length; i++) {
      let value = array[i];
      if (!isObject(value)) {
        clonedArray.push(value);
      } else {
        let clonedValue = context.clone(value, {
          ...context
        });
        clonedArray.push(clonedValue);
      }
    }

    return clonedArray;
  }
}
