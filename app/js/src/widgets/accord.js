const widgetInstances = new Map();

class Accord extends Widget {
  constructor(item, options = {}) {
    super(item, 'js-accord');

    this.$toggle = options.toggleElement ? options.toggleElement : this.queryElement('.toggle');
    this.$body = options.bodyElement ? options.bodyElement : this.queryElement('.body');
    this.$button = options.buttonElement ? options.buttonElement : this.$node.querySelector('.js-accord__button');
    this.disableScroll = options.disableScroll ? options.disableScroll : this.$node.dataset.noScroll;

    this.opened = this.$node.classList.contains('opened');
    this.busy = false;

    this.eventHandlers = {};

    this.onToggleClick = this.onToggleClick.bind(this);
  }

  build() {
    this.$toggle.addEventListener('click', this.onToggleClick);
  }

  destroy() {
    this.$toggle.removeEventListener('click', this.onToggleClick);
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

  scrollToView() {
    !this.disableScroll && startScrollTo(this.$node);
  }

  open() {
    if (this.opened) return;
    this.$node.classList.add('opened');
    this.expand();
    this.opened = true;
    this.trigger('opening');

    setTimeout(() => this.scrollToView(), 300);

    if (this.$button) {
      this.$button.style.display = 'none';
    }
  }

  close() {
    if (!this.opened) return;
    this.collapse();
    this.$node.classList.remove('opened');
    this.opened = false;
  }

  onToggleClick(e) {
    e.preventDefault();
    if (this.busy) return;
    this.busy = true;

    !this.opened ? this.open() : this.close();
  }

  collapse() {
    this.animate({
      from: this.$body.scrollHeight,
      to: 0,
    });
  }

  expand() {
    this.animate({
      from: 0,
      to: this.$body.scrollHeight,
    });
  }

  animate(height) {
    const elem = this.$body;

    const handler = e => {
      if (e.target !== e.currentTarget) return false;
      elem.removeEventListener(endEvents.transition, handler);
      elem.classList.remove('animate');
      elem.style.height = '';
      this.busy = false;

      this.$body.querySelectorAll('.swiper-container').forEach(swiperNode => {
        const swiper = swiperNode.swiper;
        swiper && swiper.update();
      });
    };

    elem.addEventListener(endEvents.transition, handler);

    elem.classList.add('animate');
    elem.style.height = `${height.from}px`;
    raf2x(() => {
      elem.style.height = `${height.to}px`;
    });
  }

  static destroy(elem) {
    widgetInstances.get(elem).destroy();
  }

  static get(elem) {
    return widgetInstances.get(elem);
  }

  static init(elem, options = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new Accord(elem, options));
    }

    widgetInstances.get(elem).build();

    return widgetInstances.get(elem);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const accords = document.querySelectorAll('.js-accord');
  accords.forEach(item => {
    const options = {};
    if (item.hasAttribute('data-disabled-scroll')) options.disableScroll = true;
    Accord.init(item, options);
  });
});

window.Accord = Accord;
