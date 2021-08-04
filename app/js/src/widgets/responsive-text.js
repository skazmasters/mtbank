class ResponsiveText extends Widget {
  constructor(node) {
    super(node, 'js-responsive-text');

    this.$text = this.queryElement('span');
    this.originalText = this.$text.innerText;
    this.tabletText = this.$node.dataset.tabletText;
    this.tabletMobileText = this.$node.dataset.tabletMobileText;

    this.update();
    this.events();
  }

  update() {
    if (this.tabletText) {
      if (Layout.isTabletLayout()) {
        this.$text.innerText = this.tabletText;
      } else {
        this.$text.innerText = this.originalText;
      }
    }

    if (this.tabletMobileText) {
      if (Layout.isTabletLayout() || Layout.isMobileLayout()) {
        this.$text.innerText = this.tabletMobileText;
      } else {
        this.$text.innerText = this.originalText;
      }
    }
  }

  events() {
    Layout.addListener(this.update.bind(this));
  }

  static init(el) {
    el && new ResponsiveText(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ResponsiveText.init(document.querySelector('.js-responsive-text'));
});
