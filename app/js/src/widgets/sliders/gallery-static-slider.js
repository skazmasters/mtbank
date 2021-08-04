class GalleryStaticSlider {
  constructor(node) {
    this.$node = node
    this.breakpoint = this.$node.dataset.breakpointValue || null;
    this.mayInit = null;
    this.swiper = null;
    this.check = false;
    this.images = this.$node.querySelectorAll('img')

    this.events();
  }

  events() {
    this.updateCache();
    onResize(this.updateCache.bind(this));
  }

  imagesEvents() {
    this.images.forEach(item => {
      const prnt = item.closest('div');
      prnt.classList.add('loading');

      item.addEventListener("lazyloaded", () => {
        prnt.classList.remove('loading')
      });
    })
  }

  initSwiper() {
    this.swiper = new Swiper(this.$node, {
      slidesPerView: 1,
      spaceBetween: 15,
      speed: 800,
      loop: true,
      autoplay: false,
      pagination: {
        el: '.swiper-pagination',
        dynamicMainBullets: 3,
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.js-slider-next',
        prevEl: '.js-slider-prev',
        disabledClass: 'gallery-nav__item--disabled'
      },
      breakpoints: {
        767: {
          spaceBetween: 20,
        },
        1259: {
          spaceBetween: 45,
        },
      },
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
      if (!this.check) this.initSwiper();
      this.imagesEvents();
    } else {
      if (this.check) {
        this.destroySwiper();
      }
    }
  }

  static init(el) {
    new GalleryStaticSlider(el)
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-gallery-static')
    .forEach(item => GalleryStaticSlider.init(item));
});
