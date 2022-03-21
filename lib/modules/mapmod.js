import mainComponent from "../globals/functions.js";

/**
 * Web component for handling the map module
 * @class mapmod
 */
export default class mapmod extends HTMLElement {
  /**
   * Constructor to open the shadow DOM and creating a template for the component.
   * @constructor
   * @memberof mapmod
   */
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
   * @callback mapmod~connectedCallback
   * @param {} - No parameters, creates properties, parameters and data from screen.
   * @memberof mapmod
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
