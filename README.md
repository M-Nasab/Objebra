# Objebra
A flexible and configurable library to perform operations such as diff, merge, clone, etc on JavaScript objects

## Install

Install from the NPM repository using yarn or npm:

```shell
npm install --save objebra
```

## Usage

```js
import Objebra from 'objebra';

// Create Objebra instance
const objebra = new Objebra();

const a = {
  a: "A",
  b: "B",
  c: "C"
};

const b = {
  a: "A",
  b: "B",
  c: "C"
};


const c = {
  a: "A",
  b: "B",
  d: "D"
};

const defaults = {
  a: "AA",
  b: "BB",
  c: "CC",
  d: "DD",
  e: "EE"
};

// Compare objects

objebra.isEqual(a, b); // true
objebra.isEqual(a, c); // false

// Clone object

objebra.clone(a); // { a: "a", b: "b", c: "c" }

// Diff objects

objebra.diff(a, b); // {}
objebra.diff(a, c); // { c: undefined, d: "D" }

// Merge objects

objebra.merge(a, c); // { a: "A", b: "B", c: "C", D: "D" }

// Apply defaults

objebra.mergeDefaults(a, defaults); // { a: "A", b: "B", c: "C", d: "DD", e: "EE" }

```

## Dependencies

None.
