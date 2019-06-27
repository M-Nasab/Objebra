export class Comparer {
  constructor(options = {}) {
    this.isEqual = this.isEqual.bind(this);
    this.findFirstMatchAndCompare = this.findFirstMatchAndCompare.bind(this);

    this.strategies = options.strategies || [];
  }

  findFirstMatchAndCompare(second, first, context = {}) {
    let result = false;

    let comparisonContext = {
      recursionDepth: context.recursionDepth || 0,
      isEqual: this.findFirstMatchAndCompare
    };

    for (let i = 0; i < this.strategies.length; i++) {
      let match = this.strategies[i].match(first, second);
      if (match) {
        let matchedStrategy = this.strategies[i];

        result = matchedStrategy.isEqual(first, second, comparisonContext);

        break;
      }
    }

    return result;
  }

  isEqual(first, second) {
    return this.findFirstMatchAndCompare(first, second);
  }
}
