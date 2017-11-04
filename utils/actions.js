/*
*   actions.js: functions adding and removing DOM overlay elements
*/

import { isVisible } from './a11y';
import { formatInfo } from './info';
import { createOverlay, addDragAndDrop } from './overlay';
export { addNodes, removeNodes };

/*
*   addNodes: Use targetList to generate nodeList of elements and to
*   each of these, add an overlay with a unique CSS class name.
*   Optionally, if getInfo is specified, add tooltip information;
*   if dndFlag is set, add drag-and-drop functionality.
*/
function addNodes (params) {
  let targetList = params.targetList,
      cssClass = params.cssClass,
      getInfo = params.getInfo,
      evalInfo = params.evalInfo,
      dndFlag = params.dndFlag;
  let counter = 0;

  targetList.forEach(function (target) {
    // Collect elements based on selector defined for target
    let elements = document.querySelectorAll(target.selector);

    // Filter elements if target defines a filter function
    if (typeof target.filter === 'function')
      elements = Array.prototype.filter.call(elements, target.filter);

    Array.prototype.forEach.call(elements, function (element) {
      if (isVisible(element)) {
        let info = getInfo(element, target);
        if (evalInfo) evalInfo(info, target);
        let boundingRect = element.getBoundingClientRect();
        let overlayNode = createOverlay(target, boundingRect, cssClass);
        if (dndFlag) addDragAndDrop(overlayNode);
        let labelNode = overlayNode.firstChild;
        labelNode.title = formatInfo(info);
        document.body.appendChild(overlayNode);
        counter += 1;
      }
    });
  });

  return counter;
}

/*
*   removeNodes: Use the unique CSS class name supplied to addNodes
*   to remove all instances of the overlay nodes.
*/
function removeNodes (cssClass) {
  let selector = "div." + cssClass;
  let elements = document.querySelectorAll(selector);
  Array.prototype.forEach.call(elements, function (element) {
    document.body.removeChild(element);
  });
}
