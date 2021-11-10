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
    static get prop() {
        return {
            name: {
                type: String,
                userDefined: false
            }
        }
    };

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
     * Used for counting the number of instances of a component.
     * @method counter
     * @memberof maincomponent
     * @returns counter of instances of a component.
     */
    static counter(){
        return Hydro.counter()
    };

    /**
     * Accesses the window database that contains events attached as nodes.
     * @method db
     * @memberof maincomponent
     * @returns global window database
     */
    static db() {
        return Hydro.db()
    };

    static results() {
        return Hydro.results()
    };

    static count() {
        Hydro.count()
    };

    /**
     * Creates an object of parameters from the properties of a component.
     * @method makePropertiesFromParameters
     * @memberof maincomponent
     * @param {*} elem - slot element attached as node into a component.
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
        if (type == "save") {
        Local.set(name, value)
    } if (type == "retrieve") {
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