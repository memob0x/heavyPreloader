import { isCORS } from "./loader.utils.mjs";
import LoaderResource from "./loader.resource.mjs";
import _load from "./loader.load.mjs";
import _fetch from "./loader.fetch.mjs";

export default class Loader {
    constructor() {}

    /**
     *
     * @param {Array|String|LoaderResource} arg
     * @returns {Array|Promise}
     */
    fetch(arg) {
        // ...
        if (Array.isArray(arg)) {
            return arg.map(a => this.fetch(a));
        }

        // ...
        if (typeof arg === "string") {
            return this.fetch(new LoaderResource(arg));
        }

        // ...
        if (LoaderResource.isLoaderResource(arg)) {
            return _fetch(arg, false);
        }

        // ...
        return Promise.reject(new Error("invalid argument"));
    }

    /**
     * @param {String|Array|LoaderResource|HTMLElement|NodeList} arg
     * @returns {Array|Promise}
     */
    async load(arg) {
        if (arg instanceof NodeList) {
            return this.load([...arg]);
        }

        // ...
        if (Array.isArray(arg)) {
            return arg.map(a => this.load(a));
        }

        // ...
        if (arg instanceof HTMLElement || typeof arg === "string") {
            return this.load(new LoaderResource(arg));
        }

        // ...
        if (!isCORS(arg)) {
            try {
                arg = await this.fetch(arg);
            } catch (e) {
                return Promise.reject(e);
            }
        }

        // ...
        if (LoaderResource.isLoaderResource(arg)) {
            return _load(arg, true);
        }

        // ...
        return Promise.reject(new Error("invalid argument"));
    }
}
