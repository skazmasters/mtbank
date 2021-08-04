class CodeInput extends Widget {
  constructor(node) {
    super(node, '.js-code-input');

    this.$inputs = this.queryElements('input');

    this.init();
  }

  build() {
    this.$inputs.forEach(($node, index) => {
      $node.addEventListener('input', this.createInputHandler(index));
    });
  }

  createInputHandler(index) {
    return e => {
    }
  }

  static init(el) {
    el && new CodeInput(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-code-input').forEach($node => CodeInput.init($node));
});
