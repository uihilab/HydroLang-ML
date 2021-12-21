import {
    Hydro,
    Cookie,
    Local
} from './globals.js'

/**
 * Main class with functions used throughout all the components created.
 * Used for registering the elements into the DOM.
 * @class maincomponent
 */
export default class maincomponent extends HTMLElement {
    /**
     * Used for calling the HydroLang instance from the global container.
     * @method hydro
     * @memberof maincomponent
     * @returns HydroLang instance
     */
    static hydro() {
        return Hydro.ins()
    };

    /**
     * Used for counting the number of instances of a component.
     * @method counter
     * @memberof maincomponent
     * @returns counter of instances of a component.
     */
    static counter() {
        return Hydro.counter()
    };

    /**
     * Accesses the window database that contains events attached as nodes.
     * @method db
     * @memberof maincomponent
     * @returns global window database
     */
    static db(key) {
        return Hydro.db(key)
    };

    static results(key) {
        return Hydro.results(key)
    };

    static count() {
        Hydro.count()
    };

    /**
     * Creates a new template to attach a component into.
     * @method template
     * @memberof maincomponent
     * @returns template with slot to attach new web components
     */
    static template(name) {
        const template = document.createElement('template');
        template.id = name
        template.innerHTML =
        `
        <style></style>
        <div><slot></slot></div>
        `;
        return template
    };

    /**
     * Checks if an object is empty.
     * @method isEmpty
     * @memberof maincomponent
     * @param {Object} Obj - required object for search.
     * @returns {Boolean} True if an object does not have any object.
     */
    static isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
            return false;
        }
        return true
    };

    /**
     * Creates an object of parameters from the properties of a component.
     * @method makePropertiesFromParameters
     * @memberof maincomponent
     * @param {String} elem - slot element attached as node into a component.
     * @returns {Object} attributes consolidated in an object. 
     */
    static makePropertiesFromParameters(elem) {
        let attr = []
        var names = []
        for (var i = 0; i < elem.length; i++) {
            var props = {}
            names.push(elem[i].getAttributeNames())
            for (var j = 0; j < names[i].length; j++) {
                var prop = names[i][j]
                props[prop] = elem[i].getAttribute(prop)
            }
            attr.push(props)
        }
        return attr
    };

    /**
     * Creates an object of properties from attributes of a component.
     * @method makePropertiesFromAttributes
     * @memberof maincomponent
     * @param {*} elem - web component name element. 
     * @returns {Object} properties of objects from allowable attributes. 
     */
    static makePropertiesFromAttributes(elem) {
        let ElemClass = customElements.get(elem);
        let attr = ElemClass.observedAttributes;
        if (!attr) return null;
        var props = {}

        for (var i = 0; i < attr.length; i++) {
            var prop = attr[i]
            props[prop] = this.getAttribute(attr[i])
        }
        return props
    };

    /**
     * Stores data in cache, if required. Also used to retrieve data.
     * @method CookieStore
     * @memberof maincomponent
     * @param {String} name - name of the data to be stored or retrieved in a cookie. 
     * @param {Object} value - object value to be stored in a cookie, null if retrieving. 
     * @returns {void} - Stores the data inside a cookie for up to 48 hours.
     */
    static CookieStore(name, value) {
        var tostore = Cookie.get(name)
        if (tostore == undefined) {
            tostore = value;
        } else {
            console.log(`${name} + restored from cookies`)
            return tostore
        }
        Cookie.set(name, tostore)
    };

    /**
     * Stores data inside the local storage.
     * @method LocalStore
     * @memberof maincomponent
     * @param {String} name - name of the data that is to be stored inside the local storage. 
     * @param {Object} value - data to be stored into the local storage.
     * @returns {void} -  
     */
    static LocalStore(name, value, type) {
        if (type === "save") {
            Local.set(name, value)
        } else if (type === "retrieve") {
            Local.get(name)
        }
    };

    /**
     * Registers the elements into the DOM.
     * @method registerElement
     * @memberof maincomponent
     * @param {String} name - name of the web component. 
     * @param {*} elem - web component class.
     * @returns {void} stores the element into the DOM.
     */
    static registerElement(name, elem) {
        if (!customElements.get(name)) {
            window.hydronames = window.hydronames || [];
            window.hydronames.push(name.toUpperCase());
            customElements.define(name, elem)
        }
    };

    /**
     * Pushing results to the local storage
     * @method pushresults
     * @memberof maincomponent
     * @param {String} name - name of the object to store. 
     * @param {Object} obj - object to store
     * @returns {void}
     */
    static pushresults(name, obj, db) {
            if(db === 'global') {
            return new Promise(resolve => {
                setTimeout(() => {
                    var ob = {
                        [name]: obj
                    }
                    Object.assign(this.results("data"), ob)
                    resolve(ob)
                }, 1000);
            })
        } if (db === 'local') {
            let promise = new Promise(resolve => {
                setTimeout(() => resolve(obj), 1000)})
            
            promise.then((x) =>{
                    this.LocalStore(name, x, "save")
                })
        }
    };

    /**
     * Get results from the attribute
     * @method getresults
     * @memberof maincomponent
     * @param {String} name - name of the object to be retrieved. 
     * @returns {Object} object required from the attributes.
     */
    static getresults(keyfind) {
        var value;
        Object.keys(window.localStorage).some(function(k) {
            if (k===keyfind) {
                value = window.localStorage[k];
                return true;
            }
            if (window.localStorage[k] && typeof window.localStorage[k] === 'object') {
                value = this.getresults(window.localStorage[k], keyfind);
                return value !== undefined;
            }
        });
        console.log(`Item ${keyfind} has been retrieved.`)
        return value
    };

    /**
     * Grabs the keys of an existing object with a delay.
     * @method grabKeyList
     * @memberof maincomponent
     * @param {Object} obj - object to grab keys from. 
     * @returns {Object[]} array of the keys.
     */
    static grabKeyList(obj) {
            return new Promise(resolve => {
                setTimeout(() => {
                    var x = Object.keys(obj)
                    resolve(x)
                }, 1)
            })
        };

    /**
     * Item called from the window global database
     * @method callDatabase
     * @memberof maincomponent
     * @param {Object} item - item retrived from the database. 
     * @returns {Object} object required for further manipulation.
     */
    static callDatabase(item, name) {
        return new Promise(resolve => {
            setTimeout(() => {
                var ob = {
                    ...maincomponent.db(name)[item]
                }
                resolve(ob)
            }, 1000);
        })
    };

    /**
     * Data grabber for child embedded into a parent component.
     * @method datagrabber
     * @param {Object} mod - module required for grabbing data 
     * @returns {Object} 
     */

    static datagrabber(mod){
        var data = [];
        try {
            for (var i = 0; mod.children.length; i++) {
                data.push(mod.children[i].textContent)
            }
        }
        catch (ex) {
            console.log("Issue with the data input. Revise!")
        }
        return data
    }

    /**
     * Retrieves an array from nested JSON object.
     * @method recursearch
     * @param {Object} object - retrieved object from local storage or download
     * @param {String} values - names of arrays that are to be retrieved
     */

    static recursearch(object, values) {
        if (Array.isArray(object)) {
            for (const obj in object) {
                const result = this.recursearch(obj, values)
                if (result) {
                    return obj
                }
            }
        } else {
            if (object.hasOwnProperty(values)) {
                return object;
            }

            for (const k in Object.keys(object)) {
                if (typeof object[k] === "object") {
                    const o = this.recursearch(object[k], values);
                    if (o !== null && typeof o !== 'undefined'){
                        return o;
                    }
                }
            }
            return null
        }
    }

    /**
     * Basic constructor required. Can be modified to verify dependencies between childs and parents.
     * @constructor
     * @memberof maincomponent
     */
    constructor() {
        super();
    };
};

//Register this element into the DOM
if (!customElements.get('main-component')) {
    window.hydronames = window.hydronames || [];
    window.hydronames.push('MAIN-COMPONENT');
    customElements.define('main-component', maincomponent);
}