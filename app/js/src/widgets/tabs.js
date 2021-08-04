const widgetInstances = new Map();

class Tabs {
  constructor(nodeElement) {
    this.nodeElement = nodeElement;
    this.activeTab = null;
    this.tabs = [];

    this.eventHandlers = {};

    this.build();
  }

  on(event, handler) {
    if (!(event in this.eventHandlers)) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  trigger(event, options) {
    if (event in this.eventHandlers) {
      this.eventHandlers[event].forEach(eventHandler => eventHandler(options));
    }
  }

  initTabs() {
    this.tabs = [];

    this.findTabs().forEach(tabItem => {
      const targetSelector = tabItem.dataset.target;
      if (!targetSelector) {
        console.error(`Tab "${tabItem.innerText}" does not have data-target attribute`);
        return;
      }

      const tabContent = this.nodeElement.querySelectorAll(targetSelector);
      if (tabContent.length === 0) {
        console.error(`Tab content with selector "${targetSelector}" not found`);
      }

      const isActive = this.activeTab === null && tabItem.classList.contains('active');

      const tabModel = {
        isActive: false,
        target: tabItem.dataset.target,
        tabElement: tabItem,
        tabContentElement: tabContent
      };

      if (isActive) {
        this.activeTab = tabModel;
      }

      this.tabs.push(tabModel);
    });
  }

  findTabs() {
    const result = [];

    this.nodeElement.querySelectorAll('.js-tab').forEach(item => {
      if (item.closest('.js-tabs') === this.nodeElement) {
        result.push(item);
      }
    });

    return result;
  }

  hideTab(model) {
    model.tabElement.classList.remove('active');

    if (model.tabContentElement) {
      model.tabContentElement.forEach(item => {
        item.classList.remove('active');
      });
    }

    model.isActive = false;
  }

  showTab(model) {
    model.tabElement.classList.add('active');

    if (model.tabContentElement) {
      model.tabContentElement.forEach(item => {
        item.classList.add('active');
        BenefitsSlider.update(item);
      });
    }

    model.isActive = true;
  }

  setActiveTab(model) {
    if (!model) {
      return;
    }

    if (!model.isActive) {
      this.tabs.forEach(this.hideTab);

      this.showTab(model);

      this.trigger('change', {
        tab: model
      });
    }
  }

  setActiveIndex(index) {
    if (index < this.tabs.length) {
      this.setActiveTab(this.tabs[index]);
    }
  }

  setActiveTarget(target) {
    const found = this.tabs.find(tab => tab.target === target);
    if (found) {
      this.setActiveTab(found);
    }
  }

  onTabClick(e, model) {
    e.preventDefault();

    this.setActiveTab(model);
  }

  setDefaults() {
    if (!this.activeTab) {
      this.setActiveTab(this.tabs[0]);
    } else {
      this.setActiveTab(this.activeTab);
    }
  }

  build() {
    this.initTabs();

    this.setDefaults();

    this.tabs.forEach(tabModel => {
      tabModel.tabElement.addEventListener('click', e => this.onTabClick(e, tabModel));
    });
  }

  static destroy(elem) {
    widgetInstances.get(elem).destroy();
  }

  static init(elem = {}) {
    if (widgetInstances.has(elem) === false) {
      widgetInstances.set(elem, new Tabs(elem));
    }

    widgetInstances.get(elem).build();

    return widgetInstances.get(elem);
  }

  static get(elem) {
    return widgetInstances.get(elem);
  }
}

class TabsUI {
  static init() {
    document.querySelectorAll('.js-tabs').forEach(Tabs.init);
  }

  static setActiveTab($container, activeTabIndex, doScroll = false) {
    const tabsInstance = widgetInstances.get($container);

    const listener = () => {
      if (typeof activeTabIndex === 'string') {
        tabsInstance.setActiveTarget(activeTabIndex);
      } else {
        tabsInstance.setActiveIndex(activeTabIndex);
      }
    }

    if (tabsInstance) {
      if (doScroll) {
        startScrollTo(tabsInstance.nodeElement);
        setTimeout(listener, 1000);
      } else {
        listener();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TabsUI.init();
});
window.TabsUI = TabsUI;
window.Tabs = Tabs;
