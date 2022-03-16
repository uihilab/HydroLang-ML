//Importing the functionalities of the mainComponent.
import mainComponent from "../globals/functions.js";

/**
 * Web component for handling visualize module.
 * @module visualizemod
 */
export default class visualizemod extends HTMLElement {
  /**
   * Constructor to open the shadow DOM and creating a template for the component.
   * Requires methods from the mainComponent function.
   * @constructor
   * @memberof visualizemod
   */
  constructor() {
    //Required super method.
    super();
    let shadow = this.attachShadow({
      mode: "open",
    });
    //Creation of the template holding the web component.
    const template = mainComponent.template("visualizemod");
    shadow.append(template.content.cloneNode(true));

    //Appends the attribute slot into the web component so that it can be correctly slotted.
    this.setAttribute("slot", "visualizemod");
  }

  /**
   * Function dealing with the inputs passed as data or attributes by the user.
   * @callback visualizemod~connectedCallback
   * @param {} - No parameters, creates properties, parameters and data from screen.
   * @memberof visualizemod
   */
  async connectedCallback() {
    //Main constructor of properties, parameters, attributes, and data
    var props = mainComponent.makePropertiesFromAttributes(this);
    var params = mainComponent.makePropertiesFromParameters(this.children);
    var data = mainComponent.dataListener(this);

    //HydroLang library caller
    mainComponent
      .hydro()
      .visualize[props.method]({
        params: params[0],
        args: params[1],
        data: await data,
      });
  }
}

//Registering the element on the DOM
mainComponent.registerElement("visualize-mod", visualizemod);
