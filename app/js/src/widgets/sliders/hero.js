class HeroSlider extends Widget {
  constructor(node) {
    super(node, 'js-hero-slider');

    this.navPrev = this.queryElement('.js-slider-nav__prev');
    this.navNext = this.queryElement('.js-slider-nav__next');
    this.navIndicatorCircle = this.queryElement('.js-slider-nav__loading').querySelector('circle');

    this.mayInit = null;
    this.swiper = null;
    this.check = false;

    this.paused = false;
    this.pauseTotal = 0;
    this.pauseStartAt = null;

    this.events();

    this.resetIndicator();

    this.initSwiper();
  }

  events() {
    if (this.navPrev) {
      this.navPrev.addEventListener('click', () => {
        this.swiper.slidePrev();
      });
    }

    if (this.navNext) {
      this.navNext.addEventListener('click', () => {
        this.swiper.slideNext();
      });
    }

    this.$node.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.$node.addEventListener('mouseout', this.onMouseOut.bind(this));
  }

  onMouseOver() {
    this.pause();
  }

  onMouseOut() {
    this.resume();
  }

  pause() {
    if (this.paused) return;

    this.pauseStartAt = performance.now();

    this.paused = true;
  }

  resume() {
    if (!this.paused) return;

    this.pauseTotal = this.pauseTotal + (performance.now() - this.pauseStartAt);
    this.pauseStartAt = 0;
    this.paused = false;

    raf(this.animate.bind(this));
  }

  getAutoplayTimeout() {
    return (this.$node.dataset.autoplayDelay || 5) * 1000;
  }

  toNextSlide() {
    this.swiper.slideNext();
  }

  onSlideChange() {
    this.resetIndicator();
  }

  drawProgress(value) {
    this.navIndicatorCircle.style.strokeDashoffset = 283 - (283 / 100 * value).toFixed(2);
  }

  animate(time) {
    if (this.paused) {
      return;
    }

    let timeFraction = (time - this.startTime - this.pauseTotal) / this.getAutoplayTimeout();
    this.drawProgress(timeFraction * 100);

    if (timeFraction < 1) {
      raf(this.animate.bind(this));
    } else {
      this.toNextSlide();
    }
  }

  resetIndicator() {
    this.drawProgress(0);
    this.pauseTotal = 0;

    this.startTime = performance.now();
    if (this.pauseStartAt) {
      this.pauseStartAt = this.startTime;
    }

    raf(this.animate.bind(this));
  }

  initSwiper() {
    this.swiper = new Swiper(this.$node, {
      slidesPerView: 1,
      loop: false,
      autoplay: false,
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
      },
      breakpoints: {
        1280: {
          loop: true,
        },
      },
    });

    this.swiper.on('slideChange', () => this.onSlideChange());

    this.check = true;
  }

  static init(el) {
    new HeroSlider(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-hero-slider').forEach(item => HeroSlider.init(item));
});
