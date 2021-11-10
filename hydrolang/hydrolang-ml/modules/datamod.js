import maincomponent from '../globals/functions.js'

/**
 * Web component for handling data module.
 * @class datamod
 */
export default class datamod extends HTMLElement {

    /**
     * Defines the allowable attributes in the component.
     * @method properties
     * @memberof datamod
     */
    static get properties() {
        return {
            "func": {
                type: String,
                userDefined: true
            },

            "saveob": {
                type: String,
                userDefined: true
            },

            "type": {
                type: String,
                userDefined: true
            },

            "grabob": {
                type: String,
                userDefined: true
            }
        }
    };

    /**
     * Observer of keys for each property of the HTML element.
     * @method observedAttributes
     * @memberof datamod
     */
    static get observedAttributes() {
        return Object.keys(datamod.properties)
    };

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
    };

    /**
     * Grabs the keys of an existing object with a delay.
     * @method grabKeyList
     * @memberof datamod
     * @param {Object} obj - object to grab keys from. 
     * @returns {Object[]} array of the keys.
     */
    grabKeyList(obj) {
        return new Promise(resolve => {
            setTimeout(() => {
                var x = Object.keys(obj)
                resolve(x)
            }, 1)
        })
    };

    /**
     * Confirms that the data has been downloaded and added to results.
     * @method handlewaterdata
     * @memberof datamod
     * @param {Object} data - retrieved data from any API.
     * @returns {console} confirmation of data. 
     */
    handlewaterdata(data) {
        console.log(`Data added to results!`)
    };

    /**
     * Item called from the window global database
     * @method callDatabase
     * @memberof datamod
     * @param {Object} item - item retrived from the database. 
     * @returns {Object} object required for further manipulation.
     */
    callDatabase(item) {
        return new Promise(resolve => {
            setTimeout(() => {
                var ob = {
                    ...maincomponent.db()[item]
                }
                resolve(ob)
            }, 10);
        })
    };

    /**
     * Promise to return the instance counter
     * @method globalcounter
     * @memberof datamod
     * @returns {Int} delays the counter variable from the global scope.
     */
    globalcounter() {
        return new Promise(resolve => {
            setTimeout(() => {
                var x = maincomponent.counter()
                resolve(x)
            }, 1000)
        })
    };

    /**
     * Create properties from attributes for the data module
     * @method modproperties
     * @memberof datamod
     * @returns {Object} - properties of the module
     */
    modproperties() {
        return this.makePropertiesFromAttributes('data-mod')
    };

    /**
     * Pushing results to the local storage
     * @method pushresults
     * @memberof datamod
     * @param {String} name - name of the object to store. 
     * @param {Object} obj - object to store
     * @returns {void}
     */
    pushresults(name, obj) {
        return new Promise(resolve => {
            setTimeout(() => {
                var ob = {
                    [name]: obj
                }
                Object.assign(maincomponent.results(), ob)
                resolve(ob)
            }, 1000);
        })
    };

    /**
     * Get results from the attribute
     * @method getresults
     * @memberof datamod
     * @param {String} name - name of the object to be retrieved. 
     * @returns {Object} object required from the attributes.
     */
    getresults(name) {
        var key = name
        if (key in maincomponent.results()) {
            return maincomponent.results()[key]
        } else {
            console.log()
        }
    };

    /**
     * Constructor that deals with the inputs from each slotted event.
     * Requires methods from the maincomponent function.
     * @constructor
     * @memberof datamod
     */
    constructor() {
        //Required super method.
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })
        //Creation of the template holding the web component.
        const template = maincomponent.template('DATA-MOD')
        shadow.append(template.content.cloneNode(true))
        //Creatioon of the properties of the module.
        var datamodprop = this.modproperties()


        //The events of slots changes are dealth with here. Create
        //object parameters and append them to the global dictionaries
        this.shadowRoot.addEventListener("slotchange", (ev) => {
            //Initialize the counter for the module. 
            maincomponent.count()
            var r = ev.target.assignedElements()
            var ar = maincomponent.makePropertiesFromParameters(r)
            var newdb = {}

            for (var i = 0; i < ar.length; i++) {
                newdb[i] = {
                    [r[i].localName]: ar[i]
                }
            }

            datamodprop.id = maincomponent.counter()
            maincomponent.db()[datamodprop.id] = newdb
            if (r.length == 0) {
                console.log(`No additional parameters detected for module ${datamodprop.id}.`)
            } else {
                console.log(`Additional slots for module ${datamodprop.id}: ${ev.target.name} contains`, ev.target.assignedElements())

            }

        })
    };

    //asynchronous callback to call the data module and potentially the map module.
    async connectedCallback() {

        var props = this.modproperties()

        if (props.func === "retrieve") {

            var x = await this.globalcounter()

            var res = await this.callDatabase(await x)

            var ob = await {
                ...res[0]
            }

            var nw = await {
                ...res[1]
            }

            var vf = {}
            vf = await Object.assign(ob.parameters, nw)

            var results = await maincomponent.hydro().data.retrieve(vf, this.handlewaterdata)
            this.pushresults(props.saveob, results)
            maincomponent.LocalStore(props.saveob, results, "save")

        } else if (props.func === "transform") {

            console.log("transform alive!")
            console.log(props)

        } else if (props.func === "upload") {

            var up = maincomponent.hydro().data.upload(props.type)
            var up2 = {
                [props.saveob]: await up
            }

            console.log("upload alive!")
            console.log(props)

        } else if (props.func === "download") {
            console.log("download alive!")
            console.log(props)
        }
    }

    shout() {
        console.log("Attached")
    }
}

//Defining the web components into the DOM
maincomponent.registerElement('data-mod', datamod)