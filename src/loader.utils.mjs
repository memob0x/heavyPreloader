/**
 *
 * @private
 * @static
 * @param {String} href
 * @returns {URL}
 */
export const getURL = (href) =>
    new URL(
        ((a) => {
            a.href = href;

            return a;
        })(document.createElement("a"))
    );

/**
 *
 * @private
 * @static
 * @param {Function} work
 * @returns {Worker}
 */
export const createWorker = (work) => {
    if (typeof work !== "function") {
        throw new TypeError(
            `Invalid argment of type ${typeof work} passed to Loader class internal "createWorker" function.`
        );
    }

    const url = URL.createObjectURL(
        new Blob(["(", work.toString(), ")()"], {
            type: "application/javascript",
        })
    );

    const worker = new Worker(url);

    URL.revokeObjectURL(url);

    return worker;
};
