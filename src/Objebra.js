import { Differ } from "./differ";
import { ArrayDiffer } from "./strategies/diff/ArrayDiffer";
import { ObjectDiffer } from "./strategies/diff/ObjectDiffer";
import { NonObjectComparer } from "./strategies/compare/NonObjectComparer";
import { Comparer } from "./comparer";
import { ArrayComparer } from "./strategies/compare/ArrayComparer";
import { ObjectComperer } from "./strategies/compare/ObjectComparer";

export class Objebra {
  constructor() {
    this.comparer = new Comparer({
      strategies: [
        new ArrayComparer(),
        new ObjectComperer(),
        new NonObjectComparer()
      ]
    });
    this.differ = new Differ({
      strategies: [
        new ArrayDiffer(this.comparer),
        new ObjectDiffer(this.comparer)
      ]
    });
  }

  diff(original, modified) {
    return this.differ.diff(original, modified);
  }

  isEqual(first, second) {
    return this.comparer.isEqual(first, second);
  }
}
