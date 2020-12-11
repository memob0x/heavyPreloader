import { getURL } from "./utils.mjs";
import Fetch from "./fetch.mjs";
import Load from "./load.mjs";

export default class Loader {
    /**
     * 
     */
    #fetch = new Fetch();

    /**
     * 
     */
    #load = new Load();

    /**
     * Fetches one or more resources url
     * @param {Array.<String>|Array.<URL>|String|URL} resource The resource(s) url to be fetched in a separate thread
     * @param {Object} options The fetch options object
     * @returns {Array.<Promise>|Promise} The fetch promise(s)
     */
    async fetch(resource, options) {
        // ...
        if (Array.isArray(resource)) {
            return await resource.map((a) => this.fetch(a, options));
        }

        // ...
        if (typeof resource === "string") {
            return await this.fetch(getURL(resource), options);
        }

        // ...
        if (resource instanceof URL) {
            return await this.#fetch.fetch(resource.href, options);
        }

        // ...
        throw new TypeError(
            `Invalid argment of type ${typeof resource} passed to Loader class "fetch" method.`
        );
    }

    /**
     * Loads one or more resources url considering the passed options object and the resource mime type to be loaded
     * @param {Array.<String>|Array.<URL>|Array.<Blob>|String|URL|Blob} resource The resource(s) to be loaded
     * @param {Object} options The loader type options
     * @returns {Array.<Promise>|Promise} The load promise(s)
     */
    async load(resource, options) {
        // ...
        if (Array.isArray(resource)) {
            const isArrayOpts = Array.isArray(options);

            return await resource.map((a, i) =>
                this.load(a, isArrayOpts ? options[i] : options)
            );
        }

        // ...
        const blob =
            resource instanceof Blob
                ? resource
                : await this.fetch(resource, options);

        // ...
        return await this.#load.load(blob, options);
    }

    /**
     *
     * @param {String} type
     * @param {Function} loader
     * @returns {void}
     */
    register(type, loader) {
        return this.#load.register(type, loader);
    }
}
