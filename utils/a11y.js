/*
*   dom.js: functions for getting information about DOM elements
*/

/*
*   isVisible: Recursively check element properties from getComputedStyle
*   until document element is reached, to determine whether element or any
*   of its ancestors has properties set that affect its visibility. Called
*   by addNodes function.
*/
function isVisible(element) {

  function isVisibleRec(el) {
    if (el.nodeType === Node.DOCUMENT_NODE) return true;

    var computedStyle = window.getComputedStyle(el, null);
    var display = computedStyle.getPropertyValue('display');
    var visibility = computedStyle.getPropertyValue('visibility');
    var hidden = el.getAttribute('hidden');
    var ariaHidden = el.getAttribute('aria-hidden');

    if (display === 'none' || visibility === 'hidden' || hidden !== null || ariaHidden === 'true') {
      return false;
    }
    return isVisibleRec(el.parentNode);
  }

  return isVisibleRec(element);
}

/*
*   countChildrenWithTagNames: For the specified DOM element, return the
*   number of its child elements with tagName equal to one of the values
*   in the tagNames array.
*/
function countChildrenWithTagNames(element, tagNames) {
  var count = 0;

  var child = element.firstElementChild;
  while (child) {
    if (tagNames.indexOf(child.tagName) > -1) count += 1;
    child = child.nextElementSibling;
  }

  return count;
}

/*
*   isDescendantOf: Determine whether element is a descendant of any
*   element in the DOM with a tagName in the list of tagNames.
*/
function isDescendantOf(element, tagNames) {
  if (typeof element.closest === 'function') {
    return tagNames.some(function (name) {
      return element.closest(name) !== null;
    });
  }
  return false;
}

/*
*   hasParentWithName: Determine whether element has a parent with
*   tagName in the list of tagNames.
*/
function hasParentWithName(element, tagNames) {
  var parentTagName = element.parentElement.tagName.toLowerCase();
  if (parentTagName) {
    return tagNames.some(function (name) {
      return parentTagName === name;
    });
  }
  return false;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

/*
*   roles.js
*
*   Note: The information in this module is based on the following documents:
*   1. ARIA in HTML (https://specs.webplatform.org/html-aria/webspecs/master/)
*   2. WAI-ARIA 1.1 (http://www.w3.org/TR/wai-aria-1.1/)
*   3. WAI-ARIA 1.0 (http://www.w3.org/TR/wai-aria/)
*/

/*
*   inListOfOptions: Determine whether element is a child of
*   1. a select element
*   2. an optgroup element that is a child of a select element
*   3. a datalist element
*/
function inListOfOptions(element) {
  var parent = element.parentElement,
      parentName = parent.tagName.toLowerCase(),
      parentOfParentName = parent.parentElement.tagName.toLowerCase();

  if (parentName === 'select') return true;

  if (parentName === 'optgroup' && parentOfParentName === 'select') return true;

  if (parentName === 'datalist') return true;

  return false;
}

/*
*   validRoles: Reference list of all concrete ARIA roles as specified in
*   WAI-ARIA 1.1 Working Draft of 14 July 2015
*/
var validRoles = [

// LANDMARK
'application', 'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search',

// WIDGET
'alert', 'alertdialog', 'button', 'checkbox', 'dialog', 'gridcell', 'link', 'log', 'marquee', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'progressbar', 'radio', 'scrollbar', 'searchbox', // ARIA 1.1
'slider', 'spinbutton', 'status', 'switch', // ARIA 1.1
'tab', 'tabpanel', 'textbox', 'timer', 'tooltip', 'treeitem',

// COMPOSITE WIDGET
'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid',

// DOCUMENT STRUCTURE
'article', 'cell', // ARIA 1.1
'columnheader', 'definition', 'directory', 'document', 'group', 'heading', 'img', 'list', 'listitem', 'math', 'none', // ARIA 1.1
'note', 'presentation', 'region', 'row', 'rowgroup', 'rowheader', 'separator', 'table', // ARIA 1.1
'text', // ARIA 1.1
'toolbar'];

/*
*   getValidRole: Examine each value in space-separated list by attempting
*   to find its match in the validRoles array. If a match is found, return
*   it. Otherwise, return null.
*/
function getValidRole(spaceSepList) {
  var arr = spaceSepList.split(' ');

  var _loop = function _loop(i) {
    var value = arr[i].toLowerCase();
    var validRole = validRoles.find(function (role) {
      return role === value;
    });
    if (validRole) return {
        v: validRole
      };
  };

  for (var i = 0; i < arr.length; i++) {
    var _ret = _loop(i);

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  return null;
}

/*
*   getAriaRole: Get the value of the role attribute, if it is present. If
*   not specified, get the default role of element if it has one. Based on
*   ARIA in HTML as of 21 October 2015.
*/
function getAriaRole(element) {
  var tagName = element.tagName.toLowerCase(),
      type = element.type;

  if (element.hasAttribute('role')) {
    return getValidRole(getAttributeValue(element, 'role'));
  }

  switch (tagName) {

    case 'a':
      if (element.hasAttribute('href')) return 'link';
      break;

    case 'area':
      if (element.hasAttribute('href')) return 'link';
      break;

    case 'article':
      return 'article';
    case 'aside':
      return 'complementary';
    case 'body':
      return 'document';
    case 'button':
      return 'button';
    case 'datalist':
      return 'listbox';
    case 'details':
      return 'group';
    case 'dialog':
      return 'dialog';
    case 'dl':
      return 'list';
    case 'fieldset':
      return 'group';

    case 'footer':
      if (!isDescendantOf(element, ['article', 'section'])) return 'contentinfo';
      break;

    case 'form':
      return 'form';

    case 'h1':
      return 'heading';
    case 'h2':
      return 'heading';
    case 'h3':
      return 'heading';
    case 'h4':
      return 'heading';
    case 'h5':
      return 'heading';
    case 'h6':
      return 'heading';

    case 'header':
      if (!isDescendantOf(element, ['article', 'section'])) return 'banner';
      break;

    case 'hr':
      return 'separator';

    case 'img':
      if (!hasEmptyAltText(element)) return 'img';
      break;

    case 'input':
      if (type === 'button') return 'button';
      if (type === 'checkbox') return 'checkbox';
      if (type === 'email') return element.hasAttribute('list') ? 'combobox' : 'textbox';
      if (type === 'image') return 'button';
      if (type === 'number') return 'spinbutton';
      if (type === 'password') return 'textbox';
      if (type === 'radio') return 'radio';
      if (type === 'range') return 'slider';
      if (type === 'reset') return 'button';
      if (type === 'search') return element.hasAttribute('list') ? 'combobox' : 'textbox';
      if (type === 'submit') return 'button';
      if (type === 'tel') return element.hasAttribute('list') ? 'combobox' : 'textbox';
      if (type === 'text') return element.hasAttribute('list') ? 'combobox' : 'textbox';
      if (type === 'url') return element.hasAttribute('list') ? 'combobox' : 'textbox';
      break;

    case 'li':
      if (hasParentWithName(element, ['ol', 'ul'])) return 'listitem';
      break;

    case 'link':
      if (element.hasAttribute('href')) return 'link';
      break;

    case 'main':
      return 'main';

    case 'menu':
      if (type === 'toolbar') return 'toolbar';
      break;

    case 'menuitem':
      if (type === 'command') return 'menuitem';
      if (type === 'checkbox') return 'menuitemcheckbox';
      if (type === 'radio') return 'menuitemradio';
      break;

    case 'meter':
      return 'progressbar';
    case 'nav':
      return 'navigation';
    case 'ol':
      return 'list';

    case 'option':
      if (inListOfOptions(element)) return 'option';
      break;

    case 'output':
      return 'status';
    case 'progress':
      return 'progressbar';
    case 'section':
      return 'region';
    case 'select':
      return 'listbox';
    case 'summary':
      return 'button';

    case 'tbody':
      return 'rowgroup';
    case 'tfoot':
      return 'rowgroup';
    case 'thead':
      return 'rowgroup';

    case 'textarea':
      return 'textbox';

    // TODO: th can have role 'columnheader' or 'rowheader'
    case 'th':
      return 'columnheader';

    case 'ul':
      return 'list';
  }

  return null;
}

/*
*   nameFromIncludesContents: Determine whether the ARIA role of element
*   specifies that its 'name from' includes 'contents'.
*/
function nameFromIncludesContents(element) {
  var elementRole = getAriaRole(element);
  if (elementRole === null) return false;

  var contentsRoles = ['button', 'cell', // ARIA 1.1
  'checkbox', 'columnheader', 'directory', 'gridcell', 'heading', 'link', 'listitem', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'row', 'rowgroup', 'rowheader', 'switch', // ARIA 1.1
  'tab', 'text', // ARIA 1.1
  'tooltip', 'treeitem'];

  var contentsRole = contentsRoles.find(function (role) {
    return role === elementRole;
  });
  return typeof contentsRole !== 'undefined';
}

/*
*   embedded.js
*/

// LOW-LEVEL FUNCTIONS

/*
*   getInputValue: Get current value of 'input' or 'textarea' element.
*/
function getInputValue(element) {
  return normalize(element.value);
}

/*
*   getRangeValue: Get current value of control with role 'spinbutton'
*   or 'slider' (i.e., subclass of abstract 'range' role).
*/
function getRangeValue(element) {
  var value = void 0;

  value = getAttributeValue(element, 'aria-valuetext');
  if (value.length) return value;

  value = getAttributeValue(element, 'aria-valuenow');
  if (value.length) return value;

  return getInputValue(element);
}

// HELPER FUNCTIONS FOR SPECIFIC ROLES

function getTextboxValue(element) {
  var inputTypes = ['email', 'password', 'search', 'tel', 'text', 'url'],
      tagName = element.tagName.toLowerCase(),
      type = element.type;

  if (tagName === 'input' && inputTypes.indexOf(type) !== -1) {
    return getInputValue(element);
  }

  if (tagName === 'textarea') {
    return getInputValue(element);
  }

  return '';
}

function getComboboxValue(element) {
  var inputTypes = ['email', 'search', 'tel', 'text', 'url'],
      tagName = element.tagName.toLowerCase(),
      type = element.type;

  if (tagName === 'input' && inputTypes.indexOf(type) !== -1) {
    return getInputValue(element);
  }

  return '';
}

function getSliderValue(element) {
  var tagName = element.tagName.toLowerCase(),
      type = element.type;

  if (tagName === 'input' && type === 'range') {
    return getRangeValue(element);
  }

  return '';
}

function getSpinbuttonValue(element) {
  var tagName = element.tagName.toLowerCase(),
      type = element.type;

  if (tagName === 'input' && type === 'number') {
    return getRangeValue(element);
  }

  return '';
}

function getListboxValue(element) {
  var tagName = element.tagName.toLowerCase();

  if (tagName === 'select') {
    var arr = [],
        selectedOptions = element.selectedOptions;

    for (var i = 0; i < selectedOptions.length; i++) {
      var option = selectedOptions[i];
      var value = normalize(option.value);
      if (value.length) arr.push(value);
    }

    if (arr.length) return arr.join(' ');
  }

  return '';
}

/*
*   isEmbeddedControl: Determine whether element has a role that corresponds
*   to an HTML form control that could be embedded within text content.
*/
function isEmbeddedControl(element) {
  var embeddedControlRoles = ['textbox', 'combobox', 'listbox', 'slider', 'spinbutton'];
  var role = getAriaRole(element);

  return embeddedControlRoles.indexOf(role) !== -1;
}

/*
*   getEmbeddedControlValue: Based on the role of element, use native semantics
*   of HTML to get the corresponding text value of the embedded control.
*/
function getEmbeddedControlValue(element) {
  var role = getAriaRole(element);

  switch (role) {
    case 'textbox':
      return getTextboxValue(element);

    case 'combobox':
      return getComboboxValue(element);

    case 'listbox':
      return getListboxValue(element);

    case 'slider':
      return getSliderValue(element);

    case 'spinbutton':
      return getSpinbuttonValue(element);
  }

  return '';
}

/*
*   namefrom.js
*/

// LOW-LEVEL FUNCTIONS

/*
*   normalize: Trim leading and trailing whitespace and condense all
*   interal sequences of whitespace to a single space. Adapted from
*   Mozilla documentation on String.prototype.trim polyfill. Handles
*   BOM and NBSP characters.
*/
function normalize(s) {
  var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  return s.replace(rtrim, '').replace(/\s+/g, ' ');
}

/*
*   getAttributeValue: Return attribute value if present on element,
*   otherwise return empty string.
*/
function getAttributeValue(element, attribute) {
  var value = element.getAttribute(attribute);
  return value === null ? '' : normalize(value);
}

/*
*   couldHaveAltText: Based on HTML5 specification, determine whether
*   element could have an 'alt' attribute.
*/
function couldHaveAltText(element) {
  var tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case 'img':
    case 'area':
      return true;
    case 'input':
      return element.type && element.type === 'image';
  }

  return false;
}

/*
*   hasEmptyAltText: Determine whether the alt attribute is present
*   and its value is the empty string.
*/
function hasEmptyAltText(element) {
  var value = element.getAttribute('alt');

  // Attribute is present
  if (value !== null) return normalize(value).length === 0;

  return false;
}

/*
*   isLabelableElement: Based on HTML5 specification, determine whether
*   element can be associated with a label.
*/
function isLabelableElement(element) {
  var tagName = element.tagName.toLowerCase(),
      type = element.type;

  switch (tagName) {
    case 'input':
      return type !== 'hidden';
    case 'button':
    case 'keygen':
    case 'meter':
    case 'output':
    case 'progress':
    case 'select':
    case 'textarea':
      return true;
    default:
      return false;
  }
}

/*
*   addCssGeneratedContent: Add CSS-generated content for pseudo-elements
*   :before and :after. According to the CSS spec, test that content value
*   is other than the default computed value of 'none'.
*
*   Note: Even if an author specifies content: 'none', because browsers add
*   the double-quote character to the beginning and end of computed string
*   values, the result cannot and will not be equal to 'none'.
*/
function addCssGeneratedContent(element, contents) {
  var result = contents,
      prefix = getComputedStyle(element, ':before').content,
      suffix = getComputedStyle(element, ':after').content;

  if (prefix !== 'none') result = prefix + result;
  if (suffix !== 'none') result = result + suffix;

  return result;
}

/*
*   getNodeContents: Recursively process element and text nodes by aggregating
*   their text values for an ARIA text equivalent calculation.
*   1. This includes special handling of elements with 'alt' text and embedded
*      controls.
*   2. The forElem parameter is needed for label processing to avoid inclusion
*      of an embedded control's value when the label is for the control itself.
*/
function getNodeContents(node, forElem) {
  var contents = '';

  if (node === forElem) return '';

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      if (couldHaveAltText(node)) {
        contents = getAttributeValue(node, 'alt');
      } else if (isEmbeddedControl(node)) {
        contents = getEmbeddedControlValue(node);
      } else {
        if (node.hasChildNodes()) {
          var children = node.childNodes,
              arr = [];

          for (var i = 0; i < children.length; i++) {
            var nc = getNodeContents(children[i], forElem);
            if (nc.length) arr.push(nc);
          }

          contents = arr.length ? arr.join(' ') : '';
        }
      }
      // For all branches of the ELEMENT_NODE case...
      contents = addCssGeneratedContent(node, contents);
      break;

    case Node.TEXT_NODE:
      contents = normalize(node.textContent);
  }

  return contents;
}

/*
*   getElementContents: Construct the ARIA text alternative for element by
*   processing its element and text node descendants and then adding any CSS-
*   generated content if present.
*/
function getElementContents(element, forElement) {
  var result = '';

  if (element.hasChildNodes()) {
    var children = element.childNodes,
        arrayOfStrings = [];

    for (var i = 0; i < children.length; i++) {
      var contents = getNodeContents(children[i], forElement);
      if (contents.length) arrayOfStrings.push(contents);
    }

    result = arrayOfStrings.length ? arrayOfStrings.join(' ') : '';
  }

  return addCssGeneratedContent(element, result);
}

/*
*   getContentsOfChildNodes: Using predicate function for filtering element
*   nodes, collect text content from all child nodes of element.
*/
function getContentsOfChildNodes(element, predicate) {
  var arr = [],
      content = void 0;

  Array.prototype.forEach.call(element.childNodes, function (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        if (predicate(node)) {
          content = getElementContents(node);
          if (content.length) arr.push(content);
        }
        break;
      case Node.TEXT_NODE:
        content = normalize(node.textContent);
        if (content.length) arr.push(content);
        break;
    }
  });

  if (arr.length) return arr.join(' ');
  return '';
}

// HIGHER-LEVEL FUNCTIONS THAT RETURN AN OBJECT WITH SOURCE PROPERTY

/*
*   nameFromAttribute
*/
function nameFromAttribute(element, attribute) {
  var name = void 0;

  name = getAttributeValue(element, attribute);
  if (name.length) return { name: name, source: attribute };

  return null;
}

/*
*   nameFromAltAttribute
*/
function nameFromAltAttribute(element) {
  var name = element.getAttribute('alt');

  // Attribute is present
  if (name !== null) {
    name = normalize(name);
    return name.length ? { name: name, source: 'alt' } : { name: '<empty>', source: 'alt' };
  }

  // Attribute not present
  return null;
}

/*
*   nameFromContents
*/
function nameFromContents(element) {
  var name = void 0;

  name = getElementContents(element);
  if (name.length) return { name: name, source: 'contents' };

  return null;
}

/*
*   nameFromDefault
*/
function nameFromDefault(name) {
  return name.length ? { name: name, source: 'default' } : null;
}

/*
*   nameFromDescendant
*/
function nameFromDescendant(element, tagName) {
  var descendant = element.querySelector(tagName);
  if (descendant) {
    var name = getElementContents(descendant);
    if (name.length) return { name: name, source: tagName + ' element' };
  }

  return null;
}

/*
*   nameFromLabelElement
*/
function nameFromLabelElement(element) {
  var name = void 0,
      label = void 0;

  // label [for=id]
  if (element.id) {
    label = document.querySelector('[for="' + element.id + '"]');
    if (label) {
      name = getElementContents(label, element);
      if (name.length) return { name: name, source: 'label reference' };
    }
  }

  // label encapsulation
  if (typeof element.closest === 'function') {
    label = element.closest('label');
    if (label) {
      name = getElementContents(label, element);
      if (name.length) return { name: name, source: 'label encapsulation' };
    }
  }

  return null;
}

/*
*   nameFromDetailsOrSummary: If element is expanded (has open attribute),
*   return the contents of the summary element followed by the text contents
*   of element and all of its non-summary child elements. Otherwise, return
*   only the contents of the first summary element descendant.
*/
function nameFromDetailsOrSummary(element) {
  var name = void 0,
      summary = void 0;

  function isExpanded(elem) {
    return elem.hasAttribute('open');
  }

  // At minimum, always use summary contents
  summary = element.querySelector('summary');
  if (summary) name = getElementContents(summary);

  // Return either summary + details (non-summary) or summary only
  if (isExpanded(element)) {
    name += getContentsOfChildNodes(element, function (elem) {
      return elem.tagName.toLowerCase() !== 'summary';
    });
    if (name.length) return { name: name, source: 'contents' };
  } else {
    if (name.length) return { name: name, source: 'summary element' };
  }

  return null;
}

/*
*   getaccname.js
*
*   Note: Information in this module is based on the following documents:
*   1. HTML Accessibility API Mappings 1.0 (http://rawgit.com/w3c/aria/master/html-aam/html-aam.html)
*   2. SVG Accessibility API Mappings (http://rawgit.com/w3c/aria/master/svg-aam/svg-aam.html)
*/

/*
*   getFieldsetLegendLabels: Recursively collect legend contents of
*   fieldset ancestors, starting with the closest (innermost).
*   Return collection as a possibly empty array of strings.
*/
function getFieldsetLegendLabels(element) {
  var arrayOfStrings = [];

  if (typeof element.closest !== 'function') {
    return arrayOfStrings;
  }

  function getLabelsRec(elem, arr) {
    var fieldset = elem.closest('fieldset');

    if (fieldset) {
      var legend = fieldset.querySelector('legend');
      if (legend) {
        var text = getElementContents(legend);
        if (text.length) {
          arr.push({ name: text, source: 'fieldset/legend' });
        }
      }
      // process ancestors
      getLabelsRec(fieldset.parentNode, arr);
    }
  }

  getLabelsRec(element, arrayOfStrings);
  return arrayOfStrings;
}

/*
*   getGroupingLabels: Return an array of grouping label objects for
*   element, each with two properties: 'name' and 'source'.
*/
function getGroupingLabels(element) {
  // We currently only handle labelable elements as defined in HTML 5.1
  if (isLabelableElement(element)) {
    return getFieldsetLegendLabels(element);
  }

  return [];
}

/*
*   nameFromNativeSemantics: Use method appropriate to the native semantics
*   of element to find accessible name. Includes methods for all interactive
*   elements. For non-interactive elements, if the element's ARIA role allows
*   its acc. name to be derived from its text contents, or if recFlag is set,
*   indicating that we are in a recursive aria-labelledby calculation, the
*   nameFromContents method is used.
*/
function nameFromNativeSemantics(element, recFlag) {
  var tagName = element.tagName.toLowerCase(),
      ariaRole = getAriaRole(element),
      accName = null;

  // TODO: Verify that this applies to all elements
  if (ariaRole && (ariaRole === 'presentation' || ariaRole === 'none')) {
    return null;
  }

  switch (tagName) {
    // FORM ELEMENTS: INPUT
    case 'input':
      switch (element.type) {
        // HIDDEN
        case 'hidden':
          if (recFlag) {
            accName = nameFromLabelElement(element);
          }
          break;

        // TEXT FIELDS
        case 'email':
        case 'password':
        case 'search':
        case 'tel':
        case 'text':
        case 'url':
          accName = nameFromLabelElement(element);
          if (accName === null) accName = nameFromAttribute(element, 'placeholder');
          break;

        // OTHER INPUT TYPES
        case 'button':
          accName = nameFromAttribute(element, 'value');
          break;

        case 'reset':
          accName = nameFromAttribute(element, 'value');
          if (accName === null) accName = nameFromDefault('Reset');
          break;

        case 'submit':
          accName = nameFromAttribute(element, 'value');
          if (accName === null) accName = nameFromDefault('Submit');
          break;

        case 'image':
          accName = nameFromAltAttribute(element);
          if (accName === null) accName = nameFromAttribute(element, 'value');
          break;

        default:
          accName = nameFromLabelElement(element);
          break;
      }
      break;

    // FORM ELEMENTS: OTHER
    case 'button':
      accName = nameFromContents(element);
      break;

    case 'label':
      accName = nameFromContents(element);
      break;

    case 'keygen':
    case 'meter':
    case 'output':
    case 'progress':
    case 'select':
      accName = nameFromLabelElement(element);
      break;

    case 'textarea':
      accName = nameFromLabelElement(element);
      if (accName === null) accName = nameFromAttribute(element, 'placeholder');
      break;

    // EMBEDDED ELEMENTS
    case 'audio':
      // if 'controls' attribute is present
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    case 'embed':
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    case 'iframe':
      accName = nameFromAttribute(element, 'title');
      break;

    case 'img':
    case 'area':
      // added
      accName = nameFromAltAttribute(element);
      break;

    case 'object':
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    case 'svg':
      // added
      accName = nameFromDescendant(element, 'title');
      break;

    case 'video':
      // if 'controls' attribute is present
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    // OTHER ELEMENTS
    case 'a':
      accName = nameFromContents(element);
      break;

    case 'details':
      accName = nameFromDetailsOrSummary(element);
      break;

    case 'figure':
      accName = nameFromDescendant(element, 'figcaption');
      break;

    case 'table':
      accName = nameFromDescendant(element, 'caption');
      break;

    // ELEMENTS NOT SPECIFIED ABOVE
    default:
      if (nameFromIncludesContents(element) || recFlag) accName = nameFromContents(element);
      break;
  }

  // LAST RESORT USE TITLE
  if (accName === null) accName = nameFromAttribute(element, 'title');

  return accName;
}

/*
*   nameFromAttributeIdRefs: Get the value of attrName on element (a space-
*   separated list of IDREFs), visit each referenced element in the order it
*   appears in the list and obtain its accessible name (skipping recursive
*   aria-labelledby or aria-describedby calculations), and return an object
*   with name property set to a string that is a space-separated concatena-
*   tion of those results if any, otherwise return null.
*/
function nameFromAttributeIdRefs(element, attribute) {
  var value = getAttributeValue(element, attribute);
  var idRefs = void 0,
      i = void 0,
      refElement = void 0,
      accName = void 0,
      arr = [];

  if (value.length) {
    idRefs = value.split(' ');

    for (i = 0; i < idRefs.length; i++) {
      refElement = document.getElementById(idRefs[i]);
      if (refElement) {
        accName = getAccessibleName(refElement, true);
        if (accName && accName.name.length) arr.push(accName.name);
      }
    }
  }

  if (arr.length) return { name: arr.join(' '), source: attribute };

  return null;
}

/*
*   getAccessibleName: Use the ARIA Roles Model specification for accessible
*   name calculation based on its precedence order:
*   (1) Use aria-labelledby, unless a traversal is already underway;
*   (2) Use aria-label attribute value;
*   (3) Use whatever method is specified by the native semantics of the
*   element, which includes, as last resort, use of the title attribute.
*/
function getAccessibleName(element, recFlag) {
  var accName = null;

  if (!recFlag) accName = nameFromAttributeIdRefs(element, 'aria-labelledby');
  if (accName === null) accName = nameFromAttribute(element, 'aria-label');
  if (accName === null) accName = nameFromNativeSemantics(element, recFlag);

  return accName;
}

/*
*   getAccessibleDesc: Use the ARIA Roles Model specification for accessible
*   description calculation based on its precedence order:
*   (1) Use aria-describedby, unless a traversal is already underway;
*   (2) As last resort, use the title attribute.
*/
function getAccessibleDesc(element, recFlag) {
  var accDesc = null;

  if (!recFlag) accDesc = nameFromAttributeIdRefs(element, 'aria-describedby');
  if (accDesc === null) accDesc = nameFromAttribute(element, 'title');

  return accDesc;
}

// index.js

// getaccname
// namefrom
// roles
// dom

export { getGroupingLabels, getAccessibleName, getAccessibleDesc, getAttributeValue, isLabelableElement, getAriaRole, isVisible, countChildrenWithTagNames, isDescendantOf };
