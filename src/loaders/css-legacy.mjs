import genericLoader from './generic.mjs';

/**
 * Loads a given Blob object as an stylesheet
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an valid element is passed as "element" property that element is used to load the given stylesheet resource rules
 * @returns {Promise} The load promise
 */
export default async (blob, options) => genericLoader(
    // Rebinds the Blob object parameter
    blob,

    // Rebinds the options object parameter
    options,
    
    // Element loader must be of HTMLLinkElement
    HTMLLinkElement,
    
    // Element loader must be a link element
    'link',

    // Existent element in which the link will be appended
    // the append operation would trigger the resource to load
    document.head,

    // Success events to be listened
    ['load'],
    
    // Error events to be listened
    ['error'],

    // Before events attachment hook
    (link, url, success) => {
        // Link [rel="stylesheet"] is a mandatory link attribute value
        link.rel = 'stylesheet';

        // Sets the link src (load will be triggered by element insertion in DOM though)
        link.href = url;

        // This is an "ancient" technique to make the stylesheet onload
        // listening more bulletproof (cross-browser levelling)
        // NOTE: see https://github.com/filamentgroup/loadCSS/blob/master/src/loadCSS.js#L52
        const sheets = document.styleSheets;
        let i = sheets.length;
        while (i--) {
            if (sheets[i].href === url) {
                success();
            }
        }
    }
);
