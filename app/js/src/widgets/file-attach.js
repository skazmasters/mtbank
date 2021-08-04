class FileAttach extends Widget {
  constructor(node) {
    super(node, 'file-attach');

    this.$label = this.queryElement('label');
    this.$file = this.queryElement('input[type=file]');
    this.$reset = this.queryElement('input[type=file]');
    this.$fileInfo = null;
    this.$fileName = null;
    this.$success = null;

    this.onFileChange = this.onFileChange.bind(this);
    this.onReset = this.onReset.bind(this);

    this.init();
  }

  build() {
    this.buildHtml();

    this.$file.addEventListener('change', this.onFileChange);
    this.$reset.addEventListener('click', this.onReset);
  }

  destroy() {
    this.$file.removeEventListener('change', this.onFileChange);

    this.$success.remove();
    this.$fileInfo = this.$fileName = this.$success = this.$reset = null;
  }

  buildHtml() {
    const element = document.createElement('div');
    element.classList.add('file-attach__success');

    const button = document.createElement('button');
    button.classList.add('file-attach__reset');
    element.append(button);

    const result = document.createElement('div');
    result.classList.add('file-attach__result');
    element.append(result);

    const filename = document.createElement('span');
    filename.classList.add('file-attach__name');
    result.append(filename);

    const fileInfo = document.createElement('span');
    fileInfo.classList.add('file-attach__info');
    result.append(fileInfo);

    this.$fileInfo = fileInfo;
    this.$fileName = filename;
    this.$success = element;
    this.$reset = button;

    this.$node.append(element);

    this.toggleSuccess(false);
  }

  formatFileName(fileName) {
    return fileName;
  }

  formatFileSize(fileSize) {
    if (fileSize < 1024) {
      return fileSize + ' bytes';
    }

    if (fileSize < 1024 * 1024) {
      return Math.ceil(fileSize / 1024) + ' KB';
    }

    return (Math.round((fileSize / 1024 / 1024) * 100) / 100) + ' MB';
  }

  formatFileInfo(fileName, fileSize) {
    const fileExt = fileName.indexOf('.') !== -1 ? fileName.substr(fileName.lastIndexOf('.') + 1) : null;
    return (fileExt ? fileExt + ', ' : '') + this.formatFileSize(fileSize);
  }

  onFileChange(e) {

    const files = e.target.files;
    if (!files) return false;

    this.$fileName.innerText = this.formatFileName(files[0].name);
    this.$fileInfo.innerText = this.formatFileInfo(files[0].name, files[0].size);

    this.toggleSuccess(true);
  }

  onReset(e) {
    e.preventDefault();

    this.$file.type = '';
    this.$file.type = 'file';
    this.$file.value = null;

    this.toggleSuccess(false);
  }

  toggleSuccess(state) {
    if (state) {
      this.$success.classList.add('visible');
      this.$label.classList.add('hidden');
    } else {
      this.$success.classList.remove('visible');
      this.$label.classList.remove('hidden');
    }
  }

  static init(el) {
    new FileAttach(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-file-attach').forEach(item => FileAttach.init(item));
});
