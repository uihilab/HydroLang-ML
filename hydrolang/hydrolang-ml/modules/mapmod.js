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
        var props = this.makePropertiesFromAttributes('map-mod')
        if(props.method != "render") {} if(props.method === "render") {        
            const template = maincomponent.template("mapmod", props.method)
            shadow.appendChild(template.content.cloneNode(true))
    }
    };

    /**
     * Creates an object to be used as a layer depending on the type of
     * input by the user.
     * @method typeofLayer
     * @memberof mapmod
     * @returns {Object} - 
     */
    typeofLayer(props, params, data) {
        if(!data || data == undefined || data == null) {data = null}
        var mapconfig = {}
        var layertype = {}
        console.log(data)

        if (props.method === "render") {
            layertype = {type: "tile", name: params[0].name}
            mapconfig = {
                maptype: "osm",
                lat: params[0].lat,
                lon: params[0].lon,
                zoom: 40,
                layertype: layertype
            }
        } if(props.method === "Layers") {
            layertype = {
                type: params[0].layer,
                markertype: params[0].layer, 
                geotype: params[0].geo,
                data: data, 
                name:params[0].name, 
                coord: data,
            }
            mapconfig = {maptype: "osm", layertype: layertype}
        }
        return mapconfig
    }

    /**
     * Function dealing with the inputs passed as data or attributes by the user.
     * @callback
     * @memberof mapmod
     */
    async connectedCallback() {
        //rendering only open street maps using leaflet right now.
        var props = this.makePropertiesFromAttributes('map-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)
        var data = maincomponent.datalistener(this)
        var config = this.typeofLayer(props, params, data)

        if(props.method === "render") {
            await maincomponent.hydro().map.loader({maptype: "osm"})            
            await maincomponent.hydro().map.renderMap(config)
            await maincomponent.hydro().map.Layers({maptype: "osm", layertype: {type: "draw"}})
        }

        if (props.method === "Layers") {
            try {
            new Promise(resolve => {
                setTimeout(() => {
                    maincomponent.hydro().map.Layers(config)
                }, 1000)});
            } catch (error) {
                console.log("No map found in screen! Please render map first.")
            }
    }
}
}

//Defining the web components into the DOM
maincomponent.registerElement('map-mod', mapmod)