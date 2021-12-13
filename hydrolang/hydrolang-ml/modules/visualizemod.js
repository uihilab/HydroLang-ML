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
            //name of the div constructor.
            "output": {
                type: String,
                userDefined: true
            },

            //data passed by the user.
            "input": {
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
            //visualizemodprop.id = maincomponent.counter()
            maincomponent.db("visualize")[visualizemodprop.output] = newdb
            if (r.length === 0) {
                console.log(`No additional parameters detected for module ${visualizemodprop.output}.`)
            } else {
                console.log(`Additional slots for module ${visualizemodprop.output}: ${ev.target.name} contains`, ev.target.assignedElements())

            }

        })
    };

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {
        var props = this.makePropertiesFromAttributes('visualize-mod')

        if (props.method === "userinput") {
            let data = web.querySelector('visualize-mod data')
            var values = data.textContent.split(",".map(x => parseInt(x)))
            var res = await this.callDatabase(props.output)
            var ob = {
                ...res[0]
            }
            var nw = {
                ...res[1]
            }
            var vf = {}
            vf = Object.assign(ob.parameters, nw)
            var results = maincomponent.hydro().data.retrieve(vf, this.handlewaterdata)
            maincomponent.pushresults(props.output, results, 'local') 
    }
}
}

//Defining the web components into the DOM
maincomponent.registerElement('visualize-mod', visualizemod)