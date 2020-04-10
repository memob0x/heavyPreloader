import lworker from "./loader.worker.mjs";

// ...
const cache = {};

/**
 * Fetches a resource url in the secondary thread and retrieves it as a blob
 * @private
 * @param {String} href The resource url to be fetched
 * @param {Object} options The fetch options object
 * @returns {Promise} The fetch promise
 */
export default async (href, options) => {
    // ...
    options = {
        ...{
            cache: true,
            fetch: {},
        },
        ...options,
    };

    // ...
    if (options.cache === true && href in cache) {
        return await cache[href];
    }

    // ...
    return (cache[href] = new Promise((resolve, reject) => {
        //
        const worker = lworker.worker();

        // ...
        worker.postMessage({
            href: href,
            options: options.fetch,
        });

        // ...
        // TODO: possibly use messageerror for reject?
        worker.addEventListener("message", (event) => {
            const data = event.data;

            // ...
            if (data.href !== href) {
                return;
            }

            //
            lworker.terminate();

            // ...
            if (data.status === 200) {
                resolve(data.blob);

                return;
            }

            // ...
            reject(new Error(`${data.statusText} for ${data.href} resource.`));
        });
    }));
};
