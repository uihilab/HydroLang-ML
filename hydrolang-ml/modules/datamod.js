import mainComponent from "../globals/functions.js";

/**
 * Web component for handling data module.
 * @class datamod
 */
export default class datamod extends HTMLElement {
  /**
   * Constructor that deals with the inputs from each slotted event.
   * Requires methods from the mainComponent function.
   * @constructor
   * @memberof datamod
   */
  constructor() {
    //Required super method.
    super();
    let shadow = this.attachShadow({
      mode: "closed",
    });
    //Creation of the template holding the web component.
    const template = mainComponent.template("datamod");
    shadow.append(template.content.cloneNode(true));

    //Appends the attribute slot into the web component so that it can be correctly slotted.
    this.setAttribute("slot", "datamod");
  }

  /**
   * Async connected callback. All data functions are parsed through here.
   * @callback datamod~connectedCallback
   * @param {} - No parameters, creates properties, parameters and data from screen.
   * @memberof datamod
   */

  async connectedCallback() {
    var props = mainComponent.makePropertiesFromAttributes(this);
    var params = mainComponent.makePropertiesFromParameters(this.children);
    var data = mainComponent.dataListener(this);

    if (!["save", "clear"].includes(props.method)) {
      //if method is directly attributable to hydrolang.js (retrieve, transform, upload, download)
      var results = mainComponent
        .hydro()
        .data[props.method]({ params: params[0], args: params[1], data: data });
      mainComponent.pushresults(params[0].output, await results, "local");

      //if method is attributable solely to hydrolang-ml
    } else {
      mainComponent.LocalStore({
        name: params[0].output,
        value: data,
        type: props.method,
      });
    }
  }
}

//Registering the element on the DOM
mainComponent.registerElement("data-mod", datamod);
