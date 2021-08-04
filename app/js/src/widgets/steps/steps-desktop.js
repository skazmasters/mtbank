class StepsDesktop extends Widget {
  constructor(node) {
    super(node, '.js-steps', 'desktop');

    this.$items = this.queryElements('.item');
    this.$scene = this.queryElement('.scene');

    this.$slider = this.queryElement('.slider', false);
    this.navPrev = this.$node.querySelector('.js-slider-nav__prev', false);
    this.navNext = this.$node.querySelector('.js-slider-nav__next', false);

    this.hoveredIndex = null;
    this.mouseOverHandlers = [];

    this.init();
  }

  createMouseOverHandler(index) {
    return () => {
      this.hoveredIndex = index;
      setTimeout(() => {
        if (index === this.hoveredIndex) {
          this.setActive(index)
        }
      }, 150);
    };
  }


  build() {
    this.setActive(0);

    this.$items.forEach(($node, index) => {
      this.mouseOverHandlers[index] = this.createMouseOverHandler(index);
      $node.querySelector('.steps-content__inner').addEventListener('mouseover', this.mouseOverHandlers[index]);
    });

    if (this.$slider) {
      this.$slider.querySelectorAll('.steps-content__cell').forEach($item => $item.classList.add('swiper-slide'));

      this.swiper = new Swiper(this.$slider, {
        loop: true,
        slidesPerView: 5,
        spaceBetween: 0,
        slidesPerGroup: 1,
        loopFillGroupWithBlank: true,
        speed: 750,
        effect: "slide",
        navigation: {
          nextEl: this.navNext,
          prevEl: this.navPrev,
        },
      });

      console.log(this.swiper);
    }
  }

  destroy() {
    this.$items.forEach(($node, index) => {
      $node.querySelector('.steps-content__inner').removeEventListener('mouseover', this.mouseOverHandlers[index]);
    });

    this.setActive(null);
  }

  setActive(index) {
    this.$items.forEach($node => $node.classList.remove('opened'));
    this.$scene.innerHTML = null;

    if (index !== null) {
      this.$items[index].classList.add('opened');
      this.$scene.innerHTML = this.$items[index].querySelector('.steps-content__body').innerHTML;
    }
  }

  static init(el) {
    new StepsDesktop(el);
  }
}

window.StepsDesktop = StepsDesktop;
