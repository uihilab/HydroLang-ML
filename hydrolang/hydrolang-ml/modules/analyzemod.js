import maincomponent from "../globals/functions.js";

/**
 * Web component for handling the analyze module of HydroLang.
 * @class analyzemod
 */

export default class analyzemod extends HTMLElement {

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

        //Appends the attribute slot into the web component so that it can be correctly slotted.
        this.setAttribute("slot", "analyzemod")
    }

    /**
     * Async connected callback. All analyze functions are parsed through here.
     * @callback
     * @memberof analyzemod
     */
    async connectedCallback() {
        var props = maincomponent.makePropertiesFromAttributes(this)
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)

        var res = maincomponent.hydro().analyze[props.component][props.method]({params: params[0], args: params[1], data: data})
        maincomponent.pushresults(params[0].output, await res, 'local')
    }
}

//Registering the element on the DOM
maincomponent.registerElement('analyze-mod', analyzemod)