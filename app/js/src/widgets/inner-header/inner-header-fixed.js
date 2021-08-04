let element = null;

class InnerHeaderFixed extends Widget {
  constructor(node) {
    super(node, '.js-inner-header');
    if (!this.$node) {
      return;
    }

    this.$originalNode = node;

    const $existedNode = document.querySelector('.inner-header.fixed');
    if ($existedNode) {
      $existedNode.remove();
    }

    this.$node = node.cloneNode(true);
    this.$node.classList.add('fixed');
    document.body.append(this.$node);

    new InnerHeaderMobile(this.$node);

    this.busyEvents = false;

    let fixedTabsHeader = null;
    let originalTabsHeader = null;

    const $originalTabsHeader = this.$originalNode.querySelector('.js-inner-header-tabs');
    if ($originalTabsHeader) {
      originalTabsHeader = InnerHeaderTabs.init($originalTabsHeader);
    }

    const $fixedTabsHeader = this.$node.querySelector('.js-inner-header-tabs');
    if ($fixedTabsHeader) {
      fixedTabsHeader = InnerHeaderTabs.init($fixedTabsHeader);
    }

    if (fixedTabsHeader && originalTabsHeader) {
      originalTabsHeader.on('toggle-more', () => {
        if (this.busyEvents) return;
        this.busyEvents = true;
        fixedTabsHeader.toggleMore();
        setTimeout(() => this.busyEvents = false);
      });

      fixedTabsHeader.on('toggle-more', () => {
        if (this.busyEvents) return;
        this.busyEvents = true;
        originalTabsHeader.toggleMore();
        setTimeout(() => {
          this.busyEvents = false;
        });
      });
    }

    this.$node.querySelectorAll('.js-scroll-to').forEach(element => new ScrollToLink(element));

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);

    this.busy = false;
    this.animationCallback = null;

    this.nodeHeight = null;
    this.nodeOffset = null;
    this.lastScrollPos = 0;

    this.$titleNodes = document.querySelectorAll('.inner-header__title');


    this.enabled = false;

    document.addEventListener('touchmove', function (event) {
      event.preventDefault();
    });

    this.init();
  }

  updateNodeParams() {
    this.nodeHeight = this.$originalNode.offsetHeight;
    this.nodeOffset = this.$originalNode.getBoundingClientRect().top + getScrollPos();
  }


  build() {
    this.updateNodeParams();

    onScroll(this.onScroll);
    onResize(this.onResize);

    this.tabsSupport();
  }

  destroy() {
    offScroll(this.onScroll);
    offResize(this.onResize);
  }

  tabsSupport() {
    const $tabsElement = document.querySelector('.js-tabs.js-tabs--page');
    if (!$tabsElement) {
      return;
    }

    const tabsInstance = Tabs.get($tabsElement);
    if (!tabsInstance) {
      return;
    }

    this.$node.querySelectorAll('.js-tab').forEach($node => {
      $node.addEventListener('click', e => {
        e.preventDefault();
        TabsUI.setActiveTab($tabsElement, $node.dataset.target, false);
      });
    });

    tabsInstance.on('change', params => {
      const {tab} = params;

      this.$node.querySelectorAll('.js-tab').forEach($item => {
        if ($item.dataset.target !== tab.target) {
          $item.classList.remove('active');
        } else {
          $item.classList.add('active');

          setTimeout(() => {
            const innerHeader = document.querySelector('.inner-header:not(.fixed)');
            if(innerHeader){
              startScrollTo(innerHeader);
            }
          });

          this.$titleNodes.forEach($titleNode => {
            $titleNode.innerHTML = $item.innerText;
          });
        }
      });

      document.querySelectorAll('.inner-header--mobile-dropdown.opened').forEach($node => {
        $node.classList.remove('opened');
      });
    });
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

    const direction = pageOffset >= this.lastScrollPos || pageOffset > (document.body.offsetHeight - window.innerHeight - 100) ? 'down' : 'up';

    if (direction === 'down') {
      if (isFixed && isVisible === false) {
        this.showHeader();
      }
    }

    this.setLastScrollPos(pageOffset);
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
    if (!this.enabled) {
      return;
    }

    this.busy = true;

    this.onAnimationEnd(this.$node, () => {
    });

    raf2x(() => {
      this.$node.querySelector('.inner-header__content').scrollLeft = 0;
      this.$node.classList.add('visible');
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
    this.$node.removeEventListener(endEvents.transition, this.animationCallback);
    this.animationCallback = null;
    this.busy = false;
  }

  static init(el) {
    element = new InnerHeaderFixed(el);
  }

  static update() {
    if (element) {
      element.onScroll();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-inner-header-fixed').forEach(InnerHeaderFixed.init);
});


window.InnerHeaderFixed = InnerHeaderFixed;
