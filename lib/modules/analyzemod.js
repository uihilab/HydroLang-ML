import mainComponent from "../globals/functions.js";

/**
 * Web component for handling the analyze module of HydroLang.
 * @class analyzemod
 */

export default class analyzemod extends HTMLElement {
  /**
   * Main constructor for the analyze module. Handles the data inputs and performs calculations accordingly.
   * @constructor
   * @memberof analyzemod
   */
  constructor() {
    super();
    let shadow = this.attachShadow({
      mode: "open",
    });
    const template = mainComponent.template("datamod");
    shadow.appendChild(template.content.cloneNode(true));

    //Appends the attribute slot into the web component so that it can be correctly slotted.
    this.setAttribute("slot", "analyzemod");
  }

  /**
   * Async connected callback. All analyze functions are parsed through here.
   * @callback analyzemod~connectedCallback
   * @param {} - No parameters, creates properties, parameters and data from screen.
   * @memberof analyzemod
   */
  async connectedCallback() {
    var props = mainComponent.makePropertiesFromAttributes(this);
    var params = mainComponent.makePropertiesFromParameters(this.children);
    var data = mainComponent.dataListener(this);

    var res = mainComponent
      .hydro()
      .analyze[props.component][props.method]({
        params: params[0],
        args: params[1],
        data: data,
      });
    mainComponent.pushresults(params[0].output, await res, "local");
  }
}

//Registering the element on the DOM
mainComponent.registerElement("analyze-mod", analyzemod);
