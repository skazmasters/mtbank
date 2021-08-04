const widgetInstances = new Map();

class BenefitsSlider extends Widget {
  constructor(node) {
    super(node, '.js-benefits-slider', 'desktop');

    this.navPrev = this.queryElement('.js-slider-nav__prev');
    this.navNext = this.queryElement('.js-slider-nav__next');
    this.slider = this.queryElement('.slider');

    this.swiper = null;
    this.slidesCount = Number(this.$node.dataset.slidesCount) || 3;

    this.init();
  }

  build() {
    this.swiper = new Swiper(this.slider, {
      loop: false,
      slidesPerView: this.slidesCount,
      spaceBetween: 25,
      slidesPerGroup: this.slidesCount,
      loopFillGroupWithBlank: true,
      speed: 750,
      effect: "slide",
      navigation: {
        nextEl: this.navNext,
        prevEl: this.navPrev,
        disabledClass: 'disabled'
      },
    });
  }

  update() {
    this.swiper.update();
  }

  destroy() {
    this.swiper.destroy(true, true);
  }

  static init(elem, options = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new BenefitsSlider(elem));
    } else {
      widgetInstances.get(elem).build();
    }

    return widgetInstances.get(elem);
  }

  static get(elem) {
    return widgetInstances.get(elem);
  }

  static update(el) {
    el.querySelectorAll('.js-benefits-slider').forEach(node => {
      const slider = BenefitsSlider.get(node);
      if (slider) {
        slider.update();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-benefits-slider')
    .forEach(item => BenefitsSlider.init(item));
});

window.BenefitsSlider = BenefitsSlider;
