import mainComponent from "../globals/functions.js";

/**
 * Web component for handling the map module
 * @class mapmod
 */
export default class mapmod extends HTMLElement {
  constructor() {
    //Required super method.
    super();
    let shadow = this.attachShadow({
      mode: "open",
    });
    //Creates a template and attaches the web component to it.
    const template = mainComponent.template("mapmod");
    shadow.appendChild(template.content.cloneNode(true));

    //Appends the attribute slot into the web component so that it can be correctly slotted.
    this.setAttribute("slot", "mapmod");
  }

  /**
   * Async connected callback. All map functions are parsed through here.
   * Please refer to HydroLang's documentation to see the required parameters, arguments,
   * and data required for each function.
   * @callback mapmod
   * @memberof mapmod
   * @example
   * <map-mod method="Layers">
   *    <parameters type="geodata" output="mypoints" geo="Point"></parameters>
   *    <dataset>{"type": "FeatureCollection","features":[{"type": "Feature",
   *      "properties": {"Name":"Vancouver"},"geometry": {"type": "Point",
   *      "coordinates": [-122.34374999999999, 49.32512199104001]}}]}</dataset>
   * </map-mod>
   */
  async connectedCallback() {
    //rendering only open street maps using leaflet right now.
    var props = mainComponent.makePropertiesFromAttributes(this);
    var params = mainComponent.makePropertiesFromParameters(this.children);
    var data = mainComponent.dataListener(this);

    if (props.method === "render") {
      mainComponent.hydro().map.renderMap({ args: params[0] });
    }

    if (props.method === "Layers") {
      try {
        new Promise(() => {
          setTimeout(() => {
            mainComponent.hydro().map.Layers({ args: params[0], data: data });
          }, 1000);
        });
      } catch (error) {
        console.log("No map found in screen! Please render map first.");
      }
    }
  }
}

//Registering the element on the DOM
mainComponent.registerElement("map-mod", mapmod);
