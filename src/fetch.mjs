import LoaderWorker from "./worker.mjs";

/**
 * Fetch class, handles http requests using a worker singleton,
 * implements some basic responses memoization (cache)
 */
export default class Fetch {
    /**
     * Fetch instance worker
     */
    #worker = new LoaderWorker();

    /**
     * Memoized responses collection
     * Stores promise objects with the resources urls as keys
     */
    #cache = {};

    /**
     * Gets the cached responses collection
     * @returns {Object} The memoized responses collection
     */
    get cache() {
        return this.#cache;
    }

    /**
     * Erases the cached responses collection
     * @returns {Object} The memoized responses collection
     */
    clear() {
        return this.#cache = {};
    }

    /**
     * Fetches a resource url in the secondary thread and retrieves it as a blob
     * @param {String} href The resource url to be fetched
     * @param {Object} options The fetch options object
     * @returns {Promise} The fetch promise
     */
    async fetch(href, options) {
        // options object composition
        options = {
            cache: true,
            fetch: {}, // workers "fetch" API options
            ...options
        };

        // If cache is true and given resource url response has been already memoized, then return its promise reference
        if (options.cache === true && href in this.#cache) {
            return await this.#cache[href];
        }

        // Stores the promise object to the cache member and returns it at the same time
        return (this.#cache[href] = new Promise((resolve, reject) => {
            // Gets the Web Worker instance (singleton)
            const worker = this.#worker.worker();

            // Sends a message to the worker
            worker.postMessage({
                href: href,
                options: options.fetch
            });

            // Listens to worker messages responses
            // TODO: possibly use messageerror for reject?
            worker.addEventListener("message", event => {
                const data = event.data;

                // If this is another request response (resourse url doesn't match) then skips it
                if (data.href !== href) {
                    return;
                }

                // Sends a termination singal
                // (worker class knows if worker is free and can be terminated or needs to be kept alive)
                this.#worker.terminate();

                // If status is ok then the promise is resolved
                if (data.status === 200) {
                    resolve(data.blob);

                    return;
                }

                // Rejection, an error has occurred during fetch call in worker context
                reject(new Error(`${data.statusText} for ${data.href} resource.`));
            });
        }));
    }
}
