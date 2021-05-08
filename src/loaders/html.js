import readBlobAsText from './text.js';

/**
 * Loads a given Blob object as an html
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an valid element is passed as "element" property that element is used as a "host" for new html, also "filter" property is used to traverse fetched HTML
 * @returns {Promise} The load promise
 */
export default async (blob, options) => {
    // DOM parser instance
    const parser = new DOMParser();

    // Reads the blob as text
    let result = await readBlobAsText(blob);

    // If a "filter" property is passed in "option" object
    // then that is used to traverse the new HTML to match that filter among nodes
    if (typeof options?.filter === 'string' && options?.filter?.length) {
        // The Blob object red as text is now parsed as HTML
        result = parser.parseFromString(result, 'text/html').body;
        
        // The given filter option is used to traverse that parsed HTML
        result = [...result.querySelectorAll(options.filter)];

        // All matches are combined together once again as a string
        result = result
            .map(x => x.outerHTML)
            .reduce((previousValue, currentValue) => previousValue + currentValue, []);
    }

    // If an "element" property is passed in "option" object
    // then that element is used as a host for the red (and possibly filtered) HTML string
    if ( options?.element instanceof HTMLElement && typeof result === 'string' ) {
        options.element.innerHTML = result;
    }

    // The final red (and possibly filtered) HTML string
    return result;
};
