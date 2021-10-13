import basebuilder from './functions.js';

export default class hydrolangml extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        })

        this.shadowRoot.innerHTML = '<slot></slot>'
        const slot = this.shadowRoot.querySelector('slot')

        slot.addEventListener('slotchange', (ev) => {
            const children = ev.target.assignedElements()
            // children.forEach(child => {
            //     child.shout()
            // })
        })
    }
}

basebuilder.registerElement('hydrolang-ml', hydrolangml)