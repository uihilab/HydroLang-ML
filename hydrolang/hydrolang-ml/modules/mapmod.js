import maincomponent from '../globals/functions.js'

//Web component for handling data module.
export default class mapmod extends HTMLElement {
    static get properties() {
        return {

            "method": {
                type: String,
                userDefined: true
            },
        }
    }

    //observer of keys for each property of the HTML element
    static get observedAttributes() {
        return Object.keys(datamod.properties)
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

    grabKeyList(obj) {
        return new Promise(resolve => {
            setTimeout(() => {
                var x = Object.keys(obj)
                resolve(x)
            }, 1)
        })
    }

    //Item called from the database
    callDatabase(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                var ob = {
                    ...window.db[item]
                }
                resolve(ob)
            }, 10);
        })
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
            var datamodprop = this.makePropertiesFromAttributes('MAP-MOD')
            var ar = maincomponent.makePropertiesFromParameters(r)
            var newdb = {}
            for (var i = 0; i < ar.length; i++) {
                newdb[i] = {
                    [r[i].localName]: ar[i]
                }
            }
            window.db[datamodprop.id] = newdb
            console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedElements())
        })
    }

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {

        var x = await this.counter()

        var res = await this.callDatabase(x)

        var ob = await {
            ...res[0]
        }

        var vf = {}
        vf = await Object.assign(ob.parameters, nw)

        await window.hydro.map.loader(vf)

    }
}

//Defining the web components into the DOM
maincomponent.registerElement('map-mod', mapmod)