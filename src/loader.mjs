import { getURL, isSupportedElement } from "./loader.utils.mjs";
import LoaderResource from "./loader.resource.mjs";
import _load from "./loader.load.mjs";
import _fetch from "./loader.fetch.mjs";

export default class Loader {
    constructor(options) {
        this.options = { ...{ fetch: {} }, ...options };
    }

    /**
     *
     * @param {String|Array|LoaderResource|HTMLElement|NodeList} arg
     * @returns {Array|Promise}
     */
    fetch(arg) {
        // ...
        if (arg instanceof NodeList) {
            return this.fetch([...arg]);
        }

        // ...
        if (Array.isArray(arg)) {
            return arg.map(a => this.fetch(a));
        }

        // ...
        if (typeof arg === "string") {
            return this.fetch(getURL(arg));
        }

        // ...
        if (isSupportedElement(arg) || arg instanceof URL) {
            return this.fetch(new LoaderResource(arg));
        }

        // ...
        if (LoaderResource.isLoaderResource(arg)) {
            return _fetch(arg, this.options);
        }

        // ...
        return Promise.reject(new Error("invalid argument"));
    }

    /**
     * @param {String|Array|LoaderResource|HTMLElement|NodeList|URL} arg
     * @returns {Array|Promise}
     */
    load(arg) {
        if (arg instanceof NodeList) {
            return this.load([...arg]);
        }

        // ...
        if (Array.isArray(arg)) {
            return arg.map(a => this.load(a));
        }

        // ...
        if (typeof arg === "string") {
            return this.load(getURL(arg));
        }

        // ...
        if (isSupportedElement(arg) || arg instanceof URL) {
            return this.load(new LoaderResource(arg));
        }

        // ...
        if (LoaderResource.isLoaderResource(arg)) {
            return _load(arg, this.options, true);
        }

        // ...
        return Promise.reject(new Error("invalid argument"));
    }
}
