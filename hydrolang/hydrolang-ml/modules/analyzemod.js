import maincomponent from "../globals/functions.js";

/**
 * Web component for handling the analyze module of HydroLang.
 * @class analyzemod
 */

export default class analyzemod extends HTMLElement {

    /**
     * Defines the allowable attributes in the component.
     * @method properties
     * @memberof datamod
     */
    static get properties() {
        return {
            "component": {
                type: String,
                userDefined: true
            },

            "method": {
                type: String,
                userDefined: true
            },
        }
    }

    /**
     * Observer of keys for each property of the HTML element.
     * @method observedAttributes
     * @memberof datamod
     */
    static get observedAttributes() {
        return Object.keys(analyzemod.properties)
    }

    //Reusable property maker. Returns the names and values of the attributes passed.
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
     * Main constructor for the analyze module. Handles the data inputs and performs calculations accordingly.
     * @constructor
     * @memberof analyzemod
     */
    constructor() {
        super();
        let shadow = this.attachShadow({
            mode: 'open'
        });
        // const template = maincomponent.template("datamod")
        // shadow.appendChild(template.content.cloneNode(true));
    }

    /**
     * Async connected callback. All analyze functions are parsed through here.
     * @callback
     * @memberof analyzemod
     */
    async connectedCallback() {
        this.setAttribute("slot", "analyzemod")
        var props = this.makePropertiesFromAttributes('analyze-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)
        // try{
            var res = maincomponent.hydro().analyze[props.component][props.method]({params: params[0], args: params[1], data: data})
            maincomponent.pushresults(params[0].output, res, 'local')
        // } catch(error) {
        //     console.log("Check data types from HydroLang.js to see compatibility!")
        // }
    }

    disconnectedCallback(){
    }
}

maincomponent.registerElement('analyze-mod', analyzemod)