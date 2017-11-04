/*
*   InfoObject.js
*/

import { getAccessibleName, getAccessibleDesc, getGroupingLabels, getAriaRole } from './utils/a11y';
import { getElementInfo } from './utils/info';
export { InfoObject };

/*
*  nameIncludesDescription: Determine whether accName object's name
*  property includes the accDesc object's name property content.
*/
function nameIncludesDescription (accName, accDesc) {
  if (accName === null || accDesc === null) return false;

  let name = accName.name, desc = accDesc.name;
  if (typeof name === 'string' && typeof desc === 'string') {
    return name.toLowerCase().includes(desc.toLowerCase());
  }

  return false;
}

function InfoObject (element, title) {
  this.title     = title;
  this.element   = getElementInfo(element);
  this.grpLabels = getGroupingLabels(element);
  this.accName   = getAccessibleName(element);
  this.accDesc   = getAccessibleDesc(element);
  this.role      = getAriaRole(element);

  // Ensure that accessible description is not a duplication
  // of accessible name content. If it is, nullify the desc.
  if (nameIncludesDescription (this.accName, this.accDesc)) {
    this.accDesc = null;
  }
}

InfoObject.prototype.addProps = function (val) {
  this.props = val;
}
