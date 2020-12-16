import genericLoader from './generic.mjs';

/**
 * Loads a given Blob object as an image
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an image element is passed as "element" property that image is used to load the given image resource
 * @returns {Promise} The load promise
 */
export default async (blob, options) => genericLoader(
    blob,
    options,

    null,

    HTMLImageElement,
    'img',

    ['load'],
    ['error'],

    () => {},
    (image, url) => {
        // Sets image src, triggers "load" or "error"
        image.src = url;
    }
);
