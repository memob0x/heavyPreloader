/**
 * Load class, contains loaders, loads blobs...
 */
export default class Load {
    /**
     * Loaders collection
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
     */
    #loaders = {};

    /**
     * Registers a new loader for a given type
     * @param {String} type The resource mime type (or mime type prefix) eg. "image/png" or "image"
     * @param {Function} loader The load handler
     * @returns {Function} The loader handler itself
     */
    register(type, loader) {
        return this.#loaders[type] = loader;
    }

    /**
     * Loads a resource, which usually consists in attaching it to an existent DOM element
     * @throws {TypeError} Will throw an error if no loader is found (loader not registered exception or invalid resource type exception)
     * @param {Blob} blob The resource to be loaded in Blob form
     * @param {Object} options The resource load options
     * @returns {Promise} The resource load in promise form
     */
    async load(blob, options) {
        const type = blob.type;

        // Gets the loaders keys from blob type (full mime type, mime type prefix etc) used to get the right registered loader
        const keys = type.split("/").reduce((previous, next) => [type, previous, next]);

        // Loops through the loaders keys and, if found, calls the matched loader
        for (const key in keys) {
            const loader = keys[key];

            if (loader in this.#loaders) {
                return await this.#loaders[loader](blob, options);
            }
        }

        // No loader found, throws a type error
        throw new TypeError(`Invalid ${blob.type} media type passed to Loader class "load" method.`);
    }
}
