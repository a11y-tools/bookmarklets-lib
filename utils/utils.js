/*
*   utils.js: utility functions
*/

export { getScrollOffsets, drag, addPolyfills };

/*
*   getScrollOffsets: Use x and y scroll offsets to calculate positioning
*   coordinates that take into account whether the page has been scrolled.
*   From Mozilla Developer Network: Element.getBoundingClientRect()
*/
function getScrollOffsets () {
  let t;

  let xOffset = (typeof window.pageXOffset === 'undefined') ?
    (((t = document.documentElement) || (t = document.body.parentNode)) &&
      typeof t.ScrollLeft === 'number' ? t : document.body).ScrollLeft :
    window.pageXOffset;

  let yOffset = (typeof window.pageYOffset === 'undefined') ?
    (((t = document.documentElement) || (t = document.body.parentNode)) &&
      typeof t.ScrollTop === 'number' ? t : document.body).ScrollTop :
    window.pageYOffset;

  return { x: xOffset, y: yOffset };
}

/*
*   drag: Add drag and drop functionality to an element by setting this
*   as its mousedown handler. Depends upon getScrollOffsets function.
*   From JavaScript: The Definitive Guide, 6th Edition (slightly modified)
*/
function drag (elementToDrag, dragCallback, event) {
  let scroll = getScrollOffsets();
  let startX = event.clientX + scroll.x;
  let startY = event.clientY + scroll.y;

  let origX = elementToDrag.offsetLeft;
  let origY = elementToDrag.offsetTop;

  let deltaX = startX - origX;
  let deltaY = startY - origY;

  if (dragCallback) dragCallback(elementToDrag);

  if (document.addEventListener) {
    document.addEventListener('mousemove', moveHandler, true);
    document.addEventListener('mouseup', upHandler, true);
  }
  else if (document.attachEvent) {
    elementToDrag.setCapture();
    elementToDrag.attachEvent('onmousemove', moveHandler);
    elementToDrag.attachEvent('onmouseup', upHandler);
    elementToDrag.attachEvent('onlosecapture', upHandler);
  }

  if (event.stopPropagation) event.stopPropagation();
  else event.cancelBubble = true;

  if (event.preventDefault) event.preventDefault();
  else event.returnValue = false;

  function moveHandler (e) {
    if (!e) e = window.event;

    let scroll = getScrollOffsets();
    elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + 'px';
    elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + 'px';

    elementToDrag.style.cursor = 'move';

    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }

  function upHandler (e) {
    if (!e) e = window.event;

    elementToDrag.style.cursor = 'grab';
    elementToDrag.style.cursor = '-moz-grab';
    elementToDrag.style.cursor = '-webkit-grab';

    if (document.removeEventListener) {
        document.removeEventListener('mouseup', upHandler, true);
        document.removeEventListener('mousemove', moveHandler, true);
    }
    else if (document.detachEvent) {
        elementToDrag.detachEvent('onlosecapture', upHandler);
        elementToDrag.detachEvent('onmouseup', upHandler);
        elementToDrag.detachEvent('onmousemove', moveHandler);
        elementToDrag.releaseCapture();
    }

    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }
}

/*
*   addPolyfills: Add polyfill implementations for JavaScript object methods
*   defined in ES6 and used by bookmarklets:
*   1. Array.prototype.find
*   2. String.prototype.includes
*/
function addPolyfills () {

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
  if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
      if (typeof start !== 'number') {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      }
      else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }
}
