import Hydrolang from "../../hydro.js";

/**
 * Provides the hydro instance from HydroLang.js and other variables for usage.
 * @namespace Hydro
 * @property {Object} hydro HydroLang instance.
 */
var Hydro = Hydro || (function () {
    var hydro = new Hydrolang()

    //Initialize window object containers
    window.db = {"data":{}, "analyze":{}, "visualize":{}, "maps":{}}
    window.results = {"data":{}, "analyze":{}, "visualize":{}, "maps":{}}

    return {
        ins: function ({params, args, data} = {}) {
            return hydro
        },
        db: function (key) {
            return window.db[key]
        },
        results: function (key) {
            return window.results[key]
        },
    }
})();


/**
 * Cookie service for storing parameters and arguments used in functions.
 * @namespace Cookie
 * @property {load} 
 */
if (JSON && JSON.stringify && JSON.parse) var Cookie = Cookie || (function () {
    var store = load();

    function load() {
        var name = "store";
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));

        if (result)
            return JSON.parse(result[1]);

        return {};
    }

    function Save() {
        var date = new Date();
        //Letting cookies live for 1 day in total
        date.setHours(23, 59, 59, 999);
        var expires = "expires=" + date.toGMTString();
        document.cookie = JSON.stringify(store) + "; " + expires
    };

    if (window.addEventListener) window.addEventListener("unload", Save, false);
    else if (window.attachEvent) window.attachEvent("onunload", Save)
    else window.onunload = Save;

    return {
        set: function (name, value) {
            store[name] = value;
        },

        get: function (name) {
            return (store[name] ? store[name] : undefined);
        },

        clear: function () {
            store = {};
        }
    }
})();

/**
 * Local Storage Service
 * @namespace Local
 */
if (JSON && JSON.stringify && JSON.parse) var Local = Local || (function () {

    return {
        set: function (key, value) {
            // if (window.localStorage[key]) {
            //     return alert(`Item ${key} already exists! Please change name or revise data.`)
            // } else {
                var x = value
                x = JSON.stringify(x)
                window.localStorage.setItem(key, x);
                return console.log(`Item ${key} has been saved in the local storage.`)
            // }
        },

        get: function (key) {
                var value = window.localStorage.getItem(key);

                if (!value) {
                    return console.log(`Item ${key} has not been found.`)
                }
    
                if (value === null) {
                    console.log(`Item ${key} has not been found.`)
                    return false
                }
    
                console.log(`Item ${key} has been retrieved.`)
                var result = value
                return result
        },

        remove: function (key) {
            window.localStorage.removeItem(key)
            return console.log(`Item ${key} has been has been deleted.`)
        },

        clear: function () {
            window.localStorage.clear();
            return console.log("All items have been removed from storage.")
        }
    }
})();

/**
 * Registeres components names
 * @namespace components
 */
    var Comp = Comp || (() => {
        window.components = window.components || []
        return {
            register: ((name, elem) => {
                if (!customElements.get(name)) {
                window.components.push(name.toUpperCase())
                customElements.define(name, elem)
            }
            })
        }
})();

export {
    Hydro,
    Cookie,
    Local,
    Comp
}