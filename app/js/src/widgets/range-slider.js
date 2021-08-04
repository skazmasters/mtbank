class RangeSlider extends Widget {
  constructor(node) {
    super(node, 'js-range-slider');

    this.$content = this.queryElement('.content');
    this.$value = this.queryElement('.value');
    this.$input = this.queryElement('.input', false);

    this.step = this.$node.dataset.step ? +this.$node.dataset.step : 1;
    this.min = this.$node.dataset.min ? +this.$node.dataset.min : 0;
    this.max = this.$node.dataset.max ? +this.$node.dataset.max : 100;

    this.currency = this.$node.dataset.currency;

    this.init();
  }


  build() {
    const defaultValue = this.$input ? +this.$input.value : this.min;

    this.initSlider(defaultValue);

    this.setValue(defaultValue);

    this.range.on('update', (values, handle) => {
      this.setValue(values[handle]);
    });
  }

  setValue(value) {
    value = Math.round(value);

    this.$value.textContent = `${value} ${this.currency}`;

    if (this.$input) {
      this.setInputValue(value);
    }
  }

  destroy() {

  }

  initSlider(defaultValue) {
    this.range = noUiSlider.create(this.$content, {
      start: [defaultValue],
      connect: [true, false],
      step: this.step,
      range: {
        min: this.min,
        max: this.max
      },
      format: {
        to: function (value) {
          return value;
        },
        from: function (value) {
          return Number(value.replace(',-', ''));
        }
      }
    });
  }

  setInputValue(value) {
    this.$input.value = value;
    triggerInputChange(this.$input);
  }

  static init(el) {
    new RangeSlider(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-range-slider').forEach(item => RangeSlider.init(item));
});
