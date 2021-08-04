class ContainerLink extends Widget {
  constructor(node) {
    super(node, 'container-link');
    this.href = this.$node.dataset.href;

    this.events();
  }

  events() {
    this.$node.addEventListener('click', this.onClick.bind(this));
  }

  isValid(node) {
    return node.tagName === 'A' || node.tagName === 'BUTTON';
  }

  onClick(e) {
    let target = e.target;

    if (this.$node !== target) {
      do {
        if (this.isValid(target)) return;
        target = target.parentNode;
      } while (target && target !== this.$node);
    }

    this.go();
  }

  go() {
    document.location.href = this.href;
  }

  static init(el) {
    new ContainerLink(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-container-link').forEach(item => ContainerLink.init(item));
});
