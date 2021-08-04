class CarouselSlider extends Widget {
  constructor(node) {
    super(node, '.js-carousel-slider', 'desktop');

    this.navPrev = this.queryElement('.js-slider-nav__prev', false);
    this.navNext = this.queryElement('.js-slider-nav__next', false);
    this.slider = this.queryElement('.slider');
    this.$slides = this.$node.querySelectorAll('.swiper-slide');

    this.swiper = null;
    this.slidesCount = Number(this.$node.dataset.slidesCount) || 4;
    this.scrollCount = Number(this.$node.dataset.scrollCount) || this.slidesCount;
    this.spaceBetween = typeof this.$node.dataset.spaceBetween !== 'undefined' ? Number(this.$node.dataset.spaceBetween) : 45;

    this.init();
  }

  build() {
    if (this.$slides.length <= this.slidesCount) {
      if(this.navPrev && this.navNext) {
        this.navPrev.style.display = 'none';
        this.navNext.style.display = 'none';
      }
    } else {
      this.swiper = new Swiper(this.slider, {
        loop: true,
        slidesPerView: this.slidesCount,
        spaceBetween: this.spaceBetween,
        slidesPerGroup: this.scrollCount,
        loopFillGroupWithBlank: true,
        speed: 750,
        effect: "slide",
        navigation: {
          nextEl: this.navNext,
          prevEl: this.navPrev,
        },
      });
    }
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  static init(el) {
    new CarouselSlider(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-carousel-slider')
    .forEach(item => CarouselSlider.init(item));
});
