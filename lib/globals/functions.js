import { Hydro, Cookie, Local, Component } from "./globals.js";

/**
 * Main class with functions used throughout all the components created.
 * Used for registering the elements into the DOM.
 * @class mainComponent
 */
export default class mainComponent extends HTMLElement {
  /**
   * Observer of keys for each property of the web component.
   * @method observedAttributes
   * @memberof mainComponent
   * @param {Element} mod - Component element to get the observed attributes from.
   * @returns {Object} Array with the attributes acceptable for the component.
   */

  static observedAttributes(mod) {
    return mod.getAttributeNames();
  }

  /**
   * Used for calling the HydroLang instance from the global container.
   * @method hydro
   * @memberof mainComponent
   * @returns {Object} HydroLang instance
   * @example mainComponent.hydro()
   */

  static hydro() {
    return Hydro.ins();
  }

  /**
   * Creates a new template to attach a component into.
   * @method template
   * @memberof mainComponent
   * @param {Element} mod - Component to create templates to.
   * @example mainComponent.template(someComponent)
   * @returns {Element} template with slot to attach new web components
   */

  static template(mod) {
    const template = document.createElement("template");
    const diver = (name) => {
      if (!document.querySelector(`.${name}`)) {
        var div = document.createElement("div");
        div.className = name;
        document.getElementById("hydrolang").appendChild(div);
      } else {
        return;
      }
    };
    if (mod === "hydrolangml") {
      //Templates for web component container
      template.id = "hydrolang";
      template.innerHTML = `
            <slot name="visualizemod"></slot>
            <slot name="analyzemod"></slot>
            <slot name="datamod"></slot>
            <slot name="mapmod"></slot>
        `;
      return template;
    }
    if (mod === "analyzemod") {
      diver("analyze");
      //No templating for the web components.
      template.id = "analyze";
      template.innerHTML = `
            `;
    }
    if (mod === "visualizemod") {
      diver("visualize");
      template.id = "visualize";
      template.innerHTML = `
            `;
    }
    if (mod === "mapmod") {
      diver("maps");
      template.id = "maps";
      template.innerHTML = `
            `;
    }
    if (mod === "datamod") {
      diver("data");
      template.id = "data";
      template.innerHTML = `
            `;
    }
    return template;
  }

  /**
   * Checks if an object is empty.
   * @method isEmpty
   * @memberof mainComponent
   * @param {Object} Obj - Required object for search.
   * @example mainComponent.isEmpty(obj)
   * @returns {Boolean} True if an object does not have any object.
   */

  static isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  /**
   * Creates an object of parameters from the properties of a component.
   * @method makePropertiesFromParameters
   * @memberof mainComponent
   * @param {String} elem - Name of slot element attached as node into a component.
   * @example mainComponent.makePropertiesFromParameters('someName')
   * @returns {Object} attributes consolidated in an object.
   */

  static makePropertiesFromParameters(elem) {
    let attr = [];
    var names = [];
    for (var i = 0; i < elem.length; i++) {
      var props = {};
      names.push(elem[i].getAttributeNames());
      for (var j = 0; j < names[i].length; j++) {
        var prop = names[i][j];
        props[prop] = elem[i].getAttribute(prop);
      }
      attr.push(props);
    }

    //In case there are numbers inside the objects.
    if (elem[0].parentElement.nodeName === "DATA-MOD") {
      return attr;
    } else {
      return this.convertIntObj(attr);
    }
  }

  /**
   * Creates an object of properties from attributes of a component.
   * @method makePropertiesFromAttributes
   * @memberof mainComponent
   * @param {Element} emod - Web component element.
   * @example mainComponent.makePropertiesFromAttributes(someComponent)
   * @returns {Object} properties of objects from allowable attributes.
   */

  static makePropertiesFromAttributes(mod) {
    let attr = this.observedAttributes(mod);
    if (!attr) return null;
    var props = {};

    for (var i = 0; i < attr.length; i++) {
      var prop = attr[i];
      props[prop] = mod.getAttribute(attr[i]);
    }
    return props;
  }

  /**
   * Retrieves data for a component to use. Can be either saved on local storage
   * or can be inside tag lines <>.
   * @method dataListener
   * @memberof mainComponent
   * @param {Element} mod - Custom component to retrieve data from.
   * @example mainComponent.dataListener(someComponent)
   * @returns {Object} data as objects.
   */

  static dataListener(mod) {
    var data;
    var params = this.makePropertiesFromParameters(mod.children);

    try {
      if (params[0].input != null || params[0].input != undefined) {
        //data = JSON.parse(await this.LocalStore({name: params[0].input, type:"retrieve"}))
        data = JSON.parse(this.getResults(params[0].input));
      } else {
        data = JSON.parse(this.dataGrabber(mod));
      }
      return data;
    } catch (error) {
      //alert("Error trying to retrieve or grab data. Please revise arguments passed!")
    }
  }

  /**
   * Stores data in cache, if required. Also used to retrieve data.
   * @method CookieStore
   * @memberof mainComponent
   * @param {String} name - name of the data to be stored or retrieved in a cookie.
   * @param {Object} value - object value to be stored in a cookie, null if retrieving.
   * @returns {Void} - Stores the data inside a cookie for up to 48 hours.
   */

  static CookieStore(name, value) {
    var tostore = Cookie.get(name);
    if (tostore == undefined) {
      tostore = value;
    } else {
      console.log(`${name} + restored from cookies`);
      return tostore;
    }
    Cookie.set(name, tostore);
  }

  /**
   * Access to CRUD services in the local storage
   * @method LocalStore
   * @memberof mainComponent
   * @param {String} name - Name of the data that is to be stored inside the local storage.
   * @param {Object} value - Data to be stored into the local storage.
   * @param {String} type - save, retrieve, remove, or clear.
   * @example mainComponent.LocalStore({name: 'someName', type:"retrieve"})
   * @returns {*} Different options depending on the selection.
   */

  static async LocalStore({ name, value, type } = {}) {
    if (type === "save") {
      Local.set(name, value);
    } else if (type === "retrieve") {
      var ret = await Local.get(name);
      return ret;
    } else if (type === "remove") {
      Local.remove(name);
    } else if (type === "clear" && name === "all") {
      Local.clear();
    }
  }

  /**
   * Pushing results to the local storage
   * @method pushResults
   * @memberof mainComponent
   * @param {String} name - Name of the object to store.
   * @param {Object} obj - Object to store
   * @param {String} db - Location to save the object at (supporting mainly local storage)
   * @returns {Void} If all good, object being saved in storage
   */

  static pushResults(name, obj, db) {
    if (db === "global") {
      return new Promise((resolve) => {
        setTimeout(() => {
          var ob = {
            [name]: obj,
          };
          Object.assign(this.results("data"), ob);
          resolve(ob);
        }, 1000);
      });
    }
    if (db === "local") {
      let promise = new Promise((resolve) => {
        setTimeout(() => resolve(obj), 1000);
      });

      promise.then((x) => {
        this.LocalStore({ name: name, value: x, type: "save" });
      });
    }
  }

  /**
   * Get results from the local storage recursively.
   * @method getResults
   * @memberof mainComponent
   * @param {String} name - name of the object to be retrieved.
   * @returns {Object} object required from the attributes.
   */
  static getResults(keyfind) {
    var value;
    Object.keys(window.localStorage).some(function (k) {
      if (k === keyfind) {
        value = window.localStorage[k];
        console.log(`Item ${keyfind} has been retrieved.`);
        return true;
      }
      if (
        window.localStorage[k] &&
        typeof window.localStorage[k] === "object"
      ) {
        value = this.getResults(keyfind);
        return value !== undefined;
      }
    });
    return value;
  }

  /**
   * Grabs the keys of an existing object with a delay.
   * @method grabKeyList
   * @memberof mainComponent
   * @param {Object} obj - object to grab keys from.
   * @returns {Object} array of the keys.
   */
  static grabKeyList(obj) {
    return new Promise((resolve) => {
      setTimeout(() => {
        var x = Object.keys(obj);
        resolve(x);
      }, 1);
    });
  }

  /**
   * Item called from the window global database
   * @method callDatabase
   * @memberof mainComponent
   * @param {Object} item - item retrived from the database.
   * @returns {Object} object required for further manipulation.
   */
  static callDatabase(item, name) {
    return new Promise((resolve) => {
      setTimeout(() => {
        var ob = {
          ...mainComponent.db(name)[item],
        };
        resolve(ob);
      }, 1000);
    });
  }

  /**
   * Function used to convert the numbers as strings inside object to integers
   * Used to parse objects from APIs for storage.
   * @method convertIntObj
   * @memberof mainComponent
   * @param {Object} obj - Original JSON object.
   * @returns {Object} obj - any number found as string is converted to numbers
   */

  static convertIntObj(obj) {
    const res = {};
    for (const key in obj) {
      res[key] = {};
      for (const prop in obj[key]) {
        const parsed = parseFloat(obj[key][prop], 10);
        res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
      }
    }
    return res;
  }

  /**
   * Delays an until a time t has passed.
   * @method delayer
   * @memberof mainComponent
   * @param {Int} t - how much time should the function be delayed.
   * @returns {Promise} time passed promise.
   */

  static delayer(t) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, t);
    });
  }

  /**
   * Data grabber for child embedded into a parent component.
   * @method dataGrabber
   * @memberof mainComponent
   * @param {Element} mod - module required for grabbing data
   * @returns {Object} data from child as JS array.
   */
  static dataGrabber(mod) {
    var data = [];
    try {
      for (var i = 0; i < mod.children.length; i++) {
        if (mod.children[i].tagName === "DATASET") {
          var x = mod.children[i].textContent;
          data.push(x);
        }
      }
    } catch (ex) {
      console.log("Issue with the data input. Revise!");
    }
    return data;
  }

  /**
   * Registers the elements into the DOM.
   * @method registerElement
   * @memberof mainComponent
   * @param {String} name - Name of the web component.
   * @param {Element} elem - Web component class.
   * @returns {Void} stores the element into the DOM.
   */
  static registerElement(name, elem) {
    Component.register(name, elem);
  }

  //Basic constructor required. Can be modified to verify dependencies between childs and parents.
  constructor() {
    super();
  }
}

//Register this element into the DOM
Component.register("main-component", mainComponent);
