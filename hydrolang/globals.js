import Hydrolang from "./hydro.js";

//Hydro instance to be used globally
var Hydro = Hydro || (function () {
    var hydro = new Hydrolang()

    return {
        ins: function () {
            return hydro
        }
    }
})();


//Cookie service for storing parameters and arguments used in functions.
if (JSON && JSON.stringify && JSON.parse) var Sess = Sess || (function () {
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

export {
    Hydro,
    Sess
}