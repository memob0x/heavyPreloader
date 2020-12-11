const a = document.createElement("a");

/**
 *
 * @param {String} path
 * @returns {URL}
 */
export const getURL = (path) => {
    a.href = path;

    return new URL(a.href);
};
