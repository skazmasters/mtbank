class Filters extends Widget {
  constructor(node) {
    super(node, 'js-filters', 'mobile');

    this.$toggle = this.queryElement('.toggle', false);
    this.$body = this.queryElement('.body', false);
    this.$list = this.queryElement('.list', false);

    this.onToggleClick = this.onToggleClick.bind(this);

    this.init();
  }

  build() {
    if (this.$toggle) {
      this.$toggle.addEventListener('click', this.onToggleClick);
    }
  }

  destroy() {
    if (this.$toggle) {
      this.$toggle.removeEventListener('click', this.onToggleClick);
      this.$toggle.classList.remove('active');
      this.$toggle.classList.remove('visible');
    }
  }

  onToggleClick(e) {
    e.preventDefault();

    this.$toggle.classList.toggle('active');
    this.$body.classList.toggle('visible');

    if (this.$list) {
      this.$list.scrollLeft = 0;
    }
  }

  static init(el) {
    new Filters(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-filters').forEach(item => Filters.init(item));
});
