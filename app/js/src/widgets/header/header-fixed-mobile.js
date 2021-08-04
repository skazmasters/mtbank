class HeaderFixedMobile extends Widget {
  constructor(node) {
    super(node, '.js-header', 'tablet-mobile');

    if (document.querySelector('.js-inner-header')) return;
    if (document.querySelector('.js-inner-sidebar')) return;

    this.header = this.$node;

    this.busy = false;
    this.animationCallback = null;
    this.mainHeight = null;

    this.lastScrollPos = null;

    this.cacheSizes = this.cacheSizes.bind(this);
    this.onScroll = this.onScroll.bind(this);

    this.init();
  }

  hasMobileApp() {
    return this.$node.classList.contains('header--with-mobile-app');
  }

  getHeaderNotFixedHeight() {
    return Layout.isTabletLayout() ? 203 : (this.hasMobileApp() ? 235 : 167);
  }

  build() {
    this.setLastScrollPos(getScrollPos());
    this.cacheSizes();

    onResize(this.cacheSizes);
    onScroll(this.onScroll);
  }

  destroy() {
    offResize(this.cacheSizes);
    offScroll(this.onScroll);
  }

  cacheSizes() {
    this.mainHeight = 400;
  }

  onScroll() {
    const pageOffset = getScrollPos();
    if (pageOffset < this.getHeaderNotFixedHeight()) {
      this.header.classList.remove('fixed');
      this.header.classList.remove('animate');
      this.header.classList.remove('hide');
      document.body.classList.remove('header-fixed');
      document.body.classList.remove('header--with-mobile-app');
      this.removeAnimation();
      this.setLastScrollPos(pageOffset);
      return false;
    }

    if (this.busy) {
      this.setLastScrollPos(pageOffset);
      return false;
    }

    const isFixed = this.header.classList.contains('fixed');
    const isHidden = this.header.classList.contains('hide');

    if (isFixed && !isHidden) {
      if (pageOffset < this.mainHeight) {
        this.busy = true;
        this.hideHeader(true);
      } else if (pageOffset > this.lastScrollPos) {
        this.busy = true;
        this.hideHeader();
      }
    } else if ((isHidden || !isFixed) && pageOffset > this.mainHeight) {
      if (pageOffset < this.lastScrollPos) {
        this.busy = true;
        this.showHeader();
      } else {
        this.fixHeader();
      }
    }

    this.setLastScrollPos(pageOffset);
  }

  setLastScrollPos(currScrollPos) {
    this.lastScrollPos = currScrollPos;
  }

  unfixHeader() {
    this.header.classList.remove('fixed');
    this.header.classList.remove('hide');
    document.body.classList.remove('header-fixed');
    document.body.classList.remove('header--with-mobile-app');
  }

  fixHeader() {
    this.header.classList.add('fixed');
    this.header.classList.add('hide');
    document.body.classList.add('header-fixed');

    if (this.hasMobileApp()) {
      document.body.classList.add('header--with-mobile-app');
    }
  }

  hideHeader(unfix) {
    this.onAnimationEnd(this.header, () => {
      if (unfix) this.unfixHeader();
      this.header.classList.remove('animate');
    });
    this.header.classList.add('animate');
    this.header.classList.add('hide');
  }

  showHeader() {
    this.fixHeader();
    this.onAnimationEnd(this.header, () => {
      this.header.classList.remove('animate');
      document.body.classList.remove('animate');
    });

    raf2x(() => {
      document.body.classList.add('animate-fixed');
      document.body.classList.remove('animate-hide');
      this.header.classList.add('animate');
      this.header.classList.remove('hide');
    });
  }

  onAnimationEnd(elem, callback) {
    this.animationCallback = ({target, currentTarget}) => {
      if (target !== currentTarget) return false;
      this.removeAnimation();
      callback();
    };
    elem.addEventListener(endEvents.transition, this.animationCallback);
  }

  removeAnimation() {
    this.header.removeEventListener(endEvents.transition, this.animationCallback);
    this.animationCallback = null;
    this.busy = false;
  }

  static init(el) {
    new HeaderFixedMobile(el);
  }
}

window.HeaderFixedMobile = HeaderFixedMobile;
