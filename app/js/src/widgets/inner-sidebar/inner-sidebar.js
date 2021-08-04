class InnerSidebar extends Widget {
  constructor(node) {
    super(node, '.js-inner-sidebar');

    document.addEventListener('touchmove', e => e.preventDefault());
    this.$node.querySelectorAll('a').forEach(el => new ScrollToLink(el));

    InnerSidebarObserver.init(node);
    InnerSidebarDesktop.init(node);
    InnerSidebarMobile.init(node);
  }

  static init(el) {
    el && new InnerSidebar(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  InnerSidebar.init(document.querySelector('.js-inner-sidebar'));
});
