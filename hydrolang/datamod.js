import Hydrolang from './hydro.js'

//convert this guy into a global variable using window element
window.hydro = new Hydrolang()
window.db = {}
window.results = {}

const template = document.createElement('template');
template.id = 'DATA-MOD'
template.innerHTML = 
`
<style>
</style>
<div><slot name=func-parameters></slot></div>
<slot></slot>
`;

class datamod extends HTMLElement {
    static get properties () {
        return {
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
    static get observedAttributes(){
        return Object.keys(datamod.properties)
    }

    //Specifically done for parameters that have 
    makePropertiesFromParameters(elem){
        let attr=[]
        var names = []
        
        for (var i =0; i < elem.length; i++) {
            
            var props = {}
            names.push(elem[i].getAttributeNames())
            for (var j=0; j < names[i].length; j++) {
                var prop = names[i][j]
                props[prop] = elem[i].getAttribute(prop)
            }
            attr.push(props)
        }
        return attr
    }

    async waitforproperties(){
        await db
        return Promise.resolve(db)
       }

    //this behavior can be changed depending on the type of data
    handlewaterdata(data) {
        console.log(data);
    }

    constructor() {
        super()
        let shadow = this.attachShadow({mode: 'open'})
        shadow.append(template.content.cloneNode(true))


        this.shadowRoot.addEventListener("slotchange", (ev) => {
            if (ev.target.appendChild =="") {
                [...ev.target.assignedElements()]
                .filter(el => el.nodeName == 'func-parameter')
                .map(el => el.slot = 'func-parameters')
            } else 
            {
                var r = ev.target.assignedElements()
                var ar= this.makePropertiesFromParameters(r)

                for (var i = 0; i < ar.length; i++) {
                    window.db[i] = {[r[i].localName]: ar[i]}
                }
                console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedElements())
        }
        }
        )
    }
    async connectedCallback(){           
       
       var x = setTimeout(() => {
           var ob = {...window.db[0]}
           var x = Object.assign(ob.parameters, db[1])
           var y = Object.assign(ob, db[2])
            return y
       }, 20);



       await window.hydro.data.retrieve(x, this.handlewaterdata)
    }
    
}

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

window.customElements.define('data-mod', datamod)
window.customElements.define('func-parameter', parameters)