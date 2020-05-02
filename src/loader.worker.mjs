/**
 *
 * @private
 * @static
 * TODO: provide unit test
 */
const createDynamicWorker = (body) => {
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
 * @private
 * @static
 * TODO: provide unit test
 */
const createFetchWorker = () =>
    createDynamicWorker(
        () =>
            (onmessage = async (event) => {
                //
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
            })
    );

/**
 *
 */
export default new (class LoaderWorker {
    constructor() {
        this._worker = null;

        this._requests = 0;
    }

    terminate() {
        //
        //
        if (this._requests > 0) {
            this._requests--;
        }

        //
        if (this._requests === 0) {
            this._worker.terminate();

            this._worker = null;
        }

        //
        return this._worker;
    }

    worker() {
        // ...
        this._requests++;

        // ...
        if (this._worker) {
            return this._worker;
        }

        // ...
        this._worker = createFetchWorker();

        //
        return this._worker;
    }
})();
