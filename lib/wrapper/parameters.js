import maincomponent from "../globals/functions.js";

/**
 * class for handling parameters passed to main modules.
 * @class parameters
 */
export default class parameters extends HTMLElement {
  connectedCallback(
    parent = this.closest(
      "data-mod" || "analyze-mod" || "map-mod" || "visualize-mod"
    )
  ) {
    if (this.parentNode != parent) {
      if (parent) parent.append(this);
      else console.error(this.innerHTML, "NEEDS A PARENT ELEMENT!");
    }
  }
}

maincomponent.registerElement("func-parameters", parameters);
