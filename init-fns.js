/*
*   init.js: init functions for bookmarklets
*/

import { Bookmarklet }  from './Bookmarklet';
import { InfoObject }   from './InfoObject';
import { getCssClass }  from './utils/constants';
import { addPolyfills } from './utils/utils';

/*
*   initForms
*/

export function initForms () {

  addPolyfills();

  let targetList = [
    {selector: 'button',   color: 'purple', label: 'button'},
    {selector: 'input',    color: 'navy',   label: 'input'},
    {selector: 'keygen',   color: 'gray',   label: 'keygen'},
    {selector: 'meter',    color: 'maroon', label: 'meter'},
    {selector: 'output',   color: 'teal',   label: 'output'},
    {selector: 'progress', color: 'olive',  label: 'progress'},
    {selector: 'select',   color: 'green',  label: 'select'},
    {selector: 'textarea', color: 'brown',  label: 'textarea'}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getInfo (element, target) {
    return new InfoObject(element, 'FORM INFO');
  }

  let params = {
    appName:    'Forms',
    cssClass:   getCssClass('Forms'),
    msgText:    'No form-related elements found: <ul>' + selectors + '</ul>',
    targetList: targetList,
    getInfo:    getInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}

/*
*   headings.js: highlight heading elements
*/

export function initHeadings () {

  addPolyfills();

  let targetList = [
    {selector: 'h1', color: 'navy',   label: 'h1'},
    {selector: 'h2', color: 'olive',  label: 'h2'},
    {selector: 'h3', color: 'purple', label: 'h3'},
    {selector: 'h4', color: 'green',  label: 'h4'},
    {selector: 'h5', color: 'gray',   label: 'h5'},
    {selector: 'h6', color: 'brown',  label: 'h6'}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let info = new InfoObject(element, 'HEADING INFO');
    info.addProps('level ' + target.label.substring(1));
    return info;
  }

  let params = {
    appName:    'Headings',
    cssClass:   getCssClass('Headings'),
    msgText:    'No heading elements (' + selectors + ') found.',
    targetList: targetList,
    getInfo:    getInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}

/*
*   initImages
*/

export function initImages () {

  addPolyfills();

  let targetList = [
    {selector: 'area', color: 'teal',   label: 'area'},
    {selector: 'img',  color: 'olive',  label: 'img'},
    {selector: 'svg',  color: 'purple', label: 'svg'}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    return new InfoObject(element, 'IMAGE INFO');
  }

  let params = {
    appName:    'Images',
    cssClass:   getCssClass('Images'),
    msgText:    'No image elements (' + selectors + ') found.',
    targetList: targetList,
    getInfo:    getInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}

/*
*   initInteractive
*/

/*
*   Interactive elements as defined by HTML5:
*   From 'HTML5 3. Semantics, structure, and APIs of HTML documents'
*   http://www.w3.org/TR/html5/dom.html#interactive-content
*
*   a, audio[controls], button, embed, iframe, img[usemap],
*   input (type not in hidden state), keygen, label,
*   object[usemap], select, textarea, video[controls]
*/

export function initInteractive () {

  addPolyfills();

  let targetList = [
    // interactive elements defined in HTML5 spec
    {selector: 'a',                    color: 'olive',  label: 'a'},
    {selector: 'audio[controls]',      color: 'olive',  label: 'audio'},
    {selector: 'button',               color: 'olive',  label: 'button'},
    {selector: 'embed',                color: 'purple', label: 'embed'},
    {selector: 'iframe',               color: 'teal',   label: 'iframe'},
    {selector: 'img[usemap]',          color: 'maroon', label: 'img'},
    {selector: 'input',                color: 'navy',   label: 'input'},
    {selector: 'keygen',               color: 'teal',   label: 'keygen'},
    {selector: 'label',                color: 'purple', label: 'label'},
    {selector: 'object[usemap]',       color: 'gray',   label: 'object'},
    {selector: 'select',               color: 'green',  label: 'select'},
    {selector: 'textarea',             color: 'navy',   label: 'textarea'},
    {selector: 'video[controls]',      color: 'navy',   label: 'video'},

    // other form elements
    {selector: 'meter',                color: 'maroon', label: 'meter'},
    {selector: 'output',               color: 'brown',  label: 'output'},
    {selector: 'progress',             color: 'gray',   label: 'progress'},

    // other elements potentially interactive
    {selector: 'area',                 color: 'brown',  label: 'area'},
    {selector: 'details',              color: 'purple', label: 'details'},
    {selector: 'svg',                  color: 'green',  label: 'svg'},
    {selector: '[tabindex]',           color: 'teal',   label: 'tabindex'}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    return new InfoObject(element, 'INTERACTIVE INFO');
  }

  function evalInfo (info, target) {
    target.color = (info.accName === null) ? 'maroon' : '#008080';
  }

  let params = {
    appName:    'Interactive',
    cssClass:   getCssClass('Interactive'),
    msgText:    'No interactive elements (' + selectors + ') found.',
    targetList: targetList,
    getInfo:    getInfo,
    evalInfo:   evalInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}

/*
*   initLandmarks
*/

import { isDescendantOf } from './utils/a11y';

export function initLandmarks () {

  addPolyfills();

  // Filter function called on a list of elements returned by selector
  // 'footer, [role="contentinfo"]'. It returns true for the following
  // conditions: (1) element IS NOT a footer element; (2) element IS a
  // footer element AND IS NOT a descendant of article or section.
  function isContentinfo (element) {
    if (element.tagName.toLowerCase() !== 'footer') return true;
    if (!isDescendantOf(element, ['article', 'section'])) return true;
    return false;
  }

  // Filter function called on a list of elements returned by selector
  // 'header, [role="banner"]'. It returns true for the following
  // conditions: (1) element IS NOT a header element; (2) element IS a
  // header element AND IS NOT a descendant of article or section.
  function isBanner (element) {
    if (element.tagName.toLowerCase() !== 'header') return true;
    if (!isDescendantOf(element, ['article', 'section'])) return true;
    return false;
  }

  let targetList = [
    {selector: 'aside:not([role]), [role~="complementary"], [role~="COMPLEMENTARY"]',         color: 'maroon', label: 'complementary'},
    {selector: 'footer, [role~="contentinfo"], [role~="CONTENTINFO"]', filter: isContentinfo, color: 'olive',  label: 'contentinfo'},
    {selector: '[role~="application"], [role~="APPLICATION"]',                                color: 'black',  label: 'application'},
    {selector: 'nav, [role~="navigation"], [role~="NAVIGATION"]',                             color: 'green',  label: 'navigation'},
    {selector: '[role~="region"][aria-labelledby], [role~="REGION"][aria-labelledby]',        color: 'teal',   label: 'region'},
    {selector: '[role~="region"][aria-label], [role~="REGION"][aria-label]',                  color: 'teal',   label: 'region'},
    {selector: 'section[aria-labelledby], section[aria-label]',                               color: 'teal',   label: 'region'},
    {selector: 'header, [role~="banner"], [role~="BANNER"]', filter: isBanner,                color: 'gray',   label: 'banner'},
    {selector: '[role~="search"], [role~="SEARCH"]',                                          color: 'purple', label: 'search'},
    {selector: 'main, [role~="main"], [role~="MAIN"]',                                        color: 'navy',   label: 'main'}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getInfo (element, target) {
    return new InfoObject(element, 'LANDMARK INFO');
  }

  let params = {
    appName:    'Landmarks',
    cssClass:   getCssClass('Landmarks'),
    msgText:    'No elements with ARIA Landmark roles found: <ul>' + selectors + '</ul>',
    targetList: targetList,
    getInfo:    getInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}

/*
*   initLists
*/

import { countChildrenWithTagNames } from './utils/a11y';

export function initLists () {

  addPolyfills();

  let targetList = [
    {selector: 'dl', color: 'olive',  label: 'dl'},
    {selector: 'ol', color: 'purple', label: 'ol'},
    {selector: 'ul', color: 'navy',   label: 'ul'}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let listCount;

    switch (target.label) {
      case 'dl':
        listCount = countChildrenWithTagNames(element, ['DT', 'DD']);
        break;
      case 'ol':
      case 'ul':
        listCount = countChildrenWithTagNames(element, ['LI']);
        break;
    }

    let info = new InfoObject(element, 'LIST INFO');
    info.addProps(listCount + ' items');
    return info;
  }

  let params = {
    appName:    'Lists',
    cssClass:   getCssClass('Lists'),
    msgText:    'No list elements (' + selectors + ') found.',
    targetList: targetList,
    getInfo:    getInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}
