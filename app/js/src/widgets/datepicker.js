class Datepicker extends Widget {
  constructor(node) {
    super(node, '.js-datepicker');

    this.update = this.update.bind(this);

    this.minDate = this.$node.getAttribute('min');
    this.maxDate = this.$node.getAttribute('max');

    this.movedToBody = false;
    this.changed = false;
    this.defaultValue = this.$node.value;

    this.init();
  }

  build() {
    const valueParts = this.$node.value ? this.$node.value.split('-').reverse() : null;

    const minDateParts = this.minDate ? this.minDate.split('-').reverse() : null;
    const maxDateParts = this.maxDate ? this.maxDate.split('-').reverse() : null;

    datepicker(this.$node, {
      disableMobile: false,
      customDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вск'],
      customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      disableYearOverlay: true,
      position: this.$node.getBoundingClientRect().x > 200 ? 'br' : 'bl',
      dateSelected: valueParts ? new Date(valueParts[2], valueParts[1] - 1, valueParts[0]) : null,
      minDate: minDateParts ? new Date(minDateParts[2], minDateParts[1] - 1, minDateParts[0]) : null,
      maxDate: maxDateParts ? new Date(maxDateParts[2], maxDateParts[1] - 1, maxDateParts[0]) : null,
      formatter: (input, date, instance) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const valueParts = [
          (day < 10 ? '0' : '') + day,
          (month < 10 ? '0' : '') + month,
          date.getFullYear()
        ];

        input.value = valueParts.join('.');
      },
      onSelect: (instance, date) => {
        if ("createEvent" in document) {
          const evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          this.$node.dispatchEvent(evt);
        } else {
          this.$node.fireEvent("onchange");
        }

        const month = date.getMonth() + 1;
        const day = date.getDate();

        const valueParts = [
          (day < 10 ? '0' : '') + day,
          (month < 10 ? '0' : '') + month,
          date.getFullYear()
        ];

        instance.el.value = valueParts.join('.');

        this.changed = true;
      },
      onShow: instance => {
        const instanceRect = instance.el.getBoundingClientRect();
        const top = instanceRect.top + getScrollPos() + 42;
        const left = instanceRect.x < 200 ? instanceRect.left : instanceRect.left + instanceRect.width - 250;
        instance.calendarContainer.style.top = top + 'px';
        instance.calendarContainer.style.left = left + 'px';
        if (!this.movedToBody) {
          document.body.appendChild(instance.calendarContainer);
          this.movedToBody = true;
        }
      }
    })

    this.$node.addEventListener('keydown', e => {
      e.preventDefault();

      if (e.keyCode === 8) {
        this.$node.value = '';
      }
    });

    this.$node.addEventListener('change', e => {
      const value = e.target.value;

      if (value) {
        this.$node.classList.add('filled');
      } else {
        this.$node.classList.remove('filled');
      }

      this.$node.setAttribute('data-value', value.split('-').reverse().join('.'));
    });

    const value = this.$node.value;

    if (value) {
      this.$node.classList.add('filled');
    } else {
      this.$node.classList.remove('filled');
    }

    this.$node.setAttribute('data-value', value.split('-').reverse().join('.'));

    this.update();
  }

  update() {
    this.$node.setAttribute('type', 'text');

    if (this.defaultValue && !this.changed) {
      this.$node.value = this.defaultValue.split('-').reverse().join('.');
    }
  }

  static init(el) {
    new Datepicker(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-datepicker').forEach(item => Datepicker.init(item));
});
