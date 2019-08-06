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
  constructor(config) {
    let deep = true;
    let maxDepth = 0;
    let keyFilter = undefined;
    let exclude = [];
    let includeEmptyObjects = false;

    if (config) {
      deep = config.deep ? true : false;

      maxDepth = config.maxDepth;

      keyFilter = config.keyFilter;

      exclude = config.exclude;

      includeEmptyObjects = config.includeEmptyObjects ? true : false;
    }

    let objectComparerConfig = {
      deep,
      maxDepth,
      keyFilter,
      exclude
    };

    let objectDifferConfig = {
      deep,
      maxDepth,
      keyFilter,
      exclude,
      includeEmptyObjects
    };

    let objectMergerConfig = {
      deep,
      maxDepth,
      keyFilter,
      exclude,
      mergeDefaults: false
    };

    let defaultsMergerConfig = {
      deep,
      maxDepth,
      keyFilter,
      exclude,
      mergeDefaults: true
    };

    let objectClonerConfig = {
      deep,
      maxDepth,
      keyFilter,
      exclude
    };

    this.comparer = new Comparer({
      strategies: [
        new ArrayComparer(),
        new ObjectComperer(objectComparerConfig)
      ]
    });

    this.differ = new Differ({
      strategies: [
        new ArrayDiffer(this.comparer),
        new ObjectDiffer(this.comparer, objectDifferConfig)
      ]
    });

    this.merger = new Merger({
      strategies: [new ArrayMerger(), new ObjectMerger(objectMergerConfig)]
    });

    this.defaultsMerger = new Merger({
      strategies: [new ArrayMerger(), new ObjectMerger(defaultsMergerConfig)]
    });

    this.cloner = new Cloner({
      strategies: [new ArrayCloner(), new ObjectCloner(objectClonerConfig)]
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
