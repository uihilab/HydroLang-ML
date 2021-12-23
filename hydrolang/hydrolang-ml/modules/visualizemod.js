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
            //name of the div constructor.
            "output": {
                type: String,
                userDefined: true
            },

            "draw": {
                type: String,
                userDefined: true
            },

            //data passed by the user.
            "input": {
                type: String,
                userDefined: true
            },

            "type": {
                type: String,
                userDefined: true
            },

            "charttype": {
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

    //create properties from passed attributes accepted by element
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
     * @returns 
     */
    typeofvisual(data, draw,name, type) {
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
     * Constructor that deals with the inputs from each slotted event.
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
        const template = maincomponent.template('VISUALIZE-MOD')
        shadow.append(template.content.cloneNode(true))
        //Creation of the properties of the module.
        var visualizemodprop = this.makePropertiesFromAttributes('visualize-mod')


        //The events of slots changes are dealth with here. Create
        //object parameters and append them to the global dictionaries
        this.shadowRoot.addEventListener("slotchange", (ev) => {
            var newdb = {}
            var r = ev.target.assignedElements()
            var ar = maincomponent.makePropertiesFromParameters(r)

            for (var i = 0; i < ar.length; i++) {
                newdb[i] = {
                    [r[i].localName]: ar[i]
                }
            }
            maincomponent.db("visualize")[visualizemodprop.output] = newdb
            if (r.length === 0) {
                console.log(`No additional parameters detected for module visualize, ${visualizemodprop.output}.`)
            } else {
                console.log(`Additional slots for module visualize, ${visualizemodprop.output}: ${ev.target.name} contains`, ev.target.assignedElements())

            }

        })
    };

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {
        var props = this.makePropertiesFromAttributes('visualize-mod')
        var x
        var ob
        var data = []

        if (props.type == "saved") {
            try {
                x = JSON.parse(maincomponent.getresults(props.input))
                ob = this.typeofvisual(x, props.draw, props.output)
                maincomponent.hydro().visualize[props.method](ob)
            } catch (error) {
            }
        }

        if (props.type == "userinput") {
            try {
                data = maincomponent.datagrabber(this)
                for (var j =0; j < data.length; j++) {
                    data[j] = data[j].split(',').map(Number)
                }
                ob = this.typeofvisual(data, props.draw, props.output, props.charttype)
                maincomponent.hydro().visualize[props.method](ob)
        } catch (error) {
        }
        }
}
}

//Defining the web components into the DOM
maincomponent.registerElement('visualize-mod', visualizemod)