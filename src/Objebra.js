import { Differ } from "./differ";
import { ArrayDiffer } from "./strategies/diff/ArrayDiffer";
import { ObjectDiffer } from "./strategies/diff/ObjectDiffer";
import { Comparer } from "./comparer";
import { ArrayComparer } from "./strategies/compare/ArrayComparer";
import { ObjectComperer } from "./strategies/compare/ObjectComparer";
import { ObjectMerger } from "./strategies/merge/ObjectMerger";
import { ArrayMerger } from "./strategies/merge/ArrayMerger";
import { Merger } from "./merger";
import { Cloner } from "./cloner";
import { ArrayCloner } from "./strategies/clone/ArrayCloner";
import { ObjectCloner } from "./strategies/clone/ObjectCloner";

export class Objebra {
  constructor() {
    this.comparer = new Comparer({
      strategies: [new ArrayComparer(), new ObjectComperer()]
    });

    this.differ = new Differ({
      strategies: [
        new ArrayDiffer(this.comparer),
        new ObjectDiffer(this.comparer)
      ]
    });

    this.merger = new Merger({
      strategies: [new ArrayMerger(), new ObjectMerger()]
    });

    this.defaultsMerger = new Merger({
      mergeDefaults: true,
      strategies: [new ArrayMerger(), new ObjectMerger()]
    });

    this.cloner = new Cloner({
      strategies: [new ArrayCloner(), new ObjectCloner()]
    });
  }

  diff(original, modified) {
    return this.differ.diff(original, modified);
  }

  // apply changes to target
  merge(target, changes) {
    return this.merger.merge(target, changes);
  }

  mergeDefaults(options, defaults) {
    return this.defaultsMerger.merge(options, defaults);
  }

  isEqual(first, second) {
    return this.comparer.isEqual(first, second);
  }

  clone(object) {
    return this.cloner.clone(object);
  }
}
