import maincomponent from '../globals/functions.js';

/**
 * Main class driver for the HydroLang.js components
 * @class hydrolangml
 */
export default class hydrolangml extends HTMLElement {
    /**
     * Attaches elements and hears slot exchange.
     * @constructor
     * @memberof hydrolangml
     */
    constructor() {
        super()
        let shadow = this.attachShadow({
            mode: 'open'
        })

        const template = maincomponent.template("hydrolangml")
        shadow.appendChild(template.content.cloneNode(true))
    }

    connectedCallback(){
    };
}

maincomponent.registerElement('hydrolang-ml', hydrolangml)