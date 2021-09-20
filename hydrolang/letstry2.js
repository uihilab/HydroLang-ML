import Hydrolang from "./hydro.js";

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

class hydroweb extends HTMLElement {

    //properties defined per element
    static get properties(){
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
    static get observedAttributes(){
        return Object.keys(hydroweb.properties)
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

    //this constructor creates a shadow root and appends it to DOM. This can be done as a separate element.   
    constructor () {
        super();
        let shadow = this.attachShadow({ mode : 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        let web = document.querySelector('hydrolang-web')

        //the data is read in the screen from the span element
        let data  = web.querySelector('hydrolang-web span')
        var values = data.textContent.split(",").map(x=>parseInt(x))

        var props = this.makePropertiesFromAttributes('hydrolang-web')
        console.log(props)

        let res = hydro[props.module][props.component][props.func](values)

        template.innerHTML = 
        `
        <h3>The result of your calculation is: ${res} </h3>
        
        `

        Object.assign(db, {[props.saveob]: res})

        console.log(db)
    }

    connectedCallback(){
    }
}


window.customElements.define('hydrolang-web', hydroweb)

// window.onload = function () {
//     let request = window.indexedDB.open('notes_db', 1)

//     request.onerror = function () {
//         console.log('Failed to open');
//     };

//     request.onsuccess = function() {
//         console.log('Open succesfully');

//         db = request.result;
//     }

//     request.onupgradeneeded = function(e) {
//         let db = e.target.result;

//         let objectStore = db.createObjectStore('results', {keyPath: 'id', autoIncrement: true})

//         objectStore.createIndex("result", "result", {unique: false})
//         console.log('Database setup succesful')
//     }

//     function addData(e) {
//         e.preventDefault();

//         let newItem = {result: result}

//         let transaction = db.transaction([results], 'readwrite');

//         let objectStore = transaction.objectStore('results')

//         let request = objectStore.add(newItem)
//         request.onsuccess = function() {
//             result.value = ''
//         }
//     }

// };

