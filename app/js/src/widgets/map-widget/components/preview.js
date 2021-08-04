import { dispatchEvent } from '../utils';
import { createObjectDetails } from '../helpers';

class Preview {
  constructor(node) {
    this.node = node;
    this.popup = this.getPopup();
    this.tab = this.getTab();

    this.isOpen = false;

    this.init();
  }

  init() {
    this.createEventListeners();
  }

  createEventListeners() {
    $(this.node).on('click', (e) => {
      const trigger = e.target.closest('[data-close]');
      if (trigger) this.closePreview();
    });
  }

  renderObjectDetails(data) {
    Preview.renderDetails(this.popup, data);
    Preview.renderDetails(this.tab, data);
  }

  static renderDetails(container, data) {
    const scrollerNode = Preview.getScrollerNode(container);
    const contentWrapperNode = Preview.getContainerNode(container);

    scrollerNode.scrollTo(0, 0);
    contentWrapperNode.innerHTML = '';
    contentWrapperNode.classList.remove('empty');
    contentWrapperNode.appendChild(
      createObjectDetails(data),
    );
  }

  clearObjectDetails() {
    Preview.clearDetails(this.popup);
    Preview.clearDetails(this.tab);
  }

  static clearDetails(container) {
    const contentWrapperNode = Preview.getContainerNode(container);

    contentWrapperNode.classList.add('empty');
    contentWrapperNode.innerHTML = '';
  }

  showPreview() {
    this.isOpen = true;
    this.tab.classList.add('open');
    this.popup.classList.add('open');
    if (isTabletLayout()) {
      hideScrollbar();
    }
  }

  closePreview() {
    this.isOpen = false;
    this.tab.classList.remove('open');
    this.popup.classList.remove('open');
    dispatchEvent('onPreviewClose');
    showScrollbar();
  }

  getTab() {
    return this.node.querySelector('.js-preview-tab');
  }

  getPopup() {
    return this.node.querySelector('.js-preview-popup');
  }

  static getContainerNode(parent) {
    return parent.querySelector('[data-content]');
  }

  static getScrollerNode(parent) {
    return parent.querySelector('[data-scroller]')
  }

  static createInstance(node) {
    return new Preview(node);
  }
}

export default Preview;
