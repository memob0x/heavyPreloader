import { isCORS } from "./loader.utils.mjs";
import _load from "./loader.load.mjs";
import LoaderResource from "./loader.resource.mjs";
import loaderWorker from "./loader.worker.mjs";

// ...
const collection = {};

/**
 * @param {LoaderResource} resource
 */
export default resource => {
    if (resource.url in collection) {
        return collection[resource.url];
    }

    if (isCORS(resource)) {
        return (collection[resource.url] = _load.call(this, resource, false));
    }

    return (collection[resource.url] = new Promise((resolve, reject) => {
        const worker = loaderWorker();

        worker.postMessage(resource.url);

        worker.addEventListener("message", event => {
            const data = { el: resource.el, ...event.data };

            if (data.url !== resource.url) {
                return;
            }

            if (data.response.status === 200) {
                resolve(new LoaderResource(data));

                return;
            }

            reject(
                new Error(`${data.response.statusText} ${data.response.url}`)
            );
        });
    }));
};
