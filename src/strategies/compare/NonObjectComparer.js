import { isObject, isSet } from "../../lib/utils";

export class NonObjectComparer {
  constructor() {
    this.isNonObject = this.isNonObject.bind(this);
    this.match = this.match.bind(this);
    this.isEqual = this.isEqual.bind(this);
  }

  isNonObject(value) {
    return !isObject(value);
  }

  match(first, second) {
    return this.isNonObject(first) || this.isNonObject(second);
  }

  isEqual(first, second) {
    if (!isSet(first) && !isSet(second)) {
      return true;
    }

    if (isSet(first) !== isSet(second)) {
      return false;
    }

    if (first !== second) {
      return false;
    }

    return true;
  }
}
