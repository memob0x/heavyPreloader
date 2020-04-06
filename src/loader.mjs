import lfetch from "./loader.fetch.mjs";
import lload from "./loader.load.mjs";

export default class Loader {
    /**
     *
     */
    constructor() {}

    /**
     *
     * @param {Array.<String>|Array.<URL>|String|URL} arg
     * @param {Object} options
     * @returns {Array.<Promise>|Promise}
     */
    async fetch(arg, options) {
        // ...
        if (Array.isArray(arg)) {
            return await arg.map((a) => this.fetch(a));
        }

        // ...
        if (typeof arg === "string") {
            const a = document.createElement("a");

            a.href = arg;

            return await this.fetch(new URL(a));
        }

        // ...
        if (arg instanceof URL) {
            return await lfetch(arg.href, (options && options.fetch) || {});
        }

        // ...
        throw new TypeError(
            `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
        );
    }

    /**
     *
     * @param {Array.<String>|Array.<URL>|Array.<Blob>|String|URL|Blob} arg
     * @param {Object} options
     * @returns {Array.<Promise>|Promise}
     */
    async load(arg, options) {
        // ...
        if (Array.isArray(arg)) {
            return await arg.map((a) => this.load(a, options));
        }

        // ...
        const blob = arg instanceof Blob ? arg : await this.fetch(arg, options);

        // ...
        return await lload(blob, options);
    }
}
