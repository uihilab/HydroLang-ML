import maincomponent from '../globals/functions.js'

/**
 * Web component for handling visualize module.
 * @class visualizemod
 */
export default class visualizemod extends HTMLElement {

    /**
     * Defines the allowable attributes in the component.
     * @method properties
     * @memberof visualizemod
     */
    static get properties() {
        return {
            "method": {
                type: String,
                userDefined: true
            },
        }
    };

    /**
     * Observer of keys for each property of the HTML element.
     * @method observedAttributes
     * @memberof visualizemod
     */
    static get observedAttributes() {
        return Object.keys(visualizemod.properties)
    };

    /**
     * Creates properties from allowable attributes for the web component.
     * @method makePropertiesFromAttributes
     * @memberof visualizemod
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
     * Constructor to open the shadow DOM and creating a template for the component.
     * Requires methods from the maincomponent function.
     * @constructor
     * @memberof visualizemod
     */
    constructor() {
        //Required super method.
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        //Creation of the template holding the web component.
        const template = maincomponent.template("visualizemod")
        // shadow.append(template.content.cloneNode(true))

        var hyd = document.querySelector("hydrolang-ml").shadowRoot.querySelector("#analyze")
        console.log(hyd)
    };

    /**
     * Function dealing with the inputs passed as data or attributes by the user.
     * @callback
     * @memberof visualizemod
     */
    async connectedCallback() {
        var props = this.makePropertiesFromAttributes('visualize-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)
        maincomponent.hydro().visualize[props.method]({params: params[0], args: params[1], data: data})
}
}

//Defining the web components into the DOM
maincomponent.registerElement('visualize-mod', visualizemod)