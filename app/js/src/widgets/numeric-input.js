class NumericInput {
  constructor(node, noDecimal) {
    this.$node = node;

    if (typeof setInputFilter === 'undefined') {
      throw new Error('Please, include input-filter.js');
    }

    setInputFilter(this.$node, value => {
      return noDecimal ? /^\d*$/.test(value) : /^\d*[\.,]?\d*$/.test(value);
    });
  }

  static init(el, noDecimal) {
    new NumericInput(el, noDecimal);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-numeric-input').forEach(item => NumericInput.init(item));
});

window.NumericInput = NumericInput;
