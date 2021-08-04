class Steps extends Widget {
  constructor(node) {
    super(node, '.js-steps');

    StepsMobile.init(node);
    StepsDesktop.init(node);
  }

  static init(el) {
    el && new Steps(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-steps').forEach(Steps.init);
});
