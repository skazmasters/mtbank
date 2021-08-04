class Header extends Widget {
  constructor(node) {
    super(node, 'js-header');

    HeaderDropdown.init(this.$node);
    HeaderMobile.init(this.$node);
    //HeaderFixedDesktop.init(this.$node);
    HeaderFixedMobile.init(this.$node);
  }

  static init(el) {
    new Header(el);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  Header.init(document.querySelector('.js-header'));
});
