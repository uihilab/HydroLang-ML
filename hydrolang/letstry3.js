class basebuilder extends HTMLElement {
    static get prop() {
        return {
            name: {
                type: String,
                userDefined: false
            }
        }
    }

    static createFragement(node) {
        let frag = document.createDocumentFragment();
        for (let i=0; i < node.childNodes.length; i++) {
            frag.append(node.childNodes[i].cloneNode(true))
        }
        return frag
    }

    static createNodeHolder(o) {
        let node = o.cloneNode(false);
        node.innerFragment = basebuilder.createFragement(o)
        return node
    }

    static registerElement(name, elem) {
        if (!customElements.get(name)) {
            window.hydronames = window.hydronames || [];
            window.hydronames.push(name.toUpperCase());
            customElements.define(name, elem)
        }
    }

    constructor() {
        super();
        this._props = this.makePropertiesFromAttributes();
    }

    makePropertiesFromAttributes(){
        let ElemClass = customElements.get(this.tagName.toLowerCase());
        let attr = ElemClass.observedAttributes;
        if (!attr) return null;
        let props = {}

        for(let i = 0; i < attr.length; i++){
            props[prop] = attr[i]

            if(typeof this[prop] != 'undefined') {
                continue;
            } else {
                Object.defineProperty(this, prop, {
                    get: () => {
                        let result = this.getAttributes(attr[i]);
                        if (result === 'true') { return true; }
                        else if (result === 'false') {return false;}
                        else { return result}
                    },
                    set: (value) => {
                        this.setAttribute(attr[i], value)
                    }
                })
            }
        }
        return props
    }

    getAttributes() {
        let result = {}
        let attributes = Object.keys(this.constructor.properties);
        for (let i=0; i< attributes.length; i++) {
            if (!this.constructor.properties[attributes[i]].userDefined) {
                continue;
            } if((typeof this.getAttribute(attributes[i] !== 'undefined') && (this.getAttribute(attributes[i] !== 'undefined')))) {
                if (this.constructor.properties[attributes[i]].value == this.getAttribute(attributes[i])) {
                    result[attributes[i]] = this.getAttribute(attributes[i])
                }
            }
        }
        return result
    }
}

if(!customElements.get('basebuilder')) {
    window.hydronames = window.hydronames || [];
    window.hydronames.push('BASEBUILDER');
    customElements.define('basebuilder', basebuilder);
}

class analyze extends basebuilder {

}