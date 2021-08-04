class ReviewSlider extends Widget {
  constructor(node) {
    super(node, 'js-review-slider');

    this.navPrev = this.queryElement('.js-review-slider__prev');
    this.navNext = this.queryElement('.js-review-slider__next');
    this.pagination = this.queryElement('.js-review-slider__pagination');
    this.slider = this.queryElement('.js-review-slider__slider');

    this.initDesktop = false;
    this.initMobile = false;
    this.check = false;

    this.swiper = null;

    this.events();
  }

  events() {
    this.updateCache();
    onResize(this.updateCache.bind(this));
  }

  updateCache() {
    Layout.isMobileLayout() ? this.mobileEvents() : this.desktopEvents();
  }

  desktopEvents() {
    this.initMobile ? this.initMobile = false : null;

    if (!this.initDesktop) {
      if (this.swiper) this.destroySwiper();
      this.initSwiper(this.desktopOptions);
      setTimeout(() => this.swiper.update(), 100);
    }

    this.initDesktop = true;
  }

  mobileEvents() {
    this.initDesktop ? this.initDesktop = false : null;

    if (!this.initMobile) {
      if (this.swiper) this.destroySwiper();
      this.initSwiper(this.mobileOptions);
      setTimeout(() => this.swiper.update(), 100);
    }

    this.initMobile = true;
  }

  initSwiper(options) {
    this.swiper = new Swiper(this.slider, options);
  }

  destroySwiper() {
    this.swiper.destroy(true, true);
    this.check = false;
  }

  get desktopOptions() {
    return {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: this.navNext,
        prevEl: this.navPrev,
      },
      pagination: {
        el: this.pagination,
        type: 'fraction',
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      breakpoints: {
        1200: {
          spaceBetween: 45,
        },
      },
    }
  }

  get mobileOptions() {
    return {
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: {crossFade: true},
      spaceBetween: 20,
      pagination: {
        el: this.pagination,
        type: 'bullets',
        clickable: true,
        dynamicBullets: true,
      },
    }
  }

  static init(el) {
    new ReviewSlider(el);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-review-slider')
    .forEach(item => ReviewSlider.init(item));
});
