/**
 *
 * TODO: provide unit test
 */
const createDynamicWorker = body => {
    // ...
    const url = URL.createObjectURL(
        new Blob(["(", body.toString(), ")()"], {
            type: "application/javascript"
        })
    );

    // ...
    const worker = new Worker(url);

    // ...
    URL.revokeObjectURL(url);

    // ...
    return worker;
};

/**
 *
 * TODO: provide unit test
 */
const createFetchWorker = () => createDynamicWorker(() => (
    /**
     * 
     */
    onmessage = async event => {
        // ...
        try {
            const response = await fetch(
                event.data.href,
                event.data.options
            );
            const blob = await response.blob();

            event.data.status = response.status;
            event.data.statusText = response.statusText;
            event.data.blob = blob;
        } catch (e) {
            event.data.statusText = e;
        }

        // ...
        postMessage(event.data);
    }
));

class LoaderWorker {
    /**
     * 
     */
    #worker = null;

    /**
     * 
     */
    #requests = 0;

    /**
     * 
     */
    terminate() {
        //
        //
        if (this.#requests > 0) {
            this.#requests--;
        }

        //
        if (this.#requests === 0) {
            this.#worker.terminate();

            this.#worker = null;
        }

        //
        return this.#worker;
    }

    /**
     * 
     */
    worker() {
        // ...
        this.#requests++;

        // ...
        if (this.#worker) {
            return this.#worker;
        }

        // ...
        this.#worker = createFetchWorker();

        //
        return this.#worker;
    }
}

/**
 *
 */
export default new LoaderWorker();
