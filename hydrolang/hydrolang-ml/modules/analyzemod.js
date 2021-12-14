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

            "type":{
                type: String,
                userDefined: true
            },

            "output": {
                type: String,
                userDefined: true
            },

            "input": {
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
        var props = this.makePropertiesFromAttributes('analyze-mod')

        //The events of slots changes are dealth with here. Create
        //object parameters and append them to the global dictionaries
        // this.shadowRoot.addEventListener("slotchange", (ev) => {
        //     var newdb = {}
        //     //Initialize the counter for the module. 
        //     //maincomponent.count()
        //     var r = ev.target.assignedElements()
        //     var ar = maincomponent.makePropertiesFromParameters(r)

        //     for (var i = 0; i < ar.length; i++) {
        //         newdb[i] = {
        //             [r[i].localName]: ar[i]
        //         }
        //     }

        //     maincomponent.db("analyze")[props.output] = newdb
        //     if (r.length === 0) {
        //         console.log(`No additional parameters detected for module ${props.output}.`)
        //     } else {
        //         console.log(`Additional slots for module ${props.output}: ${ev.target.name} contains`, ev.target.assignedElements())
        //     }

        // })
    }

    async connectedCallback() {

        var data = [];
        var props = this.makePropertiesFromAttributes('analyze-mod')

        //the data is read in the screen from the span element

        if (props.type === "saved") {
            var x = maincomponent.getresults(props.input)
            var values = JSON.parse(x)
            let res = maincomponent.hydro()['analyze'][props.component][props.method](values)
            if (props.output){
            maincomponent.pushresults(props.output, res, 'local')
        }
        }
        if (props.type === "userinput") {
            try {
                for (var i = 0; i < this.children.length; i++) {
                data.push(this.children[i].textContent)
                console.log("im here, part of", props.output)
            }
            }

            catch(ex) {
                console.error(ex)
            }

            for (var j =0; j < data.length; j++) {
                data[j] = data[j].split(',').map(Number)
                let res = maincomponent.hydro()['analyze'][props.component][props.method](data[j])
                console.log(res)
            }

        }

            //let res = maincomponent.hydro()['analyze'][props.component][props.method](values)
            //if (props.output) {
            //maincomponent.pushresults(props.type, values, 'local')
            //maincomponent.pushresults(props.output, res, 'local')
        //}
         
    }
}

maincomponent.registerElement('analyze-mod', analyzemod)