import { dispatchEvent } from '../utils';

class Filters {
  constructor(node) {
    this.node = node;
    this.popupNode = this.getPopup();
    this.selectedMore = 0;
    this.options = {};

    this.init();
  }

  init() {
    this.createEventListeners();
    this.getFields().forEach(field => {
      this.updateFieldState(field);
    });
  }

  createEventListeners() {
    $(this.node).on('click', (e) => {
      const trigger = e.target.closest('[data-more],[data-close]');
      if (trigger) this.handleFiltersClick(trigger);
    });

    $(this.node).on('change', (e) => {
      const trigger = e.target.closest('[data-select],[data-checkbox]');
      if (trigger) this.handleFiltersChange(trigger);
    });
  }

  handleFiltersChange(target) {
    const optionElem =
      this.updateFieldState(target);

    this.updateCurrentUserPosition();
    dispatchEvent('onFiltersChange', {
      ...this.getFieldExtraOptions(optionElem),
    });
  }

  updateFieldState(target) {
    switch (true) {
      case 'select' in target.dataset:
        return this.handleSelectChange(target);
      case 'checkbox' in target.dataset:
        return this.handleCheckboxChange(target);
    }
  }

  handleSelectChange(target) {
    const { selectedIndex, options } = target;
    const selectedOption = options[selectedIndex];

    if (this.isFieldHidden(target)) {
      if (target.value) this.increaseSelectedMore();
      else this.decreaseSelectedMore();
    }

    this.setOption(target.name, target.value);
    this.getFieldsByName(target.name).forEach(select => {
      $(select).val(selectedOption.value);
      $(select).trigger('change.select2');
    });

    return selectedOption;
  }

  handleCheckboxChange(target) {
    if (!target.checked) this.removeOption(target.name);
    else this.setOption(target.name, target.value);

    if (this.isFieldHidden(target)) {
      if (target.checked) this.increaseSelectedMore();
      else this.decreaseSelectedMore();
    }

    this.getFieldsByName(target.name).forEach(checkbox => {
      checkbox.checked = target.checked;
    });

    return target;
  }

  isFieldHidden(target) {
    return !!target.closest('[data-hidden]');
  }

  updateSelectedMoreState() {
    if (this.selectedMore) this.node.classList.add('selected-more');
    else this.node.classList.remove('selected-more');
  }

  increaseSelectedMore() {
    this.selectedMore++;
    this.updateSelectedMoreState();
  }

  decreaseSelectedMore() {
    if (this.selectedMore > 0) {
      this.selectedMore--;
      this.updateSelectedMoreState();
    }
  }

  updateCurrentUserPosition() {
    this.node.querySelectorAll('[name="COORD_X"], [name="COORD_Y"]')
      .forEach(item => this.setOption(item.name, item.value));
  }

  getFieldExtraOptions(target) {
    return {
      center: target.dataset.coords,
      zoom: target.dataset.zoom,
    };
  }

  getFields() {
    return this.node.querySelectorAll('[data-checkbox],[data-select]');
  }

  getFieldsByName(name) {
    return this.node.querySelectorAll(`[name="${name}"]`);
  }

  setOption(name, value) {
    this.options[name] = value;
  }

  removeOption(name) {
    delete this.options[name];
  }

  handleFiltersClick(target) {
    switch (true) {
      case 'more' in target.dataset:
        this.openPopup();
        break;
      case 'close' in target.dataset:
        this.closePopup();
        break;
    }
  }

  openPopup() {
    this.popupNode.classList.add('open');
  }

  closePopup() {
    this.popupNode.classList.remove('open');
  }

  getPopup() {
    return this.node.querySelector('.js-filters-full');
  }

  static createInstance(node) {
    return new Filters(node);
  }
}

export default Filters;
