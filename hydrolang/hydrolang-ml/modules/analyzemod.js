import maincomponent from "../globals/functions.js";

//Example for using the analyze module. Still on development
const template = document.createElement('template');
template.innerHTML =
    template.id = 'ANALYZE-MOD'
template.innerHTML =
    `
<style>
</style>
<div><slot></slot></div>
`;

export default class analyzemod extends HTMLElement {

    //properties defined per element
    static get properties() {
        return {
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
            },

            "datasource": {
                type: String,
                userDefined: true
            },
        }
    }

    //observer of keys for each property of the HTML element
    static get observedAttributes() {
        return Object.keys(analyzemod.properties)
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
        let web = document.querySelector('analyze-mod')

        var props = this.makePropertiesFromAttributes('analyze-mod')

        //the data is read in the screen from the span element

        if (props.datasource == "saved") {
            var results =  maincomponent.LocalStore(props.sourcename)
            console.log(results)
        }
        if (props.datasource == "input") {
        let data = web.querySelector('analyze-mod span')
        var values = data.textContent.split(",").map(x => parseInt(x))
        
        let res = maincomponent.hydro()[props.module][props.component][props.func](values)

        template.innerHTML =
            `
        <h3>The result of your calculation is: ${res} </h3>
        
        `
    }

    }

    connectedCallback() {}

    shout() {
        console.log("Analyze-Mod Attached")
    }
}

maincomponent.registerElement('analyze-mod', analyzemod)