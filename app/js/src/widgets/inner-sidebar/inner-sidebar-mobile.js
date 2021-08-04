class InnerSidebarMobile extends Widget {
  constructor(node) {
    super(node, '.js-inner-sidebar', 'tablet');

    this.$originalNode = node;

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.busy = false;
    this.animationCallback = null;

    this.nodeHeight = null;
    this.nodeOffset = null;
    this.lastScrollPos = 0;

    this.enabled = false;

    this.init();
  }

  build() {
    this.events();
    this.updateNodeParams();

    onScroll(this.onScroll);
    onResize(this.onResize);
  }

  destroy() {
    this.$node.remove();

    offScroll(this.onScroll);
    offResize(this.onResize);
  }

  events() {
    const $exist = document.querySelector('.js-inner-sidebar.fixed');
    if ($exist) {
      $exist.remove();
    }

    this.$node = this.$originalNode.cloneNode(true);
    this.$node.classList.add('fixed');
    document.body.append(this.$node);
  }

  updateNodeParams() {
    this.nodeHeight = this.$originalNode.offsetHeight;
    this.nodeOffset = this.$originalNode.getBoundingClientRect().top + getScrollPos();
  }

  onScroll() {
    const pageOffset = Math.min(document.body.offsetHeight - window.innerHeight, getScrollPos());

    if (pageOffset > (this.nodeOffset + this.nodeHeight)) {
      this.showHeader();
      this.enable();
    } else {
      this.hideHeader();
      this.disable();
    }

    if (this.busy) {
      this.setLastScrollPos(pageOffset);
      return false;
    }

    const isFixed = true;
    const isVisible = this.$node.classList.contains('visible');

    if (!isFixed) return;

    const direction = this.currentDirection(pageOffset);

    if (direction === 'down') {
      if (isFixed && isVisible === false) this.showHeader();
    }

    // if (direction === 'up') {
    //   if (isFixed && isVisible) this.hideHeader();
    // }

    this.setLastScrollPos(pageOffset);
  }

  currentDirection(offset) {
    return (offset >= this.lastScrollPos) || offset > (document.body.offsetHeight - window.innerHeight - 100) ? 'down' : 'up';
  }

  onResize() {
    this.updateNodeParams();
  }

  setLastScrollPos(currScrollPos) {
    this.lastScrollPos = currScrollPos;
  }

  enable() {
    if (this.enabled) return;
    this.enabled = true;
  }

  disable() {
    if (!this.enabled) return;

    this.removeAnimation();
    this.$node.classList.remove('animate');

    this.enabled = false;
  }

  hideHeader() {
    this.busy = true;

    this.onAnimationEnd(this.$node, () => {
    });

    this.$node.classList.remove('visible');
  }

  showHeader() {
    if (!this.enabled) return;

    this.busy = true;

    this.onAnimationEnd(this.$node, () => {
    });

    raf2x(() => this.$node.classList.add('visible'));
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
    this.$node.removeEventListener(endEvents.transition, this.animationCallback);
    this.animationCallback = null;
    this.busy = false;
  }

  static init(el) {
    new InnerSidebarMobile(el);
  }
}

window.InnerSidebarMobile = InnerSidebarMobile;
