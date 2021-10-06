export default class basebuilder extends HTMLElement {
    static get prop() {
        return {
            name: {
                type: String,
                userDefined: false
            }
        }
    };

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

if(!customElements.get('base-builder')) {
    window.hydronames = window.hydronames || [];
    window.hydronames.push('BASE-BUILDER');
    customElements.define('base-builder', basebuilder);
}