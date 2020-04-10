import { getURL } from "./loader.utils.mjs";
import lfetch from "./loader.fetch.mjs";
import lload from "./loader.load.mjs";

export default class Loader {
    constructor() {}

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
            return await lfetch.fetch(resource.href, options);
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
        return await lload.load(blob, options);
    }

    /**
     *
     * @param {String} type
     * @param {Function} loader
     * @returns {void}
     */
    register(type, loader) {
        return lload.register(type, loader);
    }
}
