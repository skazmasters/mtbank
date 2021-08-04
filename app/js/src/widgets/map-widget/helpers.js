const OBJECT_CARD_SELECTOR = '#tpl-object-card';
const OBJECT_MARKER_SELECTOR = '#tpl-object-marker';
const OBJECT_DETAILS_SELECTOR = '#tpl-object-details';
const ZOOM_CONTROL_SELECTOR = '#tpl-zoom-control';

function getTemplate(selector) {
  const template = document.querySelector(selector);
  return template.content.cloneNode(true);
}

/** Object marker **/
export function createObjectMarker(data, options = {}) {
  const tpl = getTemplate(OBJECT_MARKER_SELECTOR);
  const container = tpl.querySelector('[data-container]');

  container.dataset.color = data.color;
  if (options.shadow) container.classList.add('shadow');

  const timerWrapper = tpl.querySelector('[data-timer]');
  const contentWrapper = tpl.querySelector('[data-content]');

  if (!data.closed) timerWrapper.remove();
  else container.classList.add('timer');

  if (data.content) contentWrapper.innerHTML = data.content;
  else if (data.icon) contentWrapper.innerHTML = contentWrapper
    .innerHTML.replace(/\[\[iconName]]/ig, data.icon);

  return tpl;
}

/** Object card **/
export function createObjectCard(data) {
  const tpl = getTemplate(OBJECT_CARD_SELECTOR);

  tpl.querySelector('[data-icon]').appendChild(createObjectMarker(data.marker));
  tpl.querySelectorAll(`[data-field]`).forEach(field => {
    const fieldValue = data[field.dataset.field];

    if (fieldValue) field.innerHTML = fieldValue;
    else field.closest('[data-field]').remove();
  });

  return tpl;
}

/** Object details **/
export function createObjectDetails(data) {
  const tpl = getTemplate(OBJECT_DETAILS_SELECTOR);

  tpl.querySelectorAll(`[data-field]`).forEach(field => {
    const fieldValue = data[field.dataset.field];

    if (fieldValue) field.innerHTML = fieldValue;
    else field.closest('[data-item]').remove();
  });

  const phoneWrapper = tpl.querySelector('[data-phone]');

  if (!data.phone) phoneWrapper.closest('[data-item]').remove();
  else phoneWrapper.innerHTML = phoneWrapper.innerHTML
    .replace(/\[\[phone]]/ig, data.phone);

  return tpl;
}

/** Zoom controls **/
export function getZoomControlTemplate() {
  const tpl = getTemplate(ZOOM_CONTROL_SELECTOR);
  return tpl.querySelector('[data-container]').outerHTML;
}
