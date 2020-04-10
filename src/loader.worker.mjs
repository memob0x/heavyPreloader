/**
 *
 * @private
 * @static
 */
const body = () =>
    (onmessage = async (event) => {
        //
        try {
            const response = await fetch(event.data.href, event.data.options);
            const blob = await response.blob();

            event.data.status = response.status;
            event.data.statusText = response.statusText;
            event.data.blob = blob;
        } catch (e) {
            event.data.statusText = e;
        }

        // ...
        postMessage(event.data);
    });

// ...
let lworker = null;
let requests = 0;

/**
 *
 * @private
 */
export const get = () => {
    // ...
    requests++;

    // ...
    if (lworker) {
        return lworker;
    }

    // ...
    const url = URL.createObjectURL(
        new Blob(["(", body.toString(), ")()"], {
            type: "application/javascript",
        })
    );

    // ...
    lworker = new Worker(url);

    // ...
    URL.revokeObjectURL(url);

    //
    return lworker;
};

/**
 *
 * @private
 */
export const terminate = () => {
    //
    requests--;

    //
    if (requests <= 0) {
        lworker.terminate();

        lworker = null;
    }

    return lworker;
};
