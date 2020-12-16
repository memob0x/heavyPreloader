import genericLoader from './generic.mjs';

/**
 * Loads a given Blob object as an image
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an image element is passed as "element" property that image is used to load the given image resource
 * @returns {Promise} The load promise
 */
export default async (blob, options) => genericLoader(
    // Rebinds the Blob object parameter
    blob,

    // Rebinds the options object parameter
    options,

    // Element loader must be of HTMLImageElement
    HTMLImageElement,

    // Element loader must be a an image element
    'img',

    // Image doesn't need to be appended, load process would occur anyway
    null,

    // Success events to be listened
    ['load'],

    // Error events to be listened
    ['error'],

    // Before events attachment hook (nothing)
    () => {},

    // After events attachment hook, sets image src which triggers "load" or "error"
    (image, url) => (image.src = url)
);
