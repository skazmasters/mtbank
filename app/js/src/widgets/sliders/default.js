class DefaultSlider {
  constructor(node) {
    this.$node = node;
    this.breakpoint = this.$node.dataset.breakpointValue || null;
    this.perView = this.$node.dataset.perView || 1.5;
    this.perViewTablet = this.$node.dataset.perViewTablet || 2.5;
    this.perViewDesktop = this.$node.dataset.perViewDesktop || 4;
    this.navPrev = this.$node.querySelector('.js-default-slider__prev');
    this.navNext = this.$node.querySelector('.js-default-slider__next');
    this.mayInit = null;
    this.swiper = null;
    this.check = false;

    this.events();
  }

  events() {
    this.updateCache()
    onResize(this.updateCache.bind(this))
  }

  initSwiper() {
    this.swiper = new Swiper(this.$node, {
      slidesPerView: this.perView,
      spaceBetween: 20,
      loop: true,
      breakpoints: {
        640: {
          slidesPerView: this.perViewTablet,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: this.perViewDesktop,
          spaceBetween: 45,
          navigation: {
            nextEl: this.navNext,
            prevEl: this.navPrev,
          },
        }
      }
    });
    this.check = true;
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
    this.mayInit = this.checkBreakpoint;

    if (this.mayInit) {
      if (!this.check) this.initSwiper()
    } else {
      if (this.check) {
        this.destroySwiper();
      }
    }
  }

  static init(el) {
    new DefaultSlider(el);
  }
}

class HomeRecommendedSlider extends DefaultSlider {
  constructor(tabs) {
    super();
    this.tabs = tabs;
  }

  events() {
    super.events();
  }

  tabEvents() {

  }

  static init(el) {
    new HomeRecommendedSlider(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-default-slider')
    .forEach(item => DefaultSlider.init(item))
  document.querySelectorAll('.js-slider-in-tab')
    .forEach(item => DefaultSlider.init(item))
})
