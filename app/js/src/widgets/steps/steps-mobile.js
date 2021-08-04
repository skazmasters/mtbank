class StepsMobile extends Widget {
  constructor(node) {
    super(node, '.js-steps', 'no-desktop');

    this.$items = this.queryElements('.item');

    this.init();
  }

  build() {
    this.$items.forEach(($node, index) => {
      if(index === 0){
        $node.classList.add('opened');
      }

      Accord.init($node, {
        toggleElement: $node.querySelector('.steps-content__inner'),
        bodyElement: $node.querySelector('.steps-content__body'),
        disableScroll: true
      });
    });
  }

  destroy() {
    this.$items.forEach(Accord.destroy);
  }

  static init(el) {
    new StepsMobile(el);
  }
}

window.StepsMobile = StepsMobile;
