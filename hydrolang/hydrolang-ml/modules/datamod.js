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
     * Confirms that the data has been downloaded and added to results.
     * @method handlewaterdata
     * @memberof datamod
     * @param {Object} data - retrieved data from any API.
     * @returns {console} confirmation of data. 
     */
    handlewaterdata(data) {
        console.log(`Data has been retrieved!`)
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

        if (props.method === "retrieve") {
            var ob = Object.assign({}, params[0])
            var nw = Object.assign({}, params[1])
            ob.arguments = nw
            var results = maincomponent.hydro().data[props.method](await ob, this.handlewaterdata)
            if (results != null || results != undefined || results != []) {
                maincomponent.pushresults(params[0].output, await results, 'local')
            }

        // } else if (props.method === "transform") {
        //     var param = await maincomponent.callDatabase(props.output, "data")
        //     var x = maincomponent.getresults(props.input)
        //     var resol = param[0].parameters.resultname
        //     var res = JSON.parse(x)
        //     console.log("transform alive!")
        //     var clean = maincomponent.recursearch(res, resol)
        //     console.log(clean)

        } else if (props.method === "upload") {
            var btn = document.createElement("BUTTON")
            btn.innerHTML = "Upload here!"
            btn.onclick = function () {
                var prom = Promise.resolve(maincomponent.hydro().data[props.method](params[0].type))
                maincomponent.LocalStore(params[0].output, prom.resolve, "save")         
            }
            document.body.appendChild(btn)

        } else if (props.method === "download") {
            console.log("download alive!")
            console.log(props)
        } 
        else if (props.method === "save") {
            var data = maincomponent.datalistener(this)
            maincomponent.LocalStore(params[0].output, data, "save")
        }
    }
}

//Defining the web components into the DOM
maincomponent.registerElement('data-mod', datamod)