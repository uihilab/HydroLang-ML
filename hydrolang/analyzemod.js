import Hydrolang from "./hydro.js";

//convert this guy into a global variable using window element
const hydro = new Hydrolang()

window.db = {}


//Example for using the analyze module. Still on development
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

class hydroweb extends HTMLElement {

    //properties defined per element
    static get properties() {
        return {
            "module": {
                type: String,
                userDefined: true
            },

            "component": {
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
            }
        }
    }

    //observer of keys for each property of the HTML element
    static get observedAttributes() {
        return Object.keys(hydroweb.properties)
    }

    //Reusable property maker. Returns the names and values of the attributes passed.
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

    //this constructor creates a shadow root and appends it to DOM. This can be done as a separate element.   
    constructor() {
        super();
        let shadow = this.attachShadow({
            mode: 'open'
        });
        shadow.appendChild(template.content.cloneNode(true));
        let web = document.querySelector('hydrolang-web')

        //the data is read in the screen from the span element
        let data = web.querySelector('hydrolang-web span')
        var values = data.textContent.split(",").map(x => parseInt(x))

        var props = this.makePropertiesFromAttributes('hydrolang-web')
        console.log(props)

        let res = hydro[props.module][props.component][props.func](values)

        template.innerHTML =
            `
        <h3>The result of your calculation is: ${res} </h3>
        
        `

        Object.assign(window.db, {
            [props.saveob]: res
        })

        console.log(window.db)
    }

    connectedCallback() {}
}

console.log(db)


window.customElements.define('hydrolang-web', hydroweb)