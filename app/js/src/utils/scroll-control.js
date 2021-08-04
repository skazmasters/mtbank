class ScrollControl {
  constructor() {
    this.isFixedScroll = false;
    this.lastScrollPos = this._getScrollPos();

    onScroll(() => {
      if (this.isFixedScroll) return false;
      this.lastScrollPos = this._getScrollPos();
    });
  }

  _getScrollPos() {
    return window.pageYOffset;
  }

  showScrollbar() {
    if (!document.body.classList.contains('fixed-scroll')) {
      return false;
    }

    document.body.classList.remove('fixed-scroll');
    document.body.style.paddingRight = ``;

    if (isMobileLayout()) {
      this.lastScrollPos = parseFloat(getComputedStyle(document.body).top || '0');
      document.body.style.top = ``;
      window.scrollTo(0, this.lastScrollPos * -1);
    }

    this.isFixedScroll = false;
    return true;
  }

  hideScrollbar(callback) {
    if (document.body.classList.contains('fixed-scroll')) {
      return false;
    }

    if (isMobileLayout()) {
      document.body.style.top = `-${this.lastScrollPos}px`;
    }

    const scrollBarWidth = ScrollControl._calcScrollbarWidth();

    document.body.classList.add('fixed-scroll');
    document.body.style.paddingRight = scrollBarWidth;

    if (callback) {
      callback(scrollBarWidth);
    }

    this.isFixedScroll = true;
    return true;
  }

  getScrollbarState() {
    return this.isFixedScroll;
  }

  getLastScrollPos() {
    return this.lastScrollPos;
  }

  static _calcScrollbarWidth() {
    const scrollbarMeasure = document.createElement('div');
    scrollbarMeasure.className = 'scroll-measure';

    document.body.appendChild(scrollbarMeasure);

    const offsetWidth = scrollbarMeasure.offsetWidth;
    const clientWidth = scrollbarMeasure.clientWidth;
    const scrollbarWidth = `${offsetWidth - clientWidth}px`;

    document.body.removeChild(scrollbarMeasure);

    return scrollbarWidth;
  }
}

const scrollControl = new ScrollControl();

window.showScrollbar = scrollControl.showScrollbar.bind(scrollControl);
window.hideScrollbar = scrollControl.hideScrollbar.bind(scrollControl);
window.getScrollPos = scrollControl.getLastScrollPos.bind(scrollControl);
window.isFixedSCroll = scrollControl.getScrollbarState.bind(scrollControl);
