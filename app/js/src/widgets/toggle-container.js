class ToggleContainer extends Widget {
  constructor(node) {
    super(node, 'js-toggle-container');
    this.$btn = this.queryElement('[data-toggle="button"]');
    this.$content = this.queryElement('[data-toggle="content"]');

    this.events();
  }

  events() {
    const buttonHandler = this.btnHandler.bind(this);

    this.$btn.addEventListener('click', buttonHandler);
  }


  btnHandler(e) {
    e.preventDefault();

    this.$btn.classList.contains('active')
      ? this.$btn.classList.remove('active')
      : this.$btn.classList.add('active');

    this.$content.classList.contains('active')
      ? this.$content.classList.remove('active')
      : this.$content.classList.add('active');
  }

  static init(el) {
    el && new ToggleContainer(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ToggleContainer.init(document.querySelector('.js-toggle-container'));
});
