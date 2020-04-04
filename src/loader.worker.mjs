import { createWorker } from "./loader.utils.mjs";

/**
 *
 * @private
 * @static
 */
export const work = () => {
    onmessage = async (event) => {
        const data = event.data;

        // ...
        let message;
        try {
            const response = await fetch(data.href, data.options);
            const blob = await response.blob();

            message = {
                status: response.status,
                statusText: response.statusText,
                blob: blob,
            };
        } catch (e) {
            message = {
                status: 0,
                statusText: e,
            };
        }

        // ...
        message.href = data.href;
        postMessage(message);
    };
};

// ...
let worker = null;

/**
 *
 * @private
 */
export const getOrCreateWorker = () =>
    worker ? worker : (worker = createWorker(work));

/**
 *
 * @private
 */
export const possiblyTerminateWorker = () => {
    // TODO: check if no longer in use
    // worker.terminate();
    // worker = null;
};
