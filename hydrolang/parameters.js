import basebuilder from './functions.js';

//class for handling parameters
export default class parameters extends HTMLElement {
    //Solution to remove the name slot element from the parameters
    //And potentially implement for creating child elements.

    connectedCallback(parent = this.closest('data-mod')) {
        if (this.parentNode != parent) {
            if (parent) parent.append(this)
            else console.error(this.innerHTML, "NEEDS A PARENT ELEMENT!")
        }
    }
};

basebuilder.registerElement('func-parameters', parameters)