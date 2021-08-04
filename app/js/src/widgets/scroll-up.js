class ScrollUp extends Widget {
  constructor(node) {
    super(node, '.js-scroll-up');

    this.onScroll = this.onScroll.bind(this);

    this.init();
  }

  onScroll() {
    const top = getScrollPos();

    if (top > (document.body.scrollHeight - window.innerHeight) / 2) {
      this.$node.classList.add('visible');
    } else {
      this.$node.classList.remove('visible');
    }
  }

  build() {
    onScroll(this.onScroll);
    this.onScroll();

    this.$node.addEventListener('click', e => {
      e.preventDefault();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  static init(el) {
    el && new ScrollUp(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-scroll-up').forEach(ScrollUp.init);
});
