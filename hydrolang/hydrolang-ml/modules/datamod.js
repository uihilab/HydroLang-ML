import maincomponent from '../globals/functions.js'

/**
 * Web component for handling data module.
 * @class datamod
 */
export default class datamod extends HTMLElement {

    /**
     * Defines the allowable attributes in the component.
     * @method properties
     * @memberof datamod
     */
    static get properties() {
        return {
            "method": {
                type: String,
                userDefined: true
            },

            "output": {
                type: String,
                userDefined: true
            },
        }
    };

    /**
     * Observer of keys for each property of the HTML element.
     * @method observedAttributes
     * @memberof datamod
     */
    static get observedAttributes() {
        return Object.keys(datamod.properties)
    };

    /**
     * Creates properties from allowable attributes for the web component.
     * @method makePropertiesFromAttributes
     * @memberof datamod
     * @param {Object} elem - Custom element to create attributes from.
     * @returns {Object} - Returns object with properties.
     */
    makePropertiesFromAttributes(elem) {
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
     * Constructor that deals with the inputs from each slotted event.
     * Requires methods from the maincomponent function.
     * @constructor
     * @memberof datamod
     */
    constructor() {
        //Required super method.
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        //Creation of the template holding the web component.
        const template = maincomponent.template("datamod")
        shadow.append(template.content.cloneNode(true))
    };

    async connectedCallback() {
        var props = this.makePropertiesFromAttributes('data-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)

        if (props.method === "retrieve" || props.method === "transform" || props.method === "upload" || props.method === "download") {
            var results = maincomponent.hydro().data[props.method]({params: params[0], args: params[1], data: data})
            maincomponent.pushresults(params[0].output, await results, 'local')
        } 
        else if (props.method === "save") {
            maincomponent.pushresults(params[0].output, data, 'local')
        } else if(props.method === "remove") {
            maincomponent.LocalStore({name: params[0].input, type: "remove"})
        }
    }
}

//Defining the web components into the DOM
maincomponent.registerElement('data-mod', datamod)