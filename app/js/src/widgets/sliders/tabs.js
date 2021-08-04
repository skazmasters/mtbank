class TabsSlider extends Widget {
  constructor(node) {
    super(node, 'js-tabs-slider');

    this.navPrev = this.$node.querySelector('.js-slider-nav__prev');
    this.navNext = this.$node.querySelector('.js-slider-nav__next');
    this.nav = this.$node.querySelector('.slider-nav');

    this.slider = this.queryElement('.slider');
    this.tabs = this.queryElements('.tab');
    this.slides = this.queryElements('.slide');

    this.mayInit = null;
    this.swiper = null;
    this.check = false;

    this.currentMode = null;

    this.events();
  }

  events() {
    this.updateMode();
    onResize(this.updateMode.bind(this));

    this.tabs.forEach(tab => tab.addEventListener('click', this.onTabClick(tab)));

    this.tabs.forEach(tab => {
      if (tab.classList.contains('active')) {
        this.filter(tab.dataset.filter);
      }
    });
  }

  checkFilter(filter, node) {
    return filter === '*' || node.dataset.filter.split(',').indexOf(filter) !== -1;
  }

  showNode(node) {
    node.classList.add('swiper-slide');
    node.classList.remove('non-swiper-slide');
  }

  hideNode(node) {
    node.classList.remove('swiper-slide');
    node.classList.add('non-swiper-slide');
  }

  filter(filter) {
    let visibleCount = 0;

    this.slides.forEach(node => {
      if (this.checkFilter(filter, node)) {
        this.showNode(node);
        visibleCount = visibleCount + 1;
      } else {
        this.hideNode(node);
      }
    });

    this.swiper.destroy(true, true);

    if (visibleCount > 4) {
      this.initSwiper();
    } else{
      this.toggleNavigation(false);
    }
  }

  onTabClick(tab) {
    return e => {
      e.preventDefault();

      if (tab.classList.contains('active')) {
        return;
      }

      this.tabs.forEach(tab => tab.classList.remove('active'));
      tab.classList.add('active');

      this.filter(tab.dataset.filter);
    };
  }

  initSwiper() {
    this.swiper = new Swiper(this.slider, {
      spaceBetween: 45,
      slidesPerView: 4,
      slidesPerGroup: 4,
      loopFillGroupWithBlank: true,
      loop: false,
      speed: 750,
      effect: "slide",
      navigation: {
        prevEl: this.navPrev,
        nextEl: this.navNext,
        disabledClass: 'disabled'
      },

      on: {
        init: () => {
          if (this.slider.swiper) {
            this.toggleNavigation(this.slider.swiper.slides.length > 4);
          }
        }
      }
    });

    this.check = true;

    setTimeout(() => this.swiper.update(), 1000);
  }

  toggleNavigation(state) {
    this.nav.classList.toggle('hidden', !state);
  }

  destroySwiper() {
    this.swiper.destroy(true, true);
    this.check = false;
  }

  updateMode() {
    const mode = Layout.isDesktopLayout() ? 'slider' : 'row';

    if (mode !== this.currentMode) {
      if (mode === 'slider') {
        this.initSwiper();
      } else if (this.currentMode !== null) {
        this.destroySwiper();
      }

      this.currentMode = mode;
    }
  }

  static init(el) {
    new TabsSlider(el);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-tabs-slider').forEach(item => TabsSlider.init(item));
});
