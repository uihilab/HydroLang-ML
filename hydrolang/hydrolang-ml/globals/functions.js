import {
    Hydro,
    Cookie,
    Local
} from './globals.js'

export default class basebuilder extends HTMLElement {
    static get prop() {
        return {
            name: {
                type: String,
                userDefined: false
            }
        }
    };

    //Returns Hydrolang instance from namespace
    static hydro() {
        return Hydro.ins()
    }

    static counter(){
        return Hydro.counter()
    }

    static db() {
        return Hydro.db()
    }

    static results() {
        return Hydro.results()
    }

    static count() {
        Hydro.count()
    }

    //Create properties from passed parameters
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

    //Create properties from attributes
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
    }

    //Store data in cache, if required
    static CookieStore(name, value) {

        var tostore = Cookie.get(name)

        if (tostore == undefined) {
            tostore = value;
        } else {
            console.log(`${name} + restored from cookies`)
            return tostore
        }
        Cookie.set(name, tostore)
    }

    //Access Local Storage
    static LocalStore(name, value, type) {
        if (type == "save") {
        Local.set(name, value)
    } if (type == "retrieve") {
        Local.get(name)
    }
    };

    static LocalGet(name) {
        
    };

    //Register elements into the DOM
    static registerElement(name, elem) {
        if (!customElements.get(name)) {
            window.hydronames = window.hydronames || [];
            window.hydronames.push(name.toUpperCase());
            customElements.define(name, elem)
        }
    }
    //basic constructor req. Can be modified to verify dependencies between childs and parents.
    constructor() {
        super();
    }
}

//Register this elemnt into the DOM
if (!customElements.get('base-builder')) {
    window.hydronames = window.hydronames || [];
    window.hydronames.push('BASE-BUILDER');
    customElements.define('base-builder', basebuilder);
}