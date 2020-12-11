/**
 * Creates a dynamic worker, stringifying a given worker body code and passing to a Worker instance through createObjectURL
 * @param {Function} The worker body function
 * @returns {Worker} The worker instance
 */
// TODO: provide unit test
const createDynamicWorker = body => {
    // Encapsulates the given worker body function in a Object URL
    const url = URL.createObjectURL(new Blob(["(", body.toString(), ")()"], {
        type: "application/javascript"
    }));

    // Creates the worker instance
    const worker = new Worker(url);

    // Invalidates the previously created (and consumed) Object URL
    URL.revokeObjectURL(url);

    // Returns the newly created worker instance
    return worker;
};

/**
 * Creates a worker which handles message to fetch dispatched resources urls
 * @returns {Worker} The Worker instance
 */
// TODO: provide unit test
const createFetchWorker = () => createDynamicWorker(() => (
    onmessage = async event => {
        // Tries to fetch the given resource url
        try {
            const response = await fetch(event.data.href, event.data.options);
            
            const blob = await response.blob();

            event.data.status = response.status;
            event.data.statusText = response.statusText;
            event.data.blob = blob;
        } catch (error) {
            event.data.statusText = error;
        }

        // Sends back the processed data
        // Payload can contain an error (if fetch threw) or the response data along with the resource blob
        postMessage(event.data);
    }
));

/**
 * Worker class, handles the worker singleton and its termination
 */
class LoaderWorker {
    /**
     * The worker single instance reference
     */
    #worker = null;

    /**
     * The worker usages counter (when it comes back to 0, the worker can be terminated)
     */
    #requests = 0;

    /**
     * Removes a usage off the counter
     * If usages are 0, terminates the worker
     * @returns {Worker} The single worker instance reference
     */
    terminate() {
        // If there are still usages then removes one
        if (this.#requests > 0) {
            this.#requests--;
        }

        // If there are no usages left, the worker is terminated
        if (this.#requests === 0) {
            this.#worker.terminate();

            this.#worker = null;
        }

        // The worker itself is still returned
        return this.#worker;
    }

    /**
     * Gets the existent worker instance reference or creates a new one
     * Adds a usage to the usages counter
     * @returns {Worker} The single worker instance reference
     */
    worker() {
        // Adds a usage to the usages counter
        this.#requests++;

        // If the worker is not terminated (null) then its reference is returned early
        if (this.#worker) {
            return this.#worker;
        }

        // If there's no worker instance stored, then a new one is created
        this.#worker = createFetchWorker();

        // The worker itself is returned
        return this.#worker;
    }
}

/**
 *
 */
export default new LoaderWorker();
