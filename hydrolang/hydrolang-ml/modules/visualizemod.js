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
            "draw": {
                type: String,
                userDefined: true
            }
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
     * Returns an iterable object to be passed as parameter for visualize module in hydrolang.
     * @method typeofvisual
     * @memberof visualizemod
     * @param {Object} data - data type to draw, ndarray depending on the visualization to use.
     * @param {String} draw - either drawing a table or a chart.
     * @param {String} name - name assigned to both div and chart name.
     * @param {String} type - if passed, chart type to use (scatter, line, poly).
     * @returns {Object} - object to be used for drawing.
     */
    typeofvisual(data,draw,name, type) {
        if (!type){
            type = null
        }
        var ob
        ob = {data:data,
            draw: draw,
            config:{}
        }

        if(draw == "table") {
                ob.config = {
                    div: name
                }
        } if (draw == "chart") {
                ob.config = {
                    chart: type,
                    div: name,
                    title: name
                }
        };
        return ob
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
        shadow.append(template.content.cloneNode(true))
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
        try {
            var ob = this.typeofvisual(data, params[0].draw, params[0].output, params[0].charttype)
            maincomponent.hydro().visualize[props.method](ob)
        } catch (error) {
            console.log("Error in rendering. Revise inputs!")
        }
}
}

//Defining the web components into the DOM
maincomponent.registerElement('visualize-mod', visualizemod)