class InnerHeader extends Widget {
  constructor(node) {
    super(node, '.js-inner-header');

    InnerHeaderMenu.init(node);
    InnerHeaderFixed.init(node);
    InnerHeaderMobile.init(node);
  }

  static init(el) {
    el && new InnerHeader(el);
  }
}

let initialized = false;
document.addEventListener('DOMContentLoaded', () => {
  if (!initialized) initialized = true; else return;
  InnerHeader.init(document.querySelector('.js-inner-header'));
});
