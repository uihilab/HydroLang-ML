import maincomponent from '../globals/functions.js'

/**
 * Web component for handling the map module
 * @class mapmod
 */
export default class mapmod extends HTMLElement {

    /**
     * Constructor to open the shadow DOM and creating a template for the component.
     * @constructor
     * @memberof mapmod
     */
    constructor() {
        //Required super method.
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        //Creates a template and attaches the web component to it.   
        const template = maincomponent.template("mapmod")
        shadow.appendChild(template.content.cloneNode(true))

        //Appends the attribute slot into the web component so that it can be correctly slotted.
        this.setAttribute("slot", "mapmod")
    };

    /**
     * Function dealing with the inputs passed as data or attributes by the user.
     * @callback
     * @memberof mapmod
     */
    async connectedCallback() {

        //rendering only open street maps using leaflet right now.
        var props = maincomponent.makePropertiesFromAttributes(this)
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)

        if(props.method === "render") {
            maincomponent.hydro().map.renderMap({args: params[0]})
        }

        if (props.method === "Layers") {
            try {
            new Promise(() => {
                setTimeout(() => {
                    maincomponent.hydro().map.Layers({args: params[0], data: data})
                }, 1000)}); 
            } catch (error) {
                console.log("No map found in screen! Please render map first.")
            }
    }
}
}

//Registering the element on the DOM
maincomponent.registerElement('map-mod', mapmod)