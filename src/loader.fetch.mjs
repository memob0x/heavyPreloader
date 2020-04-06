import * as lworker from "./loader.worker.mjs";

// ...
const cache = {};

/**
 *
 * @private
 * @param {String} href
 * @param {Object} options
 */
export default async (href, options = {}) => {
    // ...
    if (href in cache) {
        return await cache[href];
    }

    // ...
    return (cache[href] = new Promise((resolve, reject) => {
        //
        const worker = lworker.get();

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
