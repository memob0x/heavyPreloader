import lfetch from "./loader.fetch.mjs";
import lload from "./loader.load.mjs";

export default class Loader {
    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        this.options = {
            ...{ fetch: { cors: "no-cors" } },
            ...options,
        };
    }

    /**
     *
     * @param {Array.<String>|Array.<URL>|String|URL} arg
     * @returns {Array.<Promise>|Promise}
     */
    async fetch(arg) {
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
            return await lfetch(arg.href, this.options);
        }

        // ...
        throw new TypeError(
            `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
        );
    }

    /**
     *
     * @param {Array.<String>|Array.<URL>|String|URL} arg
     * @returns {Array.<Promise>|Promise}
     */
    async load(arg, el) {
        // ...
        if (Array.isArray(arg)) {
            return await arg.map((a) => this.load(a, el));
        }

        // ...
        const blob = await this.fetch(arg);

        // ...
        return await lload(blob, el);
    }
}
