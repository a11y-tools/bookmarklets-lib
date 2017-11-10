/*
*   interactive.js: highlight all interactive elements
*/

import { Bookmarklet }  from './Bookmarklet';
import { InfoObject }   from './InfoObject';
import { getCssClass }  from './utils/constants';
import { addPolyfills } from './utils/utils';

if (isA11yBookmarklet) {
  initInteractive().run()
}

/*
*   Interactive elements as defined by HTML5:
*   From 'HTML5 3. Semantics, structure, and APIs of HTML documents'
*   http://www.w3.org/TR/html5/dom.html#interactive-content
*
*   a, audio[controls], button, embed, iframe, img[usemap],
*   input (type not in hidden state), keygen, label,
*   object[usemap], select, textarea, video[controls]
*/

function initInteractive () {

  addPolyfills();

  let targetList = [
    // interactive elements defined in HTML5 spec
    {selector: "a",                    color: "olive",  label: "a"},
    {selector: "audio[controls]",      color: "olive",  label: "audio"},
    {selector: "button",               color: "olive",  label: "button"},
    {selector: "embed",                color: "purple", label: "embed"},
    {selector: "iframe",               color: "teal",   label: "iframe"},
    {selector: "img[usemap]",          color: "maroon", label: "img"},
    {selector: "input",                color: "navy",   label: "input"},
    {selector: "keygen",               color: "teal",   label: "keygen"},
    {selector: "label",                color: "purple", label: "label"},
    {selector: "object[usemap]",       color: "gray",   label: "object"},
    {selector: "select",               color: "green",  label: "select"},
    {selector: "textarea",             color: "navy",   label: "textarea"},
    {selector: "video[controls]",      color: "navy",   label: "video"},

    // other form elements
    {selector: "meter",                color: "maroon", label: "meter"},
    {selector: "output",               color: "brown",  label: "output"},
    {selector: "progress",             color: "gray",   label: "progress"},

    // other elements potentially interactive
    {selector: "area",                 color: "brown",  label: "area"},
    {selector: "details",              color: "purple", label: "details"},
    {selector: "svg",                  color: "green",  label: "svg"},
    {selector: "[tabindex]",           color: "teal",   label: "tabindex"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    return new InfoObject(element, 'INTERACTIVE INFO');
  }

  function evalInfo (info, target) {
    target.color = (info.accName === null) ? 'maroon' : '#008080';
  }

  let params = {
    appName:    "Interactive",
    cssClass:   getCssClass("Interactive"),
    msgText:    "No interactive elements (" + selectors + ") found.",
    targetList: targetList,
    getInfo:    getInfo,
    evalInfo:   evalInfo,
    dndFlag:    true
  };

  return new Bookmarklet(params);
}
