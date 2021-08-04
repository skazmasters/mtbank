class InputName {
  constructor(node) {
    this.$node = node;

    this.onInput = this.onInput.bind(this);

    this.events();
  }

  events() {
    this.$node.addEventListener('input', this.onInput);
  }

  onInput(e) {
    const value = e.target.value;
    let newValue = '';

    let startOfWord = true;
    for (let i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) === 32) {
        newValue = newValue + value[i];
        startOfWord = true;
      } else if (startOfWord) {
        newValue = newValue + value[i].toString().toUpperCase();
        startOfWord = false;
      } else {
        newValue = newValue + value[i];
      }
    }

    this.$node.value = newValue;
  }

  static init(el, noDecimal) {
    new InputName(el, noDecimal);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-input-name').forEach(item => InputName.init(item));
});

window.NumericInput = InputName;
