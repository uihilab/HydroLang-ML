import Hydrolang from "../../hydro.js";

//Hydro instance to be used globally
//Extends 
var Hydro = Hydro || (function () {
    var hydro = new Hydrolang()

    //Initialize window object containers
    window.instancecounter = 0
    window.db = {}
    window.results = {}

    return {
        ins: function () {
            return hydro
        },
        db: function () {
            return window.db
        },
        results: function() {
            return window.results
        },
        counter: function() {
            return window.instancecounter
        },
        count: function() {
            window.instancecounter++
        }
    }
})();


//Cookie service for storing parameters and arguments used in functions.
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

//Local Storage Service
if (JSON && JSON.stringify && JSON.parse) var Local = Local || (function () {

    return {
        set: function (key, value) {
            if (!key || value) {return;}

            if (typeof value === "object") {
                value = JSON.stringify(value)
            }

            localStorage.setItem(key, value);
            console.log(`Item ${key} has been saved.`)
        },

        get: function (key) {
            var value = localStorage.getItem(key);

            if (!value) {

                console.log(`Item ${key} has not been found.`)                
                return
            }

            if (value == null) {
                console.log(`Item ${key} has not been found.`)
                return false
            }

            if (value[0] === '{') {
                value = JSON.parse(value)
                console.log(`Item ${key} has been retrieved.`)
            }

            return value
        },

        remove: function (key) {
            localStorage.removeItem(key)
            console.log(`Item ${key} has been has been deleted.`)
        },

        clear: function () {
            localStorage.clear();
        }
    }
})();

export {
    Hydro,
    Cookie,
    Local
}