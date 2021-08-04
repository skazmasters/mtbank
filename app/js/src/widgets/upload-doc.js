class UploadDoc extends Widget {
  constructor(node) {
    super(node, '.js-upload-doc');

    this.$file = this.queryElement('input[type=file]');
    this.$filename = null;
    this.$reset = null;

    this.onFileChange = this.onFileChange.bind(this);
    this.onReset = this.onReset.bind(this);

    this.init();
  }

  onFileChange(e) {
    const files = e.target.files;
    if (!files) return false;

    this.$node.classList.add('uploaded');
    this.$filename.innerText = files[0].name;

    this.toggleSuccess(true);
  }

  onReset() {
    this.$node.classList.remove('uploaded');

    this.$file.type = '';
    this.$file.type = 'file';
    this.$file.value = null;
  }

  build() {
    this.buildHtml();
    this.events();
  }

  buildHtml() {
    this.$filename = document.createElement('span');
    this.$filename.classList.add('upload-doc__filename');
    this.$node.append(this.$filename);

    this.$reset = document.createElement('button');
    this.$reset.classList.add('upload-doc__reset');
    this.$node.append(this.$reset);
  }

  events() {
    this.$file.addEventListener('change', this.onFileChange);
    this.$reset.addEventListener('click', this.onReset);
  }

  static init(el) {
    el && new UploadDoc(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-upload-doc').forEach($node => UploadDoc.init($node));
});
