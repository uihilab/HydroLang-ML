import Hydrolang from "../libraries/hydrolang/hydro.js";

/**
 * Provides the hydro instance from HydroLang.js and other variables for usage.
 * @namespace Hydro
 * @property {function} hydro -  HydroLang instance kept live under the namespace.
 */
var Hydro =
  Hydro ||
  (function () {
    var hydro = new Hydrolang();
    return {
      /**
       * @method ins
       * @memberof Hydro
       * @returns {Object} HydroLang instance
       */
      ins: function () {
        return hydro;
      },
    };
  })();

/**
 * Cookie service for storing parameters and arguments used in functions.
 * @namespace Cookie
 * @property {function} set - Sets a new cookie given a name and a value
 * @property {function}  get - Retrieves back a new cookie given a name
 * @property {function} clear - Cleares up all cookies that were saved on the cookie storage.
 */
if (JSON && JSON.stringify && JSON.parse)
  var Cookie =
    Cookie ||
    (function () {
      var store = load();

      function load() {
        var name = "store";
        var result = document.cookie.match(new RegExp(name + "=([^;]+)"));

        if (result) return JSON.parse(result[1]);

        return {};
      }

      function Save() {
        var date = new Date();
        //Letting cookies live for 1 day in total
        date.setHours(23, 59, 59, 999);
        var expires = "expires=" + date.toGMTString();
        document.cookie = JSON.stringify(store) + "; " + expires;
      }

      if (window.addEventListener)
        window.addEventListener("unload", Save, false);
      else if (window.attachEvent) window.attachEvent("onunload", Save);
      else window.onunload = Save;

      return {
        /**
         * @method set
         * @memberof Cookie
         * @param {String} name - Name of cookie to store.
         * @param {Object} value - Serialized cookie to store.
         * @returns {Void}
         */
        set: function (name, value) {
          store[name] = value;
        },

        /**
         * @method get
         * @memberof Cookie
         * @param {String} name - Name of object to be retrieved.
         * @returns {Object} Deserialized object
         */

        get: function (name) {
          return store[name] ? store[name] : undefined;
        },

        /**
         * @method clear
         * @memberof Cookie
         * @returns {Void} Clears local storage
         */

        clear: function () {
          store = {};
        },
      };
    })();

/**
 * Accessor for local storage functions. It deals with asynchronous behavior through the usage of
 * async/await functions.
 * @namespace Local
 * @property {function} set - Saves an object in the local storage given a value and a name.
 * @property {function} get - Retrieves an object from the local storage given a name
 * @property {function} remove - Removes an object from the local storage given a name.
 * @property {function} clear - Removes all the objects from the local storage.
 */
if (JSON && JSON.stringify && JSON.parse)
  var Local =
    Local ||
    (function () {
      return {
        /**
         * @method set
         * @memberof Local
         * @param {String} key - name of value to store
         * @param {Object} value - value to store as JS Object, array, XML.
         * @example Local.set('someName', someObject)
         * @returns {Console} Onscreen notification.
         */
        set: function (key, value) {
          window.localStorage.setItem(key, JSON.stringify(value));
          console.log(`Item ${key} has been saved in the local storage.`);
          return;
        },

        /**
         * @method get
         * @memberof Local
         * @param {String} key - Name of the object saved in storage.
         * @example Local.get('someName')
         * @returns {Object} deserialized object.
         */

        get: function (key) {
          if (!window.localStorage.hasOwnProperty(key)) {
            return console.log(`Item ${key} has not been found.`);
          }
          console.log(`Item ${key} has been retrieved.`);
          return window.localStorage.getItem(key);
        },

        /**
         * @method remove
         * @memberof Local
         * @param {String} key - Name of object to be deleted.
         * @example Local.remove('someName')
         * @returns {Void}
         */

        remove: function (key) {
          window.localStorage.removeItem(key);
          return console.log(`Item ${key} has been has been deleted.`);
        },

        /**
         * @method clear
         * @memberof Local
         * @example Local.clear()
         * @returns {Void} Removes all local storage objects.
         */

        clear: function () {
          window.localStorage.clear();
          return console.log("All items have been removed from storage.");
        },
      };
    })();

/**
 * Object for accessing the definition of a component through an instance of the
 * customElements API.
 * @namespace Component
 * @property {function} register - Registers a web component using the customElements API
 */
var Component =
  Component ||
  (() => {
    //Keeps track of the components already registered
    window.components = window.components || [];
    return {
      /**
       * @method register
       * @memberof Component
       * @param {String} name - Name of the custom element to register.
       * @param {Element} elem - Element object as a class.
       * @returns {Element} component appended to DOM.
       */
      register: (name, elem) => {
        if (!customElements.get(name)) {
          window.components.push(name.toUpperCase());
          customElements.define(name, elem);
        }
      },
    };
  })();

export { Hydro, Cookie, Local, Component };
