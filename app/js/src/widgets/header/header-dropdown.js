class HeaderDropdown extends Widget {
  constructor(node) {
    super(node, 'js-header');

    this.$overlay = this.queryElement('.overlay');
    this.$items = this.queryElements('.item');
    this.$headerSearchCloseButton = document.querySelector('.js-header-search__close');

    this.timerId = null;
    this.resetTimerId = null;
    this.hovered = null;

    this.rememberScrollY = null;

    this.onMouseOverEvents = [];
    this.onItemMouseOut = this.onItemMouseOut.bind(this);

    this.events();
    this.update();
  }

  update() {
    if (Layout.isDesktopLayout()) {
      this.bindEvents();
    } else {
      this.unbindEvents();
      this.setActive(false);
    }
  }

  bindEvents() {
    this.onMouseOverEvents = [];

    this.$items.forEach(item => {
      const event = this.onItemMouseOver(item);
      item.addEventListener('mouseover', event);
      this.onMouseOverEvents.push(event);

      item.addEventListener('mouseout', this.onItemMouseOut);
    });
  }

  unbindEvents() {
    this.$items.forEach((item, index) => {
      item.removeEventListener('mouseover', this.onMouseOverEvents[index]);
      item.removeEventListener('mouseout', this.onItemMouseOut);
    });
  }

  events() {
    Layout.addListener(this.update.bind(this));
  }

  toggleOverlay(state) {
    if (state) {
      this.$overlay.classList.add('visible');
      this.$headerSearchCloseButton.click();
    } else {
      this.$overlay.classList.remove('visible');
    }
  }

  setActive(item) {
    this.$items.forEach(_item => {
      _item.classList.remove('hover');
    });

    if (item) {
      item.classList.add('hover');
      hideScrollbar(scrollBarWidth => {
        this.$node.style.marginRight = '-' + scrollBarWidth;
        this.$node.style.marginLeft="-"+scrollBarWidth;});
      this.toggleOverlay(true);
    } else {
      showScrollbar();
      this.$node.style.marginRight = 0;
      this.toggleOverlay(false);
    }
  }

  onItemMouseOut() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }

    this.resetTimerId = setTimeout(() => {
      this.setActive(null);
      this.hovered = null;
    }, 50);
  }

  onItemMouseOver(item) {
    return e => {
      if (this.resetTimerId) {
        clearTimeout(this.resetTimerId);
      }

      this.hovered = item;

      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.rememberScrollY = getScrollPos();
      this.timerId = setTimeout(() => {
        if (getScrollPos() === this.rememberScrollY) {
          this.setActive(this.hovered);
        }
      }, 200);
    };
  }

  static init(el) {
    new HeaderDropdown(el);
  }
}

window.HeaderDropdown = HeaderDropdown;
