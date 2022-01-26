import maincomponent from '../globals/functions.js'

/**
 * Web component for handling data module.
 * @class datamod
 */
export default class datamod extends HTMLElement {

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
            mode: 'closed'
        })
        //Creation of the template holding the web component.
        const template = maincomponent.template("datamod")
        shadow.append(template.content.cloneNode(true))

        //Appends the attribute slot into the web component so that it can be correctly slotted.
        this.setAttribute("slot", "datamod")
    };

    async connectedCallback() {
        var props = maincomponent.makePropertiesFromAttributes(this)
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)

        if (!['save', 'clear'].includes(props.method)){
        //if method is directly attributable to hydrolang.js (retrieve, transform, upload, download)
            var results = maincomponent.hydro().data[props.method]({params: params[0], args: params[1], data: data})
            maincomponent.pushresults(params[0].output, await results, 'local')
        
        //if method is attributable solely to hydrolang-ml
        } else {
            maincomponent.LocalStore({name: params[0].input, value: data, type: props.method})
        }
    }
}

//Registering the element on the DOM
maincomponent.registerElement('data-mod', datamod)