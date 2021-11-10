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
        this.attachShadow({
            mode: 'open'
        })

        this.shadowRoot.innerHTML = '<slot></slot>'
        const slot = this.shadowRoot.querySelector('slot')

        slot.addEventListener('slotchange', (ev) => {
            const children = ev.target.assignedElements()
        })
    }
}

maincomponent.registerElement('hydrolang-ml', hydrolangml)