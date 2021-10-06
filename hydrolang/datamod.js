import Hydrolang from './hydro.js'
import basebuilder from './functions.js'
import h from './globals.js'

//Declare global dictionaries for handling parameters, results and HydroLang instance

window.hydro = new Hydrolang()
window.db = {}
window.results = {}
window.instancecounter = 0

//Template attached to the module
const template = document.createElement('template');
template.id = 'DATA-MOD'
template.innerHTML =
    `
<style>
</style>
<div><slot name=func-parameters></slot></div>
<slot></slot>
`;

//Web component for handling data module.
export default class datamod extends HTMLElement {
    static get properties() {
        return {

            "id": {
                type: String,
                userDefined: true
            },

            "func": {
                type: String,
                userDefined: true
            },

            "saveob": {
                type: String,
                userDefined: true
            },
        }
    }

    //observer of keys for each property of the HTML element
    static get observedAttributes() {
        return Object.keys(datamod.properties)
    }

    makePropertiesFromParameters(elem) {
        let attr = []
        var names = []

        for (var i = 0; i < elem.length; i++) {

            var props = {}
            names.push(elem[i].getAttributeNames())
            for (var j = 0; j < names[i].length; j++) {
                var prop = names[i][j]
                props[prop] = elem[i].getAttribute(prop)
            }
            attr.push(props)
        }
        return attr
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

    counter(){
       window.instancecounter ++
       return window.instancecounter
    }


    //this behavior can be changed depending on the type of data
    handlewaterdata(data) {
        console.log(data)
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

    modproperties(){
        return basebuilder.makePropertiesFromAttributes('data-mod')
    }

    //main class to handle the inputs from the user.
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        shadow.append(template.content.cloneNode(true))

        //The events of slots changes are dealth with here. Create
        //object parameters and append them to the global dictionaries
        this.shadowRoot.addEventListener("slotchange", (ev) => {

                var r = ev.target.assignedElements()
                var datamodprop = this.makePropertiesFromAttributes('data-mod')
                //var datamodprop = basebuilder.makePropertiesFromAttributes('data-mod')
                // var ar = this.makePropertiesFromParameters(r)
                var ar = basebuilder.makePropertiesFromParameters(r)
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
        var nw = await {
            ...res[1]
        }

        var vf = {}
        vf = await Object.assign(ob.parameters, nw)

        await window.hydro.data.retrieve(vf, this.handlewaterdata)

    }

    shout() {
        console.log("Attached")
    }
}

//Defining the web components into the DOM
basebuilder.registerElement('data-mod', datamod)