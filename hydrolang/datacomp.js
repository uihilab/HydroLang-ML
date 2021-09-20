import Hydrolang from './hydro'

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

const template2 = document.createElement('template');

template2.innerHTML = 
`
`



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
    
    connectedCallback(parent = this.closest("data-mod")) {
        if (this.parentNode != parent) {
            if (parent) parent.append(this)
            else console.error(this.innerHTML, "NEEDS A PARENT ELEMENT!")
        }
    }
}

class parameters extends HTMLElement {
    //Solution to remove the name slot element from the parameters
    constructor() {
        super()
        let shadow = this.attachShadow({mode: 'open'})
        shadow.append(document.getElementById(this.nodeName).content.cloneNode(true))

        this.shadowRoot.addEventListener("slotchange", (ev) => {
            if (ev.target.appendChild =="") {
                [...ev.target.assignedElements()]
                .filter(el => el.nodeName == 'parameter')
                .map(el => el.slot = "parameters");
            } else console.log(`SLOT: ${ev.target.name} got`, ev.target.assignedNodes())
        })}
    
    };

window.customElements.define('data-mod', datamod)
window.customElements.define('parameter', parameters)