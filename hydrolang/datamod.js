import Hydrolang from './hydro.js'

//convert this guy into a global variable using window element
const hydro = new Hydrolang()

var db = {}


const template = document.createElement('template');
template.innerHTML = 
`
<style>
    h3 {
        color: coral;
    }
</style>
<div class="hydrolang-web">
    <h3></h3>
</div>

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

    //Reusable property maker. Returns the names and values of the attributes passed.
    makePropertiesFromAttributes(elem){
        let ElemClass = customElements.get(elem);
        let attr = ElemClass.observedAttributes;
        if (!attr) return null;
            var props = {}

        for(var i = 0; i < attr.length; i++){
            var prop = attr[i]
            props[prop] = this.getAttribute(attr[i])
            console.log(props[prop])
        }
        return props
    }

    constructor() {
        super()
        let shadow = this.attachShadow({mode: 'open'})
        shadow.append(document.getElementById(this.nodeName).content.cloneNode(true))

        let names = []
        let props = []

        this.shadowRoot.addEventListener("slotchange", (ev) => {
            if (ev.target.appendChild =="") {
                [...ev.target.assignedElements()]
                .filter(el => el.nodeName == 'func-parameter')
                .map(el => el.slot = 'func-parameters')
            } else 
            {
                var r = ev.target.assignedElements()
                for (var i =0; i < r.length; i++) {
                    names.push(r[i].getAttributeNames())
                    props.push(r[i].getAttribute(names[0][i]))
                    for (var j = 0; j < names.length; j++) {
                        console.log(names[i][j])
                    }
                }
                console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedElements())
        }
        })
        console.log(names, props)
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