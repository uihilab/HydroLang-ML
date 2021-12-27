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
        const template = maincomponent.template("datamod")
        shadow.appendChild(template.content.cloneNode(true));
    }

    /**
     * Async connected callback. All analyze functions are parsed through here.
     * @callback
     * @memberof analyzemod
     */
    async connectedCallback() {

        var data = [];
        var res
        var props = this.makePropertiesFromAttributes('analyze-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)

        // var cj = this.children
        // for (let i =0; i < cj.length; i++){
        //     console.log(Element.getAttribute(cj[i].tagName))
        // }

        //the data is read in the screen from the span element
        //or from the saved data from the local storage
        //or from the downloaded data from the data module
        if (params[0].type === "saved") {
            var x
            try {
                x = JSON.parse(maincomponent.getresults(params[0].input))
                if (x[0].length) {
                    for (var i =0; i < x.length; i++){
                        data.push(x[i])
                        res = maincomponent.hydro().analyze[props.component][props.method](data[j])
                    }
    
                } else {
                    res = maincomponent.hydro().analyze[props.component][props.method](x)
                }
    
                maincomponent.pushresults(params[0].output, res, 'local')   
            } catch (error) { 
            }
        }
        else if (params[0].type === "userinput") {
            data = maincomponent.datagrabber(this)

            for (var j =0; j < data.length; j++) {
                data[j] = data[j].split(',').map(Number)
                res = maincomponent.hydro().analyze[props.component][props.method](data[j])
                maincomponent.pushresults(params[0].output, res, 'local')
            }
        }
    }
}

maincomponent.registerElement('analyze-mod', analyzemod)