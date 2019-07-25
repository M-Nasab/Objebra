export class Merger {
  constructor(options = {}) {
    this.merge = this.merge.bind(this);
    this.findFirstMatchAndMerge = this.findFirstMatchAndMerge.bind(this);

    this.strategies = options.strategies || [];
  }

  findFirstMatchAndMerge(first, second, context = {}) {
    let result;

    let mergingContext = {
      recursionDepth: context.recursionDepth || 0,
      merge: this.findFirstMatchAndMerge
    };

    for (let i = 0; i < this.strategies.length; i++) {
      let match = this.strategies[i].match(first, second);
      if (match) {
        let matchedStrategy = this.strategies[i];

        result = matchedStrategy.merge(first, second, mergingContext);

        break;
      }
    }

    return result;
  }

  // apply changes to target
  merge(target, changes) {
    let result = this.findFirstMatchAndMerge(target, changes);
    return result;
  }
}
