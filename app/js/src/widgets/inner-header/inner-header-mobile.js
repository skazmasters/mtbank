class InnerHeaderMobile extends Widget {
  constructor(node) {
    super(node, '.js-inner-header', 'smallTablet-mobile');

    this.$title = this.$node.querySelector('.inner-header__title');

    this.onTitleClick = this.onTitleClick.bind(this);

    this.init();
  }

  onTitleClick(e) {
    e.preventDefault();

    this.$node.classList.toggle('opened');
  }

  build() {
    this.$title.addEventListener('click', this.onTitleClick);
  }

  destroy() {
    this.$title.removeEventListener('click', this.onTitleClick);
  }

  static init(el) {
    new InnerHeaderMobile(el);
  }
}

window.InnerHeaderMobile = InnerHeaderMobile;
