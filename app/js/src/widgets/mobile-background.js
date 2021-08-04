class MobileBackground extends Widget {
  constructor(node) {
    super(node, 'js-mobile-background');

    this.originalBackground = this.$node.style.background;
    this.mobileBackground = this.$node.dataset.mobileBackground;
    console.log(this.mobileBackground);

    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    this.update();
    Layout.addListener(this.update);
  }

  update() {
    this.$node.style.background = Layout.isMobileLayout() ? this.mobileBackground : this.originalBackground;
  }

  static init(el) {
    el && new MobileBackground(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-mobile-background').forEach(item => MobileBackground.init(item));
});
