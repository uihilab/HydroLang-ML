import maincomponent from '../globals/functions.js'

/**
 * Web component for handling visualize module.
 * @class visualizemod
 */
export default class visualizemod extends HTMLElement {

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

        //Appends the attribute slot into the web component so that it can be correctly slotted.
        this.setAttribute("slot", "visualizemod")
    };

    /**
     * Function dealing with the inputs passed as data or attributes by the user.
     * @callback
     * @memberof visualizemod
     */
    async connectedCallback() {

        //Main constructor of properties, parameters, attributes, and data
        var props = maincomponent.makePropertiesFromAttributes(this)
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)


        //HydroLang library caller
        maincomponent.hydro().visualize[props.method]({params: params[0], args: params[1], data: await data})
}
}

//Registering the element on the DOM
maincomponent.registerElement('visualize-mod', visualizemod)