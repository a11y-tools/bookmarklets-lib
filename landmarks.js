/*
*   landmarks.js: highlight ARIA landmarks
*/

import { Bookmarklet }                from './Bookmarklet';
import { InfoObject }                 from './InfoObject';
import { getCssClass, isBookmarklet } from './utils/constants';
import { isDescendantOf }             from './utils/a11y';
import { addPolyfills }               from './utils/utils';

if (isA11yBookmarklet) {
  initLandmarks().run();
}

function initLandmarks () {

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
    {selector: 'aside:not([role]), [role~="complementary"], [role~="COMPLEMENTARY"]',         color: "maroon", label: "complementary"},
    {selector: 'footer, [role~="contentinfo"], [role~="CONTENTINFO"]', filter: isContentinfo, color: "olive",  label: "contentinfo"},
    {selector: '[role~="application"], [role~="APPLICATION"]',                                color: "black",  label: "application"},
    {selector: 'nav, [role~="navigation"], [role~="NAVIGATION"]',                             color: "green",  label: "navigation"},
    {selector: '[role~="region"][aria-labelledby], [role~="REGION"][aria-labelledby]',        color: "teal",   label: "region"},
    {selector: '[role~="region"][aria-label], [role~="REGION"][aria-label]',                  color: "teal",   label: "region"},
    {selector: 'section[aria-labelledby], section[aria-label]',                               color: "teal",   label: "region"},
    {selector: 'header, [role~="banner"], [role~="BANNER"]', filter: isBanner,                color: "gray",   label: "banner"},
    {selector: '[role~="search"], [role~="SEARCH"]',                                          color: "purple", label: "search"},
    {selector: 'main, [role~="main"], [role~="MAIN"]',                                        color: "navy",   label: "main"}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getInfo (element, target) {
    return new InfoObject(element, 'LANDMARK INFO');
  }

  let params = {
    appName:    "Landmarks",
    cssClass:   getCssClass("Landmarks"),
    msgText:    "No elements with ARIA Landmark roles found: <ul>" + selectors + "</ul>",
    targetList: targetList,
    getInfo:    getInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}
