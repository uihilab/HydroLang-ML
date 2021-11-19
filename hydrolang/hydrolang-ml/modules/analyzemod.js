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

            "resultsname": {
                type: String,
                userDefined: true
            },

            "datasource": {
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

        const template = maincomponent.template('ANALYZE-MOD')

        shadow.appendChild(template.content.cloneNode(true));
        let web = document.querySelector('analyze-mod')

        var props = this.makePropertiesFromAttributes('analyze-mod')
        console.log(props)

        //the data is read in the screen from the span element

        if (props.datasource === "saved") {
            var results = maincomponent.LocalStore(props.sourcename)
            console.log(results)
        }
        if (props.datasource === "input") {
            let data = web.querySelector('analyze-mod span')
            var values = data.textContent.split(",").map(x => parseInt(x))

            let res = maincomponent.hydro()['analyze'][props.component][props.method](values)
            console.log(res)

            template.innerHTML =
                `
        <h3>The result of your calculation is: ${res} </h3>
        
        `
        }
    }
}

maincomponent.registerElement('analyze-mod', analyzemod)