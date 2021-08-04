function buildThresholdList(numSteps = 10) {
  let thresholds = [];

  for (let i = 1; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

function isLocalhost() {
  return document.location.href.indexOf('localhost') !== -1 || document.location.href.indexOf('192.168') !== -1;
}

function triggerInputChange(element) {
  if ('createEvent' in document) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    element.dispatchEvent(evt);
  } else
    element.fireEvent('onchange');
}

function isClickOutsideElement(event, element) {
  let target = event.target;

  if (element !== target) {
    do {
      target = target.parentNode;
    } while (target && target !== element);
  }

  return !target;
}

window.isClickOutsideElement = isClickOutsideElement;
window.triggerInputChange = triggerInputChange;
window.isLocalhost = isLocalhost;
window.buildThresholdList = buildThresholdList;
