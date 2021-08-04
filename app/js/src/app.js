class App {
  constructor() {
    this.addEvents();
  }

  addEvents() {
    document.addEventListener('DOMContentLoaded', e => {
      this.initLibs();
      this.initModules();
    });

    document.documentElement.addEventListener('touchstart', e => {
      if (e.touches.length > 1) e.preventDefault();
    });

    document.addEventListener('input', e => {
      const {target} = e;

      if (target.tagName !== 'TEXTAREA') {
        return false;
      }

      target.style.height = ``;
      target.style.height = `${target.scrollHeight}px`;
    });

    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('textarea').forEach(item => {
        item.style.height = '';
        item.style.height = item.scrollHeight + 'px';
      });
    });
  }

  initLibs() {
    window.svg4everybody();
  }

  initModules() {
    disablingPreloader();
  }
}

const app = new App();
