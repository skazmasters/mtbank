let visiblePopover = null;

let bodyClickHandler = null;

class Popover extends Widget {
  constructor(node) {
    super(node, '.js-popover');

    this.content = this.$node.dataset.content;
    if (!this.content) {
      return;
    }

    this.isTouchMode = false;

    this.visible = false;
    this.hoveredNode = false;
    this.hoveredTooltip = false;
    this.hoveredTooltipInner = false;

    this.$activeTooltip = null;

    this.init();
  }

  build() {
    if (isTouchDevice()) {
      this.initTouchMode();
    } else {
      this.initDefaultMode();
    }
  }

  initTouchMode() {
    this.isTouchMode = true;

    this.$node.addEventListener('click', e => {
      e.preventDefault();
      if (this.visible) {
        this.hideTooltip();
      } else {
        this.showTooltip();
      }
    });
  }

  initDefaultMode() {
    this.$node.addEventListener('mouseover', () => {
      this.hoveredNode = true;
      if (!this.visible) {
        this.showTooltip();
      }
    });

    this.$node.addEventListener('mouseout', () => {
      this.hoveredNode = false;

      setTimeout(() => {
        this.hideTooltip();
      });
    });


    this.isTouchMode = false;
  }

  buildTooltip() {
    this.$activeTooltip = document.createElement('div');
    this.$activeTooltip.classList.add('popover-tooltip');

    if (this.isTouchMode) {
      this.$activeTooltip.classList.add('_touch');

      const $closeButton = document.createElement('button');
      $closeButton.classList.add('popover-tooltip__close');
      this.$activeTooltip.appendChild($closeButton);

      $closeButton.addEventListener('click', e => {
        e.preventDefault();
        this.hideTooltip();
      });
    }

    const inner = document.createElement('div');
    inner.classList.add('popover-tooltip__inner');
    inner.innerHTML = this.content;
    this.$activeTooltip.appendChild(inner);

    document.body.appendChild(this.$activeTooltip);

    this.$activeTooltip.addEventListener('mouseover', () => {
      this.hoveredTooltip = true;
    });

    inner.addEventListener('mouseover', () => this.hoveredTooltipInner = true);
    inner.addEventListener('mouseout', () => this.hoveredTooltipInner = false);

    this.$activeTooltip.addEventListener('mouseout', () => {
      this.hoveredTooltip = false;
      setTimeout(() => {
        if (!this.hoveredNode) {
          this.hideTooltip();
        }
      });
    });
  }

  isRightOpening() {
    return (this.$node.getBoundingClientRect().left + this.$node.offsetWidth + this.$activeTooltip.offsetWidth) < (document.body.offsetWidth - 20);
  }

  updateActivePosition() {
    if (this.isTouchMode) return;

    const rect = this.$node.getBoundingClientRect();

    if (this.isRightOpening()) {
      this.$activeTooltip.style.left = rect.left + this.$node.offsetWidth + 'px';
      this.$activeTooltip.classList.remove('_left');
    } else {
      this.$activeTooltip.style.left = rect.left - this.$activeTooltip.offsetWidth + 'px';
      this.$activeTooltip.classList.add('_left');
    }

    this.$activeTooltip.style.top = rect.top - 20 + getScrollPos() + 'px';
  }

  bodyClickHandler(e) {
    if (isClickOutsideElement(e, this.$activeTooltip) && isClickOutsideElement(e, this.$node)) {
      this.hideTooltip();
    }
  }

  showTooltip() {
    if (this.isTouchMode) {
      if (visiblePopover) {
        visiblePopover.hideTooltip();
      }
    }

    this.buildTooltip();
    this.updateActivePosition();
    this.$activeTooltip.classList.add('_show');
    this.$node.classList.add('active');

    this.visible = true;

    if (this.isTouchMode) {
      visiblePopover = this;

      bodyClickHandler = this.bodyClickHandler.bind(this);
      document.addEventListener('click', bodyClickHandler);
    }
  }

  hideTooltip() {
    if (bodyClickHandler) {
      document.removeEventListener('click', bodyClickHandler);
    }

    if (this.isTouchMode === false && (this.hoveredTooltipInner || this.hoveredNode || this.hoveredTooltip)) return;
    this.$node.classList.remove('active');
    this.$activeTooltip.remove();
    this.visible = false;
  }

  static init(el) {
    new Popover(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-popover').forEach(item => Popover.init(item));
});
