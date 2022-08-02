import mainComponent from "../globals/functions.js";

/**
 * Main class driver for the HydroLang.js components
 * @class hydrolangml
 */
export default class hydrolangml extends HTMLElement {
  //Attaches elements and hears slot exchange.
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: "open",
    });

    const template = mainComponent.template("hydrolangml");
    shadow.appendChild(template.content.cloneNode(true));
  }
}

//Registering the element on the DOM
mainComponent.registerElement("hydrolang-ml", hydrolangml);
