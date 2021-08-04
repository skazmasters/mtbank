class HeaderSearch extends Widget {
  constructor(node) {
    super(node, 'js-header-search');

    this.$openButton = this.queryElement('.open');
    this.$closeButton = this.queryElement('.close');
    this.$backButton = this.queryElement('.back');
    this.$input = this.queryElement('.input');
    this.$dropdown = this.queryElement('.dropdown');
    this.$intro = this.queryElement('.intro');
    this.$result = this.queryElement('.result');

    this.$call = document.querySelector('.header-actions__item--call');

    this.onDocumentClick = this.onDocumentClick.bind(this);

    this.events();
  }

  events() {
    this.$openButton.addEventListener('click', this.onOpenClick.bind(this));
    this.$closeButton.addEventListener('click', this.onCloseClick.bind(this));
    this.$backButton.addEventListener('click', this.onBackClick.bind(this));
    this.$input.addEventListener('focus', this.onInputFocus.bind(this));
    this.$input.addEventListener('input', this.onInputInput.bind(this));
    this.$input.addEventListener('keydown', this.onInputKeyDown.bind(this));
  }


  updateResults() {
    const value = this.$input.value.trim();

    if (value.length === 0) {
      this.showSearchIntro();
      this.$closeButton.classList.remove('visible');
    } else {
      this.showSearchResults();
      this.$closeButton.classList.add('visible');
    }
  }

  onInputFocus() {
    this.$call.classList.add('hidden');
    this.$node.classList.add('active');
    this.updateResults();
  }

  onInputInput(e) {
    this.updateResults();
  }

  onInputKeyDown(e) {
    if (e.keyCode === 27) {
      this.close();
    }
  }

  onBackClick(e) {
    e.preventDefault();

    this.$input.value = '';
    this.$node.classList.remove('active');
    this.$closeButton.classList.remove('visible');
    this.$call.classList.remove('hidden');
  }

  onDocumentClick(e) {
    let target = e.target;
    do {
      if (target === this.$node) return;
      target = target.parentNode;
    } while (target);

    this.close();
  }

  onOpenClick(e) {
    e.stopPropagation();
    e.preventDefault();

    this.open();
  }

  onCloseClick(e) {
    e.stopPropagation();
    e.preventDefault();

    if (Layout.isDesktopLayout()) {
      this.close();
    } else {
      this.$input.value = '';
      this.showSearchIntro();
      this.$closeButton.classList.remove('visible');
      this.$input.focus();
    }
  }

  open() {
    this.$input.value = '';
    this.showSearchIntro();
    this.$dropdown.classList.add('active');
    this.$input.focus();
    document.addEventListener('click', this.onDocumentClick);
    this.$call.classList.add('hidden');
  }

  close() {
    this.$dropdown.classList.remove('active');
    document.removeEventListener('click', this.onDocumentClick);
    this.$node.classList.remove('active');
    this.$call.classList.remove('hidden');
  }

  showSearchIntro() {
    this.$result.classList.remove('visible');
    this.$intro.classList.add('visible');
  }

  showSearchResults() {
    this.$result.classList.add('visible');
    this.$intro.classList.remove('visible');
  }

  static init(el) {
    new HeaderSearch(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  HeaderSearch.init(document.querySelector('.js-header-search'));
});
