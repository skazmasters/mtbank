class HeaderMobile extends Widget {
  constructor(node) {
    super(node, 'js-header');

    this.opened = false;
    this.$burgerButton = this.queryElement('.burger');
    this.$headerSearch = this.queryElement('.header-search');
    this.$headerNavViewport = this.queryElement('.header-nav');
    this.$headerSearchDropdown = this.queryElement('.js-header-search__dropdown');
    this.$headerSearchInput = this.queryElement('.header-search .js-header-search__input');
    this.$headerSearchCloseButton = this.queryElement('.header-search .js-header-search__close');

    this.$headerLinks = this.queryElements('.link');
    this.$headerDropdowns = this.queryElements('.dropdown');

    this.$sub = this.queryElement('.sub');
    this.$subBack = this.queryElement('.sub_back');
    this.$subTitle = this.queryElement('.sub_title');
    this.$subSearch = this.queryElement('.sub_search');

    this.$callElement = this.queryElement('.header-actions__item--call');

    this.events();
  }

  events() {
    this.$burgerButton.addEventListener('click', () => this.toggle());

    this.$headerLinks.forEach(headerLink => {
      headerLink.addEventListener('click', this.onHeaderLinkClick(headerLink));
    });

    this.$subBack.addEventListener('click', this.onSubBackClick.bind(this));
    this.$subSearch.addEventListener('click', this.onSubSearchClick.bind(this));
  }

  hideDropdowns() {
    this.$headerSearch.classList.remove('hidden');
    this.$sub.classList.remove('visible');
    this.$headerDropdowns.forEach(item => item.classList.remove('visible'));
    this.$node.classList.remove('dropdown-opened');
    this.$callElement.classList.remove('hidden');
  }

  onSubSearchClick(e) {
    e.preventDefault();
    this.hideDropdowns();

    this.$headerSearchInput.focus();
    this.$headerSearchDropdown.classList.add('visible');
    this.$callElement.classList.add('hidden');
  }

  onSubBackClick(e) {
    e.preventDefault();
    this.hideDropdowns();
  }

  onHeaderLinkClick(link) {
    return e => {

      if (!this.opened) {
        return true;
      }

      const $dropdown = link.nextElementSibling;
      if (!$dropdown) {
        return;
      }

      e.preventDefault();

      $dropdown.classList.add('visible');

      this.$sub.classList.add('visible');
      this.$subTitle.innerText = link.innerText;

      this.$headerSearch.classList.add('hidden');
      this.$node.classList.add('dropdown-opened');

      $dropdown.scrollTop = 0;
    };
  }

  open() {
    this.$burgerButton.classList.add('opened');
    this.$node.classList.add('mobile-opened');
    this.opened = true;
    this.$headerSearch.classList.remove('active');
    this.$headerSearchCloseButton.classList.remove('visible');
    this.$headerSearchInput.value = '';
    this.$headerNavViewport.scrollTop = 0;
    hideScrollbar();
  }

  close() {
    this.$burgerButton.classList.remove('opened');
    this.$node.classList.remove('mobile-opened');
    this.opened = false;
    showScrollbar();

    this.hideDropdowns();
  }

  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  static init(el) {
    new HeaderMobile(el);
  }
}

window.HeaderMobile = HeaderMobile;
