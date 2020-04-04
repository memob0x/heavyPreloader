import { getURL } from "./loader.utils.mjs";
import fetch from "./loader.fetch.mjs";

export default class Loader {
    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        this.options = { ...{ fetch: { cors: "no-cors" } }, ...options };
    }

    /**
     *
     * @param {Array.<String>|Array.<URL>|String|URL} arg
     * @returns {Array.<Promise>|Promise}
     */
    fetch(arg) {
        // ...
        if (Array.isArray(arg)) {
            return arg.map((a) => this.fetch(a));
        }

        // ...
        if (typeof arg === "string") {
            return this.fetch(getURL(arg));
        }

        // ...
        if (arg instanceof URL) {
            return fetch(arg.href, this.options);
        }

        // ...
        return Promise.reject(
            new TypeError(
                `Invalid argment of type ${typeof arg} passed to Loader class "fetch" method.`
            )
        );
    }
}
