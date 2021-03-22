import readBlobAsText from './text.mjs';

/**
 * Loads a given Blob object as an stylesheet
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an valid element (which does support "adoptedStyleSheets") is passed as "element" property that element is used to load the given stylesheet resource rules
 * @returns {Promise} The load promise
 */
export default async (blob, options) => {
    // Reads the blob as text
    const result = await readBlobAsText(blob);

    // Creates a new CSSStyleSheet instance
    const sheet = new CSSStyleSheet();

    // Reads the (previously red as text) Blob object as stylesheet rules
    await sheet.replace(result);

    // Possibly gets the given options "element" property
    const element = options?.element;

    // If the "element" property is passed and is an element which does support "adoptedStyleSheets"
    // then the stylesheet rules are "attached" to that element
    if (element instanceof Document || element instanceof ShadowRoot) {
        element.adoptedStyleSheets = [...element.adoptedStyleSheets, sheet];
    }

    // Returns the CSSStyleSheet instance
    return sheet;
};
