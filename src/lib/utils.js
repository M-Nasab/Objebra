export function isFunction(func) {
  return func && typeof func === "function";
}

export function isSet(value) {
  return value !== null && value !== undefined;
}

export function isObject(value) {
  return value && typeof value === "object";
}

export function isArray(object) {
  return object && Array.isArray(object);
}

export function isPlainObject(object) {
  return Object.getPrototypeOf(object) === Object.getPrototypeOf({});
}
