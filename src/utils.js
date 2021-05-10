/**
 * Gets an absolute url from a relative url
 * @param {String} path The relative url
 * @returns {URL} The newly created absolute url
 */
export const getURL = path => {
    const a = document.createElement('a');

    a.href = path;

    return new URL(a.href);
};
