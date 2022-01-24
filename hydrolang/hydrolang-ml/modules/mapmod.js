import maincomponent from '../globals/functions.js'

/**
 * Web component for handling the map module
 * @class mapmod
 */
export default class mapmod extends HTMLElement {

    /**
     * Defines the allowable attributes in the component.
     * @method properties
     * @memberof mapmod
     */
    static get properties() {
        return {
            "method": {
                type: String,
                userDefined: true
            },
            "type": {
                type: String,
                userDefined: true
            }
        }
    };

    /**
     * Observer of keys for each property of the HTML element.
     * @method observedAttributes
     * @memberof mapmod
     */
    static get observedAttributes() {
        return Object.keys(mapmod.properties)
    };

    /**
     * Creates properties from allowable attributes for the web component.
     * @method makePropertiesFromAttributes
     * @memberof mapmod
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
    };

    /**
     * Function dealing with the inputs passed as data or attributes by the user.
     * @callback
     * @memberof mapmod
     */
    async connectedCallback() {
        this.setAttribute("slot", "mapmod")
        //rendering only open street maps using leaflet right now.
        var props = this.makePropertiesFromAttributes('map-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)

        if(props.method === "render") {           
            maincomponent.hydro().map.renderMap(props, params, data)
            maincomponent.hydro().map.Layers({maptype: "osm", layertype: {type: "draw"}})
        }

        if (props.method === "Layers") {
            try {
            new Promise(resolve => {
                setTimeout(() => {
                    maincomponent.hydro().map.Layers(props, params, data)
                }, 1000)}); 
            } catch (error) {
                console.log("No map found in screen! Please render map first.")
            }
    }
}
}

//Defining the web components into the DOM
maincomponent.registerElement('map-mod', mapmod)