/**
 * Module wrapper for using in HTML.
 * @module hydrolangml
 * @extends maincomponent
 * @extends parameters
 * @extends datamod
 * @extends mapmod
 * @extends analyzemod
 * @extends hydrolangml
 * @extends visualizemod
 */

export * as visualizemod from './modules/visualizemod.js';
export * as maincomponent from './globals/functions.js';
export * as parameters from './wrappers/parameters.js';
export * as datamod from './modules/datamod.js';
export * as mapmod from './modules/mapmod.js';
export * as analyzemod from './modules/analyzemod.js';
export * as hydrolangml from './wrappers/hydrolangmod.js';