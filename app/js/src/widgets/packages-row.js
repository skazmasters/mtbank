class PackagesRow extends Widget {
  constructor(node) {
    super(node, 'js-packages-row', 'desktop');

    this.ps = null;

    this.init();
  }

  build() {
    this.ps = new PerfectScrollbar(this.$node, {
      useBothWheelAxes: false,
      suppressScrollY: true,
    });
  }

  destroy() {
    if (this.ps) {
      this.ps.destroy();
    }
  }

  static init(el) {
    el && new PackagesRow(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-packages-row').forEach(item => PackagesRow.init(item));
});
