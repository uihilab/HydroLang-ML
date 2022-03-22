import mainComponent from "../globals/functions.js";

/**
 * Web component for handling data module.
 * @class datamod
 */
export default class datamod extends HTMLElement {
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
   * Please refer to HydroLang's documentation to see the required parameters, arguments,
   * and data required for each function.
   * @callback datamod
   * @memberof datamod
   * @example
   * <data-mod method="upload">
   *    <parameters type="CSV" output="myupload"></parameters>
   * </data-mod>
   * @example
   * <data-mod method="download">
   *    <parameters input="object_name"></parameters>
   *    <arguments type="CSV"></arguments>
   * </data-mod>
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
