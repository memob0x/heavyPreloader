import { isCORS } from "./loader.utils.mjs";
import _load from "./loader.load.mjs";
import loaderWorker from "./loader.worker.mjs";
import LoaderResource from "./loader.resource.mjs";

// ...
export const collection = {};

/**
 *
 * @param {LoaderResource} resource
 * @param {Object} options
 */
export default (resource, options = {}) => {
    // ...
    if (resource.url.href in collection) {
        return collection[resource.url.href];
    }

    // ...
    if (isCORS(resource) && options.cors !== "no-cors") {
        return (collection[resource.url.href] = _load(resource, false));
    }

    // ...
    return (collection[resource.url.href] = new Promise((resolve, reject) => {
        const worker = loaderWorker();

        // ...
        worker.postMessage({
            href: resource.url.href,
            options: options
        });

        // ...
        worker.addEventListener("message", event => {
            const data = event.data;

            // ...
            if (data.href !== resource.url.href) {
                return;
            }

            // ...
            if (data.status === 200) {
                resolve(
                    new LoaderResource(
                        {
                            ...resource,
                            ...{
                                blob: data.blob
                            }
                        },
                        true
                    )
                );

                return;
            }

            // ...
            reject(new Error(`${data.statusText} ${data.href}`));
        });
    }));
};
