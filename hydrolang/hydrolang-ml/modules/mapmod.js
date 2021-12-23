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

            "lat": {
                type: String,
                userDefined: true
            },

            "lon": {
                type: String,
                userDefined: true
            },

            "layertype": {
                type: String,
                userDefined: true
            },

            "type": {
                type: String,
                userDefined: true
            },

            "geotype": {
                type: String,
                userDefined: true
            },

            "name": {
                type: String,
                userDefined: true
            },

            "input": {
                type: String,
                userDefined: true
            },

            "varname": {
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
    }

    //main class to handle the inputs from the user.
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })

        const template = maincomponent.template('MAP-MOD')
        shadow.append(template.content.cloneNode(true))

        var mapmodprop = this.makePropertiesFromAttributes('map-mod')

        //The events of slots changes are dealth with here. Create
        //object parameters and append them to the global dictionaries
        this.shadowRoot.addEventListener("slotchange", (ev) => {
            var newdb = {}
            var r = ev.target.assignedElements()
            var ar = maincomponent.makePropertiesFromParameters(r)
            var newdb = {}
            for (var i = 0; i < ar.length; i++) {
                newdb[i] = {
                    [r[i].localName]: ar[i]
                }
            }
            maincomponent.db("maps")[mapmodprop.output] = newdb
            if (r.length === 0) {
                console.log(`No additional parameters detected for module maps,  ${mapmodprop.output}.`)
            } else {
                console.log(`Additional slots for module maps, ${mapmodprop.name}: ${ev.target.name} contains`, ev.target.assignedElements())

            }
            
        })
    }

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {
        var mapmodprop = this.makePropertiesFromAttributes('map-mod')
        //rendering only open street maps using leaflet right now.
        var mapconfig = {}
        var layertype = {}

        if(mapmodprop.method == "render") {
            await maincomponent.hydro().map.loader({maptype: "osm"})
            const style = document.createElement('style');
            style.innerHTML = `#map {
                height: 400px;
                width: 800px;
                margin-left: auto;
                margin-right: auto;
            }`
            document.head.appendChild(style)
            
            layertype = {type: "tile", name: "OpenStreetMap" }
            mapconfig = {
                maptype: "osm",
                lat: mapmodprop.lat,
                lon: mapmodprop.lon,
                zoom: 13,
                layertype: layertype
            }
            await maincomponent.hydro().map.renderMap(mapconfig)
            await maincomponent.hydro().map.Layers({maptype: "osm", layertype: {type: "draw"}})
        }

        if (mapmodprop.method === "Layers") {
            var x
            if (mapmodprop.type === "saved"){
                try{
                    x = JSON.parse(maincomponent.getresults(props.varname))
                } catch (error) {
                    console.log("Error in obtaining data.")
                }
            } if (mapmodprop.type === "userinput") {
                var data = []
                try {
                    data = maincomponent.datagrabber(this)
                    for (var j=0; j < data.length; j++){
                        data[j] = data[j].split(',').map(Number)
                    }
                } catch (error) {
                    console.log("Couldn't grab the data, revise input!")
                }
            }
            if (mapmodprop.layertype === "geodata"){
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
            } if (mapmodprop.layertype === "marker"){
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