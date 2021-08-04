class HeaderMenu extends Widget {
  constructor(node) {
    super(node, 'js-header-menu');

    this.$items = this.queryElements('.item');
    if (this.$items.length === 0) {
      return;
    }

    this.$mobile = this.queryElement('.mobile');

    this.initMobileSelect();
  }

  initMobileSelect() {
    const selectNode = document.createElement('select');
    selectNode.classList.add('visually-hidden');
    this.$mobile.append(selectNode);

    this.$items.forEach(item => {
      const optionNode = document.createElement('option');
      optionNode.setAttribute('value', item.dataset.selectId);
      optionNode.innerText = item.innerText;

      if ('active' in item.dataset) {
        optionNode.setAttribute('selected', 'selected');
      }

      const href = item.getAttribute('href');
      if (href) {
        optionNode.setAttribute('data-href', href);
      }

      selectNode.append(optionNode);
    });

    DefaultLinkSelect.init(selectNode);
  }

  static init(el) {
    new HeaderMenu(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  HeaderMenu.init(document.querySelector('.js-header-menu'));
});
