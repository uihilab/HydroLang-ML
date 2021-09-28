import Hydrolang from './hydro.js'

//Declare global dictionaries for handling parameters, results and HydroLang instance
window.hydro = new Hydrolang()
window.db = {}
window.results = {}

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
class datamod extends HTMLElement {
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

    //Create properties from passed parameters
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
            console.log(props[prop])
        }
        return props
    }

    //main class to handle the inputs from the user.
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        shadow.append(template.content.cloneNode(true))
        let web = document.querySelector('data-mod')

        //The events of slots changes are dealth with here. Create 
        //object parameters and append them to the global dictionaries
        this.shadowRoot.addEventListener("slotchange", (ev) => {
            if (ev.target.appendChild == "") {
                [...ev.target.assignedElements()]
                .filter(el => el.nodeName == 'func-parameter')
                    .map(el => el.slot = 'func-parameters')
            } else {
                var datamodprop = this.makePropertiesFromAttributes('data-mod')
                console.log(datamodprop)
                var r = ev.target.assignedElements()
                console.log(r)
                var ar = this.makePropertiesFromParameters(r)

                for (var i = 0; i < ar.length; i++) {
                    window.db[i] = {
                        [r[i].localName]: ar[i]
                    }
                }
                console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedElements())
            }
        })
    }

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {

        //this behavior can be changed depending on the type of data
        function handlewaterdata(data) {
            var x = data
            console.log(data);
            return x
        }

        //Need to create indexes for each of the parameters to append them to the dictionaries
        function callDatabase() {
            return new Promise(resolve => {
                setTimeout(() => {
                    var ob = {
                        ...window.db[0]
                    }
                    var ne = Object.assign(ob.parameters, db[1])
                    var y = Object.assign(ne, db[2])
                    resolve(y)
                }, 50);
            })
        }

        var asa = await callDatabase()
        var results = await window.hydro.data.retrieve(asa, handlewaterdata)
    }
}

//class for handling parameters
class parameters extends HTMLElement {
    //Solution to remove the name slot element from the parameters
    //And potentially implement for creating child elements.

    connectedCallback(parent = this.closest("data-mod")) {
        if (this.parentNode != parent) {
            if (parent) parent.append(this)
            else console.error(this.innerHTML, "NEEDS A PARENT ELEMENT!")
        }
    }
};

//Defining the web components into the DOM
window.customElements.define('data-mod', datamod)
window.customElements.define('func-parameter', parameters)