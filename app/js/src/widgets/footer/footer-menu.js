class FooterMenu extends Widget {
  constructor(node) {
    super(node, 'js-footer-menu', 'mobile');

    this.$toggle = this.queryElement('.toggle');
    this.$body = this.queryElement('.body');

    this.init();
  }

  build() {
    Accord.init(this.$node, {
      toggleElement: this.$toggle,
      bodyElement: this.$body,
      disableScroll: true
    });
  }

  destroy() {
    Accord.destroy(this.$node);
  }

  static init(el) {
    return new FooterMenu(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-footer-menu').forEach(item => FooterMenu.init(item));
});
