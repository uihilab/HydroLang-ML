import maincomponent from '../globals/functions.js'

/**
 * Web component for handling the map module
 * @class mapmod
 */
export default class mapmod extends HTMLElement {
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
    }

    //observer of keys for each property of the HTML element
    static get observedAttributes() {
        return Object.keys(mapmod.properties)
    }

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

    //main class to handle the inputs from the user.
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        var props = this.makePropertiesFromAttributes('map-mod')
        if(props.method != "render") {} if(props.method === "render") {        
        const template = maincomponent.template("mapmod", props.method)
        shadow.appendChild(template.content.cloneNode(true))
    }
    };

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {
        //rendering only open street maps using leaflet right now.
        var mapconfig = {}
        var layertype = {}

        var props = this.makePropertiesFromAttributes('map-mod')
        var params = maincomponent.makePropertiesFromParameters(this.children)

        if(props.method === "render") {
            await maincomponent.hydro().map.loader({maptype: "osm"})            
            layertype = {type: "tile", name: "OpenStreetMap" }
            mapconfig = {
                maptype: "osm",
                lat: params[0].lat,
                lon: params[0].lon,
                zoom: 20,
                layertype: layertype
            }
            await maincomponent.hydro().map.renderMap(mapconfig)
            await maincomponent.hydro().map.Layers({maptype: "osm", layertype: {type: "draw"}})
        }

        if (props.method === "Layers") {
            var x
            if (props.type === "saved"){
                try{
                    x = JSON.parse(maincomponent.getresults(props.varname))
                } catch (error) {
                    console.log("Error in obtaining data.")
                }
            } if (props.type === "userinput") {
                try {
                    data = maincomponent.datagrabber(this)
                    for (var j=0; j < data.length; j++){
                        data[j] = data[j].split(',').map(Number)
                    }
                } catch (error) {
                    console.log("Couldn't grab the data, revise input!")
                }
            }
            if (props.layertype === "geodata"){
                try{
                    layertype = {
                        type: "geodata", 
                        geotype: props.geo,
                        data: x, 
                        name:props.name, 
                        geotype:props.geotype
                    }
                    await maincomponent.hydro().map.Layers({maptype: "osm", layertype: layertype})
                } catch (error) {
                    console.log("No map found in screen! Please render map first.")
                }
            } if (props.layertype === "marker"){
                try{
                    layertype = {
                        type: "marker",
                        makertype: "marker",
                        coord: x,
                        name: props.name
                    }
                    await maincomponent.hydro().map.Layers({maptype: "osm", layertype: layertype})
                } catch (error) {
                    console.log("No map found in screen! Please render map first.")
                }
            }
        }
    }
}

//Defining the web components into the DOM
maincomponent.registerElement('map-mod', mapmod)