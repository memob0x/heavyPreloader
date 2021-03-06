import getAbsoluteUrl from './get-absolute-url.js';
import Fetch from './fetch.js';
import Load from './load.js';

/**
 * The main library class, exposes methods to grant resources load in a separate thread
 * and custom load handlers registration
 */
export default class ThreadFetcher {
    /**
     * Loader instance fetcher
     */
    #fetch = new Fetch();

    /**
     * Loader instance loader
     */
    #load = new Load();

    /**
     * Fetches one or more resources urls
     * @throws {TypeError} Throws if a unsupported type resource is passed
     * @param {Array.<String>|Array.<URL>|String|URL} resource The resource(s) url to be fetched in a separate thread
     * @param {Object} options The fetch options object
     * @returns {Array.<Promise>|Promise} The fetch promise(s)
     */
    async fetch(resource, options) {
        // Multiple resources (array) support (through recursion)
        if (Array.isArray(resource)) {
            // TODO: replace with for loop
            return await Promise.all(resource.map(r => this.fetch(r, options)));
        }

        // If a String url is passed
        if (typeof resource === 'string') {
            return await this.fetch(getAbsoluteUrl(resource), options);
        }

        // if an URL object is passed
        if (resource instanceof URL) {
            return await this.#fetch.fetch(resource.href, options);
        }

        // Unsupported type, throws an error
        throw new TypeError(`Invalid argment of type ${typeof resource} passed to Loader class "fetch" method.`);
    }

    /**
     * Loads one or more resources url considering the passed options object and the resource mime type to be loaded
     * @param {Array.<String>|Array.<URL>|Array.<Blob>|String|URL|Blob} resource The resource(s) to be loaded
     * @param {Object} options The loader type options
     * @returns {Array.<Promise>|Promise} The load promise(s)
     */
    async load(resource, options) {
        // Multiple resources (array) support (through recursion)
        if (Array.isArray(resource)) {
            const isArrayOpts = Array.isArray(options);

            // TODO: replace with for loop
            return await Promise.all(resource.map((a, i) => this.load(a, isArrayOpts ? options[i] : options)));
        }

        // Blob reduction, if instance is not a Blob tries to fetch the resource (calls "fetch" method)
        const blob = resource instanceof Blob ? resource : await this.fetch(resource, options);

        // Finally loads the blob thorugh the right loader (previously registered with "register" method)
        return await this.#load.load(blob, options);
    }

    /**
     * Registers a new loader for a given type
     * @param {String} type The resource mime type (or mime type prefix) eg. "image/png" or "image"
     * @param {Function} loader The load handler
     * @returns {Function} The loader handler itself
     */
    register(type, loader) {
        return this.#load.register(type, loader);
    }
}
