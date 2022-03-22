//Importing the functionalities of the mainComponent.
import mainComponent from "../globals/functions.js";

/**
 * Web component for handling visualize module.
 * @class visualizemod
 */
export default class visualizemod extends HTMLElement {
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
   * Main driver for running the visualize module. Saves data in the local storage.
   * Please refer to HydroLang's documentation to see the required parameters, arguments,
   * and data required for each function.
   * @callback visualizemod
   * @memberof visualizemod
   * @example
   * <visualize-mod method="draw">
   *    <parameters type="chart" name="Example1"></parameters>
   *    <arguments charttype="line"></arguments>
   *    <dataset>[[0,1,2,3,4,5,6,7,8,9,10],[0.1,2,0.52,0.2,0.69,8,98,8,10,11,5], [10,11,12,13,14,15,16,17,18,19,110]]</dataset>
   * </visualize-mod>
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
