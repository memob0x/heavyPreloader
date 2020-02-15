import LoaderResource from "./loader.resource.mjs";
import _load from "./loader.load.mjs";
import _fetch from "./loader.fetch.mjs";
import _fetchAndLoad from "./loader.fetchload.mjs";
import loaderWorker from "./loader.worker.mjs";

export default class Loader {
    constructor() {
        this.worker = loaderWorker();
    }

    /**
     *
     * @param {Array|String} arg
     * @returns {Array|Promise}
     */
    fetch(arg) {
        // ...
        if (Array.isArray(arg)) {
            return arg.map(a => this.fetch(a));
        }

        // ...
        if (typeof arg === "string") {
            return _fetch.call(this, arg);
        }

        // ...
        return Promise.reject(new Error("invalid argument"));
    }

    /**
     * @param {String|Array|LoaderResource|HTMLElement} arg
     * @returns {Array|Promise}
     */
    load(arg) {
        // ...
        if (Array.isArray(arg)) {
            return arg.map(a => this.load(a));
        }

        // ...
        if (arg instanceof HTMLElement) {
            // TODO: a way to get currentSrc without trigger loads
            return _fetchAndLoad.call(
                this,
                new LoaderResource(arg.dataset.src),
                arg
            );
        }

        // ...
        if (typeof arg === "string") {
            return this.load(new LoaderResource(arg));
        }

        // ...
        if (LoaderResource.isLoaderResource(arg)) {
            return _load.call(this, arg, true);
        }

        // ...
        return Promise.reject(new Error("invalid argument"));
    }
}
