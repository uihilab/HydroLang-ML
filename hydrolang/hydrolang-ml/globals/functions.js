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
     * Observer of keys for each property of the web component.
     * @method observedAttributes
     * @memberof maincomponent
     * @returns {Object[]} - array with the attributes acceptable for the component.
     */

    static observedAttributes(mod) {
        return mod.getAttributeNames()
    };

    /**
     * Used for calling the HydroLang instance from the global container.
     * @method hydro
     * @memberof maincomponent
     * @returns {Promise} - HydroLang instance
     */
    static hydro() {
        return Hydro.ins()
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

    /**
     * Creates a new template to attach a component into.
     * @method template
     * @memberof maincomponent
     * @returns template with slot to attach new web components
     */
    static template(mod) {
        const template = document.createElement('template');
        const diver = ((name) => {
            if (!document.querySelector(`.${name}`)){
                var div = document.createElement('div')
                div.className = name
                document.getElementById('hydrolang').appendChild(div)
            } else {
                return
            }
        })
        if (mod === "hydrolangml") {
        //Templates for web component container
        template.id = "hydrolang"
        template.innerHTML = 
        `
            <slot name="visualizemod"></slot>
            <slot name="analyzemod"></slot>
            <slot name="datamod"></slot>
            <slot name="mapmod"></slot>
        `;
        return template
        } if (mod === "analyzemod") {
            diver('analyze')
            //No templating for the web components.
            template.id = "analyze"  
            template.innerHTML = 
            `
            `          
        } if (mod === "visualizemod") {
            diver('visualize')
            template.id = "visualize"
            template.innerHTML = 
            `
            `
        } if (mod === "mapmod") {
            diver('maps')
            template.id = "maps"
            template.innerHTML = 
            `
            `
        } if (mod === "datamod") {
            diver('data')
            template.id = "data"
            template.innerHTML = 
            `
            `
        }
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

        //In case there are numbers inside the objects.
        if (elem[0].parentElement.nodeName === 'DATA-MOD') {
            return attr
        } else {
        return this.convertIntObj(attr)
    }
    };

    /**
     * Creates an object of properties from attributes of a component.
     * @method makePropertiesFromAttributes
     * @memberof maincomponent
     * @param {Object} elem - web component name element. 
     * @returns {Object} properties of objects from allowable attributes. 
     */
    static makePropertiesFromAttributes(mod) {
        let attr = this.observedAttributes(mod);
        if (!attr) return null;
        var props = {}

        for (var i = 0; i < attr.length; i++) {
            var prop = attr[i]
            props[prop] = mod.getAttribute(attr[i])
        }
        return props
    };

    /**
     * 
     * @param {*} elem 
     * @param {*} mod 
     * @param {*} attr 
     */
    static slotlistener(elem, mod, attr){
        elem.shadowRoot.addEventListener("slotchange", (ev) => {
            var newdb = {}
            //Initialize the counter for the module. 
            var r = ev.target.assignedElements()
            var ar = this.makePropertiesFromParameters(r)

            for (var i = 0; i < ar.length; i++) {
                newdb[i] = {
                    [r[i].localName]: ar[i]
                }
            }
            this.db(mod)[attr.output] = newdb
            if (r.length === 0) {
                console.log(`No additional parameters detected for module ${mod}, ${attr.output}.`)
            } else {
                console.log(`Additional slots for module ${mod}, ${attr.output}: ${ev.target.name} contains`, ev.target.assignedElements())

            }

        })
    };

    /**
     * Retrieves data for a component to use. Can be either saved on local storage
     * or can be inside tag lines <>.
     * @method datalistener
     * @memberof maincomponent
     * @param {Object} mod - Custom component to retrieve data from
     * @returns {Object} data.
     */
    static datalistener(mod) {
        var data
        var params = this.makePropertiesFromParameters(mod.children)

        try{
        if (params[0].input != null || params[0].input != undefined) {
            data = JSON.parse(this.LocalStore({name: params[0].input, type: "retrieve"}))
            //data = JSON.parse(this.getresults(params[0].input))
        } else {
            data = JSON.parse(this.datagrabber(mod))
        }
        return data
    } catch (error) {
        //alert("Error trying to retrieve or grab data. Please revise arguments passed!")
    }
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
    static LocalStore({name, value, type} = {}) {
        if (type === "save") {
            Local.set(name, value)
        } else if (type === "retrieve") {
            var ret = Local.get(name)
            return ret
        } else if (type === "remove") {
            Local.remove(name)
        } else if (type === "clear" && name === "all") {
            Local.clear()
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
                    this.LocalStore({name: name, value: x, type: "save"})
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
                console.log(`Item ${keyfind} has been retrieved.`)
                return true;
            }
            if (window.localStorage[k] && typeof window.localStorage[k] === 'object') {
                value = this.getresults(keyfind);
                return value !== undefined;
            }
        });
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
     * 
     * @param {Object} obj - Object JSON that  
     * @returns 
     */

    static convertIntObj(obj) {
        const res = {}
        for (const key in obj) {
          res[key] = {};
          for (const prop in obj[key]) {
            const parsed = parseFloat(obj[key][prop], 10);
            res[key][prop] = isNaN(parsed) ? obj[key][prop] : parsed;
          }
        }
        return res;
      };

      /**
       * 
       * @param {Int} t - how much time should the function be delayed. 
       * @returns {Promise} resolved promise.
       */

      static delayer(t) {
          return new Promise((resolve) => {
              setTimeout(() => { resolve()}, t)
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
            for (var i = 0; i < mod.children.length; i++) {
                if(mod.children[i].tagName === 'DATASET') {
                    var x = mod.children[i].textContent
                    data.push(x)
                }
            }
        }
        catch (ex) {
            console.log("Issue with the data input. Revise!")
        }
        return data
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