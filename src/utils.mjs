// A link element closure, used to create reliable absolute urls
const a = document.createElement('a');

/**
 * Gets an absolute url from a relative url
 * @param {String} path The relative url
 * @returns {URL} The newly created absolute url
 */
export const getURL = path => {
    a.href = path;

    return new URL(a.href);
};
