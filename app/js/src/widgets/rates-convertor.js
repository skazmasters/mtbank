class RatesConvertor extends Widget {
  constructor(node) {
    super(node, 'js-rates-convertor', 'desktop');

    this.onScroll = this.onScroll.bind(this);
    this.originalTop = null;

    this.init();
  }

  build() {
    this.originalTop = this.$node.getBoundingClientRect().top + this.$node.getBoundingClientRect().height + getScrollPos();
    onScroll(this.onScroll);
    this.onScroll();
  }

  destroy() {
    offScroll(this.onScroll);
    this.notFixed();
  }

  notFixed() {
    this.$node.classList.remove('fixed');
  }

  fixed() {
    this.$node.classList.add('fixed');
  }

  onScroll() {
    const top = getScrollPos() + window.innerHeight;

    if (top > this.originalTop) {
      this.notFixed();
    } else {
      this.fixed();
    }
  }

  static init(el) {
    el && new RatesConvertor(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-rates-convertor').forEach(RatesConvertor.init);
});
