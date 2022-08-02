import mainComponent from "../globals/functions.js";

/**
 * Web component for handling the analyze module of HydroLang.
 * @class analyzemod
 */

export default class analyzemod extends HTMLElement {
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
   * Main function for the analyze module. Please refer to HydroLang's documentation to see the required parameters, arguments,
   * and data required for each function.
   * @callback analyzemod
   * @memberof analyzemod
   * @example
   * <analyze-mod component="stats" method="basicstats">
   *    <parameters output="basic_stats_example"></parameters>
   *    <dataset>[40,29,40,50,30,291]</dataset>
   * </analyze-mod>
   * @example
   * <analyze-mod component="hydro" method="syntheticalc">
   *    <parameters type="SCS" unit="si" output="synthetic_calc"></parameters>
   *    <arguments L="4000" slope="10" cn="82"></arguments>
   * </analyze-mod>
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
