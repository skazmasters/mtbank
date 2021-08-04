class HeaderFixedDesktop extends Widget {
  constructor(node) {
    super(node);

    this.isFixed = false;

    this.events();

    this.update();
    this.updateHeight();
  }

  events() {
    onScroll(this.onScroll.bind(this));
    onResize(this.onResize.bind(this));

    Layout.addListener(this.onChangeLayout.bind(this));
  }

  onChangeLayout() {
    if (Layout.isDesktopLayout() === false) {
      this.destroy();
    } else {
      this.update();
      this.updateHeight();
    }
  }

  destroy() {
    this.setHeaderAsNotFixed();
  }

  setHeaderAsFixed() {
    if (this.isFixed) return;
    this.isFixed = true;

    this.$node.classList.add('fixed');
  }

  setHeaderAsNotFixed() {
    if (!this.isFixed) return;
    this.isFixed = false;

    document.body.classList.remove('header-fixed');
    this.$node.classList.remove('fixed-prepare');
    this.$node.classList.remove('fixed');
  }

  update() {
    const scrollTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);

    if (scrollTop > 500) {
      this.setHeaderAsFixed();
    } else {
      this.setHeaderAsNotFixed();
    }

    if (this.isFixed === false && scrollTop > this.baseBeight && document.body.classList.contains('header-fixed') === false) {
      this.$node.classList.add('fixed-prepare');
      document.body.classList.add('header-fixed');
    }

    if (scrollTop <= this.baseBeight) {
      this.$node.classList.remove('fixed-prepare');
      document.body.classList.remove('header-fixed');
    }
  }

  updateHeight() {
    this.baseBeight = this.$node.offsetHeight;
  }

  onScroll() {
    if (Layout.isDesktopLayout()) {
      this.update();
    }
  }

  onResize() {
    if (Layout.isDesktopLayout()) {
      this.updateHeight();
    }
  }

  static init(el) {
    new HeaderFixedDesktop(el);
  }
}

window.HeaderFixedDesktop = HeaderFixedDesktop;
