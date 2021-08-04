class Gdpr extends Widget {
  constructor(node) {
    super(node, 'js-gdpr');

    this.$acceptButton = this.queryElement('.accept');
    this.$rejectButton = this.queryElement('.reject');

    this.events();
  }

  events() {
    this.$acceptButton.addEventListener('click', this.onAcceptButtonClick.bind(this));
    this.$rejectButton.addEventListener('click', this.onRejectButtonClick.bind(this));

    setTimeout(() => {
      this.open();
    }, 2500);
  }

  open() {
    this.$node.classList.add('visible');
  }

  onAcceptButtonClick(e) {
    e.preventDefault();

    this.$node.classList.add('hidden');
    setTimeout(() => {
      this.$node.classList.remove('visible');
    }, 500);
  }

  onRejectButtonClick(e) {
    e.preventDefault();
    window.history.back();
  }

  static init(el) {
    el && new Gdpr(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Gdpr.init(document.querySelector('.js-gdpr'));
});
