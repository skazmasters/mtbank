class HomeExchange extends Widget {
  constructor(node) {
    super(node, '.js-home-exchange');

    this.$buttons = this.queryElements('.button');
    this.$title = this.queryElement('.section__title');

    this.init();
  }

  build() {
    this.$buttons.forEach(button => button.addEventListener('click', e => {
      this.onButtonClick(button, e);
    }));
  }

  onButtonClick(button, e) {
    e.preventDefault();

    this.$title.innerText = button.innerText.trim();

    this.$buttons.forEach(_button => {
      const buttonElement = this.$node.querySelector(_button.dataset.target);

      if (_button.dataset.target === button.dataset.target) {
        _button.parentNode.classList.add('hidden');
        buttonElement.classList.add('visible');
      } else {
        _button.parentNode.classList.remove('hidden');
        buttonElement.classList.remove('visible');
      }
    });
  }

  static init(el) {
    new HomeExchange(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-home-exchange').forEach(item => HomeExchange.init(item));
});
