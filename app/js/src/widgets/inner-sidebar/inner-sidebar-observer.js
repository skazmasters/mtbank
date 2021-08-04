class InnerSidebarObserver extends Widget {
  constructor(node) {
    super(node, '.js-inner-sidebar');

    this.observer = null;
    this.offset = {
      top: null,
      bottom: null,
    };

    this.checkEntries = this.checkEntries.bind(this);
    this.resizeEvents = this.resizeEvents.bind(this);

    this.init();
  }

  build() {
    this.events();
    onResize(this.resizeEvents);
  }

  destroy() {
    this.observer.disconnect();
    offResize(this.resizeEvents);
  }

  resizeEvents() {
    this.updateOffset();
  }

  events() {
    this.updateOffset();

    this.indexingNavigation();
    this.initObserver();
  }

  updateOffset() {
    const viewportHeight = document.documentElement.clientHeight;
    this.offset.top = viewportHeight * 5 / 1e2;
    this.offset.bottom = viewportHeight * 92 / 1e2;
  }

  initObserver() {
    this.observer = this.createObserver();
    const sections = document.querySelectorAll('.js-sidebar-block');
    sections.forEach(section => this.observer.observe(section));
  }

  createObserver() {
    return new IntersectionObserver(this.checkEntries, this.observerConfig);
  }

  checkEntries(entries) {
    for (let entry of entries) {
      const {target, intersectionRatio, boundingClientRect: cords} = entry;

      if (intersectionRatio > 0) {
        const currNavItem = this.getActiveNav();
        this.removeActiveNav(currNavItem);

        const {id} = target;
        const nextNavItem = this.getNavById(id);
        this.setActiveNav(nextNavItem);

        return null;
      } else if (cords.top > this.offset.top) {
        const {id} = target;
        const currNavItem = this.getNavById(id);
        this.removeActiveNav(currNavItem);

        const {index} = currNavItem.dataset;
        const prevNavItem = this.getNavByIndex(index - 1);
        this.setActiveNav(prevNavItem);

        return null;
      }
    }
  }

  getNavById(id) {
    return this.$node.querySelector(`[href="#${id}"]`);
  }

  getNavByIndex(index) {
    return this.$node.querySelector(`[data-index="${index}"]`);
  }

  getAllNavItems() {
    return this.$node.querySelectorAll('[href]');
  }

  getActiveNav() {
    return this.$node.querySelector(`[href].active`);
  }

  setActiveNav(elem) {
    elem && elem.classList.add('active');

    if (elem && (Layout.isMobileLayout() || (Layout.isTabletLayout() && !Layout.isBigTabletLayout()))) {
      document.querySelectorAll('.js-inner-sidebar.fixed .sidebar-nav__list a').forEach($link => {
        $link.classList.toggle('active', $link.innerText === elem.innerText);
        if ($link.innerText === elem.innerText) {
          const $row = document.querySelector('.js-inner-sidebar.fixed .sidebar-nav__container');
          $row.scrollLeft = $link.parentElement.offsetLeft - window.innerWidth / 2;
        }
      });
    }
  }

  removeActiveNav(elem) {
    elem && elem.classList.remove('active');
  }

  indexingNavigation() {
    const navItems = this.getAllNavItems();

    navItems.forEach((navItem, i) => navItem.dataset.index = i);
  }

  get observerConfig() {
    return {
      rootMargin: '-5% 0% -92% 0%',
      threshold: 0,
    }
  }

  static init(el) {
    new InnerSidebarObserver(el);
  }
}

window.InnerSidebarObserver = InnerSidebarObserver;
