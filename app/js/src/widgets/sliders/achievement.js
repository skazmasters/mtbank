class AchievementSlider {
  constructor(node) {
    this.$node = node;
    this.breakpoint = this.$node.dataset.breakpointValue || null;
    this.navPrev = this.$node.querySelector('.js-slider-nav__prev');
    this.navNext = this.$node.querySelector('.js-slider-nav__next');
    this.slider = this.$node.querySelector('[data-slider="slider"]');
    this.cards = this.$node.querySelectorAll('.achievement-card');
    this.mayInit = null;
    this.swiper = null;
    this.check = false;

    this.events();
  }

  events() {
    this.updateCache();

    isMobileLayout() ? setTimeout(() => this.checkCards(), 0) : null;

    onResize(this.updateCache.bind(this));
  }

  checkCards() {
    this.cards.forEach(item => {
      const height = item.getBoundingClientRect().height;
      if (height >= 300) item.classList.add('achievement-card--hide-text');
    })
  }

  initSwiper() {
    this.swiper = new Swiper(this.slider, {
      slidesPerView: 1.35,
      spaceBetween: 20,
      breakpoints: {
        640: {
          slidesPerView: 2.5,
          slidesPerGroup: 2.5,
          spaceBetween: 20,
          navigation: {
            nextEl: this.navNext,
            prevEl: this.navPrev,
            disabledClass: 'disabled'
          },
        },
        1200: {
          slidesPerView: 3.25,
          slidesPerGroup: 3.25,
          spaceBetween: 30,
          navigation: {
            nextEl: this.navNext,
            prevEl: this.navPrev,
            disabledClass: 'disabled'
          },
        },
      },
    });
    this.check = true;

    setTimeout(() => this.checkCards(), 0);
  }

  destroySwiper() {
    this.swiper.destroy(true, true);
    this.check = false;
  }

  get checkBreakpoint() {
    switch (this.breakpoint) {
      case null:
        return true;
      case 'mobile':
        return isMobileLayout();
      case 'tablet':
        return isTabletLayout();
      case 'laptop':
        return isLaptopLayout();
      case 'desktop':
        return isDesktopLayout();
      default:
        return true;
    }
  }

  updateCache() {
    this.mayInit = !isMobileLayout();

    if (this.mayInit) {
      if (!this.check) {
        this.initSwiper();
        setTimeout(() => this.swiper.update(), 1000);
      }
    } else {
      if (this.check) {
        this.destroySwiper();
      }
    }
  }

  static init(el) {
    new AchievementSlider(el);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-achievement-slider')
    .forEach(item => AchievementSlider.init(item));
});
