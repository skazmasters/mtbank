const widgetInstances = new Map();

class InnerHeaderTabs extends Widget {
  constructor(node) {
    super(node, '.js-inner-header-tabs', 'desktop');

    if (!this.$node) {
      return;
    }

    this.$tabs = this.queryElements('.tab');

    this.$inner = this.queryElement('.inner');
    this.$row = this.queryElement('.row');

    this.$moreContainer = null;
    this.$moreButton = null;
    this.moreOpened = false;

    this.eventHandlers = {};

    this.lastCount = null;

    this.tabWidths = [];

    this.onResize = this.onResize.bind(this);
    this.onMoreButtonClick = this.onMoreButtonClick.bind(this);

    this.init();
  }

  build() {
    this.moreOpened = false;
    this.lastCount = null;

    onResize(this.onResize);

    this.$moreContainer = document.createElement('li');
    this.$moreContainer.classList.add('inner-header__tab');
    this.$moreContainer.classList.add('inner-header__tab--more');
    this.$moreContainer.classList.add('hidden');

    this.$moreButton = document.createElement('button');
    this.$moreButton.classList.add('inner-header__tab-more');
    this.$moreButton.innerText = 'Еще';
    this.$moreContainer.append(this.$moreButton);
    this.$row.append(this.$moreContainer);

    this.$additionalRow = document.createElement('ul');
    this.$additionalRow.classList.add('inner-header__additional');
    this.$inner.append(this.$additionalRow);

    this.$moreButton.addEventListener('click', this.onMoreButtonClick);

    this.tabWidths = [];
    for (let i = 0; i < this.$tabs.length; i++) {
      this.tabWidths.push(this.$tabs[i].offsetWidth);
    }

    this.update();
  }

  destroy() {
    this.$tabs.forEach($tab => $tab.classList.remove('hidden'));

    this.$moreContainer.remove();
    this.$additionalRow.remove();
  }

  onResize() {
    this.update();
  }

  openMore() {
    if (this.moreOpened) return;

    this.$moreButton.classList.add('opened');
    this.$additionalRow.classList.add('visible');
    this.moreOpened = true;

    this.trigger('toggle-more');
  }

  closeMore() {
    if (!this.moreOpened) return;

    this.$moreButton.classList.remove('opened');
    this.$additionalRow.classList.remove('visible');
    this.moreOpened = false;

    this.trigger('toggle-more');
  }

  on(event, handler) {
    if (!(event in this.eventHandlers)) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  trigger(event) {
    if (event in this.eventHandlers) {
      this.eventHandlers[event].forEach(eventHandler => eventHandler());
    }
  }

  onMoreButtonClick(e) {
    e.preventDefault();

    if (this.moreOpened) {
      this.closeMore();
    } else {
      this.openMore();
    }
  }

  getVisibleCount() {
    const moreWidth = 70 + 30;
    const width = this.$node.offsetWidth - moreWidth;

    let current = 0;
    for (let i = 0; i < this.$tabs.length; i++) {
      current = current + this.tabWidths[i];
      if (current > width) {
        return i;
      }
    }

    return this.$tabs.length;
  }

  update() {
    const count = this.getVisibleCount();
    if (count === this.lastCount) return;
    this.lastCount = count;

    this.$moreContainer.classList.toggle('hidden', this.$tabs.length === count);

    this.$additionalRow.innerHTML = '';

    for (let i = 0; i < this.$tabs.length; i++) {
      if (i >= count) {
        this.$tabs[i].classList.add('hidden');
        this.$additionalRow.append(this.$tabs[i].cloneNode(true));
      } else {
        this.$tabs[i].classList.remove('hidden');
      }
    }
  }

  static get(elem) {
    return widgetInstances.get(elem);
  }

  static init(elem, options = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new InnerHeaderTabs(elem, options));
    } else {
      widgetInstances.get(elem).build();
    }

    return widgetInstances.get(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const $item = document.querySelector('.js-inner-header-tabs');
  if ($item && !$item.closest('.js-inner-header-fixed')) {
    InnerHeaderTabs.init($item);
  }
});

window.InnerHeaderTabs = InnerHeaderTabs;
