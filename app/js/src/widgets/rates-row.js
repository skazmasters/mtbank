class RatesRow extends Widget {
  constructor(node) {
    super(node, 'js-rates-row');

    this.$toggleButton = this.queryElement('.toggle');
    this.onToggleClick = this.onToggleClick.bind(this);

    this.init();
  }

  build() {
    this.$toggleButton.addEventListener('click', this.onToggleClick);
  }

  onToggleClick(e) {
    e.preventDefault();

    this.$node.classList.toggle('_conversion-opened');
  }

  static init(el) {
    el && new RatesRow(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-rates-row').forEach(RatesRow.init);
});
