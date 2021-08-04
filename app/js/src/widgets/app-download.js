class AppDownload extends Widget {
  constructor(node) {
    super(node, 'app-download', 'mobile');

    this.$closeButton = this.queryElement('.close');
    this.$header = document.querySelector('.header');

    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);

    this.init();
  }

  build() {
    this.$closeButton.addEventListener('click', this.onCloseButtonClick);
    this.$header.classList.add('header--with-mobile-app');
  }

  destroy() {
    this.$header.classList.remove('header--with-mobile-app');
    this.$closeButton.removeEventListener('click', this.onCloseButtonClick);
  }

  onCloseButtonClick(e) {
    e.preventDefault();
    this.close();
  }

  close() {
    this.$node.classList.add('hidden');
    this.$header.classList.remove('header--with-mobile-app');

    const animationCallback = () => {
      window.dispatchEvent(new Event('resize'));
    };
    this.$header.addEventListener(endEvents.transition, animationCallback);
  }

  static init(el) {
    el && new AppDownload(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  AppDownload.init(document.querySelector('.js-app-download'));
});
