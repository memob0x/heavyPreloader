import { getURL, isCORS } from "./loader.utils.mjs";
import _load from "./loader.load.mjs";
import LoaderResource from "./loader.resource.mjs";
import loaderWorker from "./loader.worker.mjs";

/**
 * @param {String} url
 */
export default function(url) {
    this.worker = this.worker || loaderWorker();

    const loc = getURL(url);
    url = loc.href;

    if (isCORS(loc)) {
        return _load.call(this, new LoaderResource(url), false);
    }

    return new Promise((resolve, reject) => {
        this.worker.postMessage(url);

        this.worker.addEventListener("message", event => {
            const data = event.data;

            if (data.url !== url) {
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
    });
}
