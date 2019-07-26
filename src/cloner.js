export class Cloner {
  constructor(options = {}) {
    this.clone = this.clone.bind(this);
    this.findFirstMatchAndClone = this.findFirstMatchAndClone.bind(this);

    this.strategies = options.strategies || [];
  }

  findFirstMatchAndClone(object, context = {}) {
    let result;

    let cloningContext = {
      recursionDepth: context.recursionDepth || 0,
      clone: this.findFirstMatchAndClone
    };

    for (let i = 0; i < this.strategies.length; i++) {
      let match = this.strategies[i].match(object);
      if (match) {
        let matchedStrategy = this.strategies[i];

        result = matchedStrategy.clone(object, cloningContext);

        break;
      }
    }

    return result;
  }

  clone(object) {
    let result = this.findFirstMatchAndClone(object);
    return result;
  }
}
