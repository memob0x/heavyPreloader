/**
 * Loads a given Blob object as an image
 * @param {Blob} blob The resource Blob object to be loaded
 * @param {Object} options Loader options, if an image element is passed as "element" property that image is used to load the given image resource
 * @returns {Promise} The load promise
 */
export default async (blob, options) => {
    // Creates a resource url from given blob object
    const url = URL.createObjectURL(blob);

    // Awaits the given image resource "load" or "error"
    const result = await new Promise((resolve, reject) => {
        // Image load process target
        const image = options?.element instanceof HTMLImageElement ? options.element : new Image();

        /**
         * Attaches or detaches image events
         * @param {String} type The action to be performed (can be "add" or "remove")
         * @returns {void} Nothing
         */
        const events = type => {
            // Handles image "load" event
            image[`${type}EventListener`]("load", onload);

            // Handles image "error" event
            image[`${type}EventListener`]("error", onerror);
        };

        /**
         * Detaches image events
         * @returns {void} Nothing
         */
        const clean = () => events("remove");

        /**
         * Image load handler
         * @param {Event} event The "load" event object
         * @returns {void} Nothing
         */
        const onload = event => {
            clean();

            resolve(event);
        };

        /**
         * Image error handler
         * @returns {void} Nothing
         */
        const onerror = () => {
            clean();

            reject(new Error(`Error loading image ${blob.type}`));
        };

        // Attaches image events
        events("add");

        // Sets image src, triggers "load" or "error"
        image.src = url;
    });

    // Unregister the (possibly) created Object URL
    URL.revokeObjectURL(url);

    // Returns the resolved or unresolved promise
    return result;
};
