import Hydrolang from './hydro.js'

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

//Template attached to the module
const template2 = document.createElement('template');
template.id = 'HYDROLANG-ML'
template.innerHTML =
    `
<style>
</style>
<div><slot name=data-mod></slot></div>
<slot></slot>
`;

class hydrolangml extends HTMLElement {
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        shadow.append(template2.content.cloneNode(true))

        //The events of slots changes are dealth with here. Create 
        //object parameters and append them to the global dictionaries
        this.shadowRoot.addEventListener("slotchange", (ev) => {
            if (ev.target.appendChild == "") {
                [...ev.target.assignedElements()]
                .filter(el => el.nodeName == 'data-mod')
                    .map(el => el.slot = 'data-mod')
            } else {
                console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedElements())
            }
        })
    }
}


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
        }
        return props
    }

    grabKeyList(obj) {
        return new Promise(resolve => {
            setTimeout(() => {
                var x = Object.keys(obj)
                if (window.instancecounter < x.length) {
                    window.instancecounter++
            } if (window.instancecounter = x.length) {
                //NOT WORKING!!! fix
                window.instancecounter = 0
            }
                resolve(x)
            }, 1)
        })
    }


    //this behavior can be changed depending on the type of data
    handlewaterdata(data) {
        var x = data
        console.log(data);
        return x
    }

    //Item called from the database
    callDatabase(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                var ob = {
                    ...window.db[item]
                }
                resolve(ob)
            }, 50);
        })
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
            if (ev.target.appendChild == "") {
                [...ev.target.assignedElements()]
                .filter(el => el.nodeName == 'func-parameter')
                    .map(el => el.slot = 'func-parameters')
            } else {
                var r = ev.target.assignedElements()
                var datamodprop = this.makePropertiesFromAttributes('data-mod')
                var ar = this.makePropertiesFromParameters(r)
                var newdb = {}
                for (var i = 0; i < ar.length; i++) {
                    newdb[i] = {
                        [r[i].localName]: ar[i]
                    }
                }
                window.db[datamodprop.id] = newdb
                console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedElements())
            }
        })
    }

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback(parent = this.closest("hydrolang-ml")) {
        var keyvalues = await this.grabKeyList(window.db)

        if (parent) {
        var x = await window.instancecounter

        var res = await this.callDatabase(x)

        var ob = await {
            ...res[0]
        }
        var nw = await {
            ...res[1]
        }
        var vf = {}
        vf = await Object.assign(ob.parameters, nw)

        results = await window.hydro.data.retrieve(vf, this.handlewaterdata)

        if (window.instancecounter > keyvalues.length) {
            window.instancecounter = keyvalues.length
        } else {
            window.instancecounter
        }
        parent.append(this)
    }
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
window.customElements.define('hydrolang-ml', hydrolangml)