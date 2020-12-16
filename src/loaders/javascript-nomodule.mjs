import genericLoader from './generic.mjs';

/**
 * Loads a given Blob object as an javascript file
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an valid element is passed as "element" property that element is used to load the given javascript resource code
 * @returns {Promise} The load promise
 */
export default async (blob, options) => genericLoader(
    // Rebinds the Blob object parameter
    blob,

    // Rebinds the options object parameter
    options,

    // Element loader must be of HTMLScriptElement
    HTMLScriptElement,
    
    // Element loader must be a script element
    'script',

    // Existent element in which the script will be appended
    // the append operation would trigger the resource to load
    document.head,
    
    // Success events to be listened
    ['readystatechange', 'load'],
    
    // Errors events to be listened
    [],

    // Before events attachment hook
    (script, url) => {
        // Sets the script element as async (since this it is an async operation by definition)
        script.async = true;

        // Sets the script src (load will be triggered by element insertion in DOM though)
        script.src = url;
    }
);
