export class Differ {
  constructor(options = {}) {
    this.diff = this.diff.bind(this);
    this.findFirstMatchAndDiff = this.findFirstMatchAndDiff.bind(this);

    this.strategies = options.strategies || [];
  }

  findFirstMatchAndDiff(original, modified, context = {}) {
    let result;

    let diffingContext = {
      recursionDepth: context.recursionDepth || 0,
      diff: this.findFirstMatchAndDiff
    };

    for (let i = 0; i < this.strategies.length; i++) {
      let match = this.strategies[i].match(original, modified);
      if (match) {
        let matchedStrategy = this.strategies[i];

        result = matchedStrategy.diff(original, modified, diffingContext);

        break;
      }
    }

    return result;
  }

  diff(original, modified) {
    let result = this.findFirstMatchAndDiff(original, modified);
    return result;
  }
}
