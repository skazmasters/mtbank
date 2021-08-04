import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';
import 'intersection-observer';
import './polyfills';
import 'picturefill';
import 'html5shiv';

import lazySizes from 'lazysizes';
import 'lazysizes/plugins/native-loading/ls.native-loading';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import svgPolyfill from 'svg4everybody';
import datepicker from 'js-datepicker';
import jquery from 'jquery';
import PerfectScrollbar from 'perfect-scrollbar';
import 'malihu-custom-scrollbar-plugin';
import swiper from 'swiper';
import select2 from 'select2';
import noUiSlider from 'nouislider';
import stickybits from 'stickybits';
import imask from 'imask';

window.$ = window.jQuery = jquery;
window.svg4everybody = svgPolyfill;
window.Swiper = swiper;
window.datepicker = datepicker;
window.select2 = select2;
window.IMask = imask;
window.PerfectScrollbar = PerfectScrollbar;
window.noUiSlider = noUiSlider;
window.stickybits = stickybits;

lazySizes.cfg.lazyClass = 'lazy';
lazySizes.cfg.srcAttr = 'data-original';
lazySizes.cfg.loadMode = 1;
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
  disableListeners: {
    scroll: true,
  },
};
