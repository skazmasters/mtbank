class InputMoney extends Widget {
  constructor(node) {
    super(node, '.js-input-money');

    this.$range = this.queryElement('.range');
    this.$input = this.queryElement('input');

    this.onInput = this.onInput.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);

    this.range = null;
    this.blocked = false;

    this.min = parseInt(this.$node.dataset.min) || 0;
    this.max = parseInt(this.$node.dataset.max) || 10000;
    this.step = parseInt(this.$node.dataset.step) || 10;

    this.value = this.$input.value ? parseInt(this.$input.value) : 0;
    this.first = true;

    this.init();
  }

  build() {
    NumericInput.init(this.$input, true);

    this.range = noUiSlider.create(this.$range, {
      start: [this.value],
      connect: [true, false],
      step: this.step,
      range: {
        'min': this.min,
        'max': this.max
      }
    });

    this.range.on('update', e => {
      if (this.blocked) {
        this.blocked = false;
        return;
      }

      if (this.first) {
        this.first = false;
      } else {
        this.$input.value = parseInt(e[0]);
        triggerInputChange(this.$input);
      }
    });

    this.$input.addEventListener('input', this.onInput);

    this.$input.addEventListener('blur', this.onBlur);

    this.$input.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e) {
    if (e.keyCode === 190) {
      e.preventDefault();
    }
  }

  onBlur(e) {
    const value = e.target.value;
    const shortage = e.target.value % this.step;

    if (shortage > 0) {
      let newValue = null;

      const half = this.step / 2;
      if (shortage < half) {
        newValue = value - shortage;
      } else {
        newValue = value - shortage + this.step;
      }

      if (this.max) {
        newValue = Math.min(this.max, newValue);
      }

      this.$input.value = newValue;
      this.range.set([newValue]);
      triggerInputChange(this.$input);
    }
  }

  onInput(e) {
    const value = e.target.value - (e.target.value % this.step);
    this.blocked = true;
    this.range.set([value]);
    triggerInputChange(this.$input);
  }

  static init(el) {
    el && new InputMoney(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-input-money').forEach(InputMoney.init);
});
